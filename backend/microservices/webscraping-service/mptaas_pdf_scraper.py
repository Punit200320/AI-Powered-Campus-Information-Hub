# -*- coding: utf-8 -*-
"""
Real MPTAAS PDF scraper (Tribal Affairs Dept, MP)
Downloads actual notice/circular/brochure PDFs from
https://www.tribal.mp.gov.in/CMS into backend storage/documents
so the AI service can scan & summarize them.
"""
import os
import re
import sys
import time
import urllib.request
import urllib.parse
import ssl

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Where the gen-ai service scans for PDFs (must match main.py
# `_SCRAPED_DOCS_DIR`).
STORE = os.path.normpath(os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..", "..", "..", "storage", "documents",
))
HOME = "https://www.tribal.mp.gov.in/CMS"

# MMVY (Mukhyamantri Medhavi Vidyarthi Yojana) scholarship portal sources.
# NOTE: The official domain below does NOT resolve from this machine/network
# (DNS lookup fails for scholarsips.mp.gov.in / medhavi.mp.gov.in). The
# scraper is implemented for it and will download as soon as the host is
# reachable; it reports the failure gracefully when it is not.
MMVY_HOMES = [
    "https://scholarships.mp.gov.in/",
    "https://medhavi.mp.gov.in/",
]

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    return urllib.request.urlopen(req, timeout=timeout, context=ctx)


def normalize(url, base=HOME):
    url = url.strip()
    if url.startswith("//"):
        url = "https:" + url
    elif url.startswith("/"):
        url = urllib.parse.urljoin(base, url)
    elif not url.startswith("http"):
        url = urllib.parse.urljoin(base, url)
    url = url.replace(" ", "%20")
    url = url.replace("http://www.tribal.mp.gov.in", "https://www.tribal.mp.gov.in")
    url = url.replace("http://tribal.mp.gov.in", "https://tribal.mp.gov.in")
    url = re.sub(r"(https?://[^/]+)/+", r"\1/", url)
    return url


def safe_filename(url):
    base = os.path.basename(urllib.parse.unquote(url))
    base = re.sub(r"[^A-Za-z0-9._-]+", "_", base).strip("_")
    if not base.lower().endswith(".pdf"):
        base += ".pdf"
    return base


def get_pdf_links(html):
    links = set()
    for m in re.finditer(r'href=["\']([^"\']+\.pdf[^"\']*)["\']', html, re.I):
        links.add(m.group(1))
    for m in re.finditer(r"[\"']([^\"']+\.pdf[^\"']*)[\"']", html, re.I):
        links.add(m.group(1))
    return sorted(links)


def scrap_site(html, home, tag):
    os.makedirs(STORE, exist_ok=True)
    raw = get_pdf_links(html)
    print(f"[{tag}] pdf links found: {len(raw)}")
    downloaded, failed = 0, []
    for u in raw:
        url = normalize(u, home)
        name = safe_filename(url)
        dest = os.path.join(STORE, name)
        if os.path.exists(dest) and os.path.getsize(dest) > 1000:
            print(f"  [exists] {name}")
            continue
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
                data = r.read()
            if len(data) < 500:
                raise ValueError("tiny body (not a pdf?)")
            with open(dest, "wb") as fh:
                fh.write(data)
            print(f"  [OK] {name} ({len(data)} bytes)")
            downloaded += 1
        except Exception as e:
            failed.append((name, url, str(e)))
            print(f"  [FAIL] {name} :: {e}")
        time.sleep(0.5)
    print(f"[{tag}] done: {downloaded} new downloaded, {len(failed)} failed")
    return failed


def scrape_mmvy():
    """Scrape MMVY scholarship PDFs from the official portal(s)."""
    print("== MMVY PDF scraper ==")
    os.makedirs(STORE, exist_ok=True)
    all_failed = []
    got_html = False
    for home in MMVY_HOMES:
        try:
            html = fetch(home).read().decode("utf-8", errors="replace")
            got_html = True
            print("source:", home)
            all_failed += scrap_site(html, home, "MMVY")
            break
        except Exception as e:
            print(f"[MMVY] source unreachable {home} :: {repr(e)[:120]}")
    if not got_html:
        print("[MMVY] WARNING: no MMVY source reachable (DNS/SSL). "
              "PDFs will be downloaded once the portal is reachable.")
    return all_failed


def trigger_ai_summarize():
    """Ask the gen-AI service to rescan the store and summarize new PDFs."""
    print("== Trigger AI summarization ==")
    ai_url = os.environ.get(
        "AI_SERVICE_URL", "http://127.0.0.1:8000/api/v1/scholarships/documents")
    try:
        req = urllib.request.Request(ai_url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as r:
            body = r.read().decode("utf-8", errors="replace")
        print(f"AI summarize trigger status {r.status}; docs count present in response")
        return 0
    except Exception as e:
        print(f"AI summarize trigger failed (service down?): {repr(e)[:120]}")
        return 1


def main():
    os.makedirs(STORE, exist_ok=True)
    print("== MPTAAS PDF scraper ==")
    print("store:", STORE)
    try:
        html = fetch(HOME).read().decode("utf-8", errors="replace")
    except Exception as e:
        print("fetch homepage FAIL:", repr(e))
        return 1

    raw = get_pdf_links(html)
    print("pdf links found:", len(raw))

    failed = scrap_site(html, HOME, "MPTAAS")

    # Also scrape MMVY and trigger AI summarization.
    mmvy_failed = scrape_mmvy()
    failed += mmvy_failed

    pdfs = [f for f in os.listdir(STORE) if f.lower().endswith('.pdf')]
    print("\n== total pdfs now in store:", len(pdfs), "==")

    trigger_ai_summarize()
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
