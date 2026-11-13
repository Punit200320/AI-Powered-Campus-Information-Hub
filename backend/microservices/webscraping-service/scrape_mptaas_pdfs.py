#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Real web scraper for MPTAAS official portal (Madhya Pradesh Tribal Welfare Dept).

Fetches https://www.tribal.mp.gov.in/CMS, discovers every .pdf link on the page,
downloads the PDFs into the FastAPI scraped-documents folder
(New_Project/storage/documents/), and prints what was fetched so the pipeline
can summarize them.

This is REAL scraping: nothing here is hardcoded except the source URL and the
output directory.
"""
import os
import re
import sys
import hashlib

try:
    import requests
    REQUESTS_OK = True
except Exception:  # pragma: no cover
    REQUESTS_OK = False

SOURCE_URL = "https://www.tribal.mp.gov.in/CMS"

# The FastAPI _SCRAPED_DOCS_DIR: New_Project/storage/documents
# script lives at webscraping-service/scrape_mptaas_pdfs.py
# -> up 3 levels (webscraping-service -> microservices -> backend -> New_Project)
STORAGE_DOCS_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..", "..", "..", "storage", "documents",
)


def discover_pdf_links(html: str) -> list:
    """Return list of absolute .pdf URLs found in the page HTML."""
    links = []
    raw = re.findall(r'<a[^>]+href=["\']([^"\']+\.pdf)["\']', html, re.I)
    for href in raw:
        href = href.strip()
        if not href:
            continue
        if href.startswith("//"):
            href = "https:" + href
        elif href.startswith("/"):
            href = "https://www.tribal.mp.gov.in" + href
        elif not href.lower().startswith("http"):
            href = os.path.join(SOURCE_URL, href)
        # normalize backslashes + spaces
        href = href.replace("\\", "/").replace(" ", "%20")
        if href not in links:
            links.append(href)
    return links


def safe_filename(url: str) -> str:
    """Make a filesystem-safe, prefixed filename from a PDF URL."""
    base = os.path.basename(url.split("?")[0])
    base = re.sub(r"[^\w.\-]", "_", base)
    if not base.lower().endswith(".pdf"):
        base += ".pdf"
    return "mptaas_" + base


def download_html() -> str:
    if REQUESTS_OK:
        r = requests.get(SOURCE_URL, timeout=25,
                         headers={"User-Agent": "Mozilla/5.0"})
        r.raise_for_status()
        return r.text
    # fallback: urllib
    import urllib.request
    req = urllib.request.Request(SOURCE_URL,
                                 headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read().decode("utf-8", errors="replace")


def download_pdf(url: str, dest_dir: str) -> str:
    fname = safe_filename(url)
    out = os.path.join(dest_dir, fname)
    tmp = out + ".part"
    if REQUESTS_OK:
        r = requests.get(url, timeout=40, stream=True,
                         headers={"User-Agent": "Mozilla/5.0"})
        r.raise_for_status()
        with open(tmp, "wb") as fh:
            for chunk in r.iter_content(chunk_size=65536):
                if chunk:
                    fh.write(chunk)
    else:
        import urllib.request
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=40) as resp, open(tmp, "wb") as fh:
            fh.write(resp.read())
    os.replace(tmp, out)
    return out


def main() -> int:
    print("== MPTAAS PDF scraper ==")
    print("source   :", SOURCE_URL)
    print("output   :", STORAGE_DOCS_DIR)

    if not os.path.isdir(STORAGE_DOCS_DIR):
        os.makedirs(STORAGE_DOCS_DIR, exist_ok=True)
        print("[created output dir]")

    print("\n[1/3] Fetching page...")
    html = download_html()
    links = discover_pdf_links(html)
    print("  found %d .pdf links (before dedupe filter)" % len(links))

    # dedupe by filename
    seen = set()
    unique = []
    for u in links:
        k = safe_filename(u)
        if k in seen:
            continue
        seen.add(k)
        unique.append(u)
    print("  unique PDFs to download: %d" % len(unique))

    print("\n[2/3] Downloading PDFs...")
    downloaded = []
    already = 0
    failed = []
    for i, u in enumerate(unique, 1):
        dest = os.path.join(STORAGE_DOCS_DIR, safe_filename(u))
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            already += 1
            print("  [skip existed] %s" % os.path.basename(dest))
            continue
        try:
            fp = download_pdf(u, STORAGE_DOCS_DIR)
            downloaded.append(fp)
            print("  [ok %d/%d] %s (%d bytes)"
                  % (i, len(unique), os.path.basename(fp), os.path.getsize(fp)))
        except Exception as exc:  # noqa: BLE001
            failed.append(u)
            print("  [FAIL] %s -> %r" % (u, exc))

    print("\n[3/3] Summary")
    print("  downloaded: %d, already present: %d, failed: %d"
          % (len(downloaded), already, len(failed)))
    if failed:
        print("  failed URLs:")
        for f_ in failed:
            print("    - " + f_)
    print("\nTotal PDFs now in %s:" % STORAGE_DOCS_DIR)
    for fn in sorted(os.listdir(STORAGE_DOCS_DIR)):
        if fn.lower().endswith(".pdf"):
            p = os.path.join(STORAGE_DOCS_DIR, fn)
            print("   - %s (%d bytes)" % (fn, os.path.getsize(p)))
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
