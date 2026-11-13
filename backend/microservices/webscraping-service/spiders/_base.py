# -*- coding: utf-8 -*-
"""
Shared, robust scraping base for the Campus AI scholarship / counselling spiders.

Why this exists
----------------
Some target sites are classic HTML (MMVY, MP DTE, MPTAAS) and some are JS/SPA
front-ends (Reliance Foundation, Buddy4Study) whose scholarship details are only
rendered in the browser. A plain HTTP fetch cannot see SPA content, so those
spiders fall back to a maintained curator dataset.

Design
------
- `BaseScraperSpider` tries a real, TLS-verified HTTP fetch of the start URL.
- It runs lightweight heuristics to pull usable lines (headings / paragraphs)
  and/or PDF links from the live HTML.
- If it cannot produce structured items, it emits the curated fallback entries
  (`curated_items`) with a clear log line, so the pipeline always has data.
- The spider does not depend on Scrapy succeeding at its own network fetch:
  start_requests + an errback guarantee output either way.
"""
import os
import re
import ssl
import sys
import socket
from urllib.request import Request, urlopen

import scrapy

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)

HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    "Connection": "close",
}

# Words that suggest a block is scholarship/counselling-relevant.
KEYWORDS = (
    "scholarship", "scholarships", "fellowship", "apply", "deadline",
    "eligibility", "award", "tuition", "stipend", "counselling",
    "admission", "seat", "waiver", "scheme", "yojana", "course",
    "registration", "last date", "benefit",
)


def build_ssl_context():
    ctx = ssl.create_default_context()
    try:
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
    except Exception:
        pass
    return ctx


def fetch_text(url, timeout=25):
    """Return the decoded HTML for a URL, or None on any failure."""
    req = Request(url, headers=HEADERS)
    try:
        with urlopen(req, timeout=timeout, context=build_ssl_context()) as resp:
            raw = resp.read()
            if not raw:
                return None
            ct = resp.headers.get("Content-Type", "")
            if "application/pdf" in ct:
                return None
            return raw.decode("utf-8", errors="replace")
    except Exception as exc:  # network / DNS / TLS / HTTP errors
        print(f"[base] fetch failed for {url}: {repr(exc)[:140]}")
        return None


def strip_html(html):
    """Return readable text from raw HTML with scripts/styles removed."""
    if not html:
        return ""
    text = re.sub(r"(?is)<script.*?</script>", " ", html)
    text = re.sub(r"(?is)<style.*?</style>", " ", text)
    text = re.sub(r"(?is)<[^>]+>", " ", text)
    text = re.sub(r"&nbsp;?", " ", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n", text)
    return text.strip()


def urllib_urljoin(base, rel):
    try:
        from urllib.parse import urljoin
        return urljoin(base, rel)
    except Exception:
        return rel


def extract_pdf_links(html, base_url):
    """Return a deduped list of absolute .pdf links found in HTML."""
    if not html:
        return []
    links = []
    for m in re.finditer(r"(?is)href=[\"']([^\"']+)[\"']", html):
        href = m.group(1).strip()
        if href.lower().endswith(".pdf"):
            links.append(urllib_urljoin(base_url, href))
    seen, out = set(), []
    for u in links:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def generic_extract_scholarships(html, url, tag=""):
    """Very light generic extractor: split text into meaningful lines that
    look scholarship-related. Returns [] almost always for SPA pages so the
    curated fallback is used; may extract something for rich HTML portals.
    """
    text = strip_html(html)
    if not text:
        return []
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    if len(lines) < 3:
        return []
    kw_hits = sum(1 for ln in lines if any(k in ln.lower() for k in KEYWORDS))
    if kw_hits < 3:
        return []
    snippet = " ".join(lines[:6])
    return [{
        "title": f"{tag} — scraped notice",
        "provider": tag,
        "amount": "",
        "deadline": "",
        "eligibility": snippet[:220],
        "link": url,
    }]


class BaseScraperSpider(scrapy.Spider):
    """
    Base spider: real fetch -> heuristic extraction -> curated fallback.
    Subclasses must set `curated_items` (list of dicts) and should set
    `name`, `allowed_domains`, `start_urls`.
    """

    curated_provider = ""

    custom_settings = {
        "ROBOTSTXT_OBEY": False,
        "DOWNLOAD_TIMEOUT": 30,
        "RETRY_TIMES": 1,
        "LOG_LEVEL": "INFO",
        "USER_AGENT": UA,
        "ITEM_PIPELINES": {"pipelines.GoogleSheetPipeline": 300},
        "DOWNLOADER_MIDDLEWARES": {},
        "SPIDER_MIDDLEWARES": {},
    }

    def start_requests(self):
        # Always schedule at least one request so parse() is invoked, even when
        # the real site fetch is left to our own robust fetch_text().
        url = self.start_urls[0] if self.start_urls else "https://example.com/"
        yield scrapy.Request(url=url, callback=self.parse, errback=self.parse_error,
                             dont_filter=True, meta={"dont_retry": True})

    def parse(self, response):
        url = self.start_urls[0] if self.start_urls else response.url
        html = fetch_text(url)
        live_items = self.try_live_extract(html, url)

        if live_items:
            for it in live_items:
                it.setdefault("source", "live")
                yield it
        else:
            print(f"[{self.name}] live scrape yielded nothing — falling back to curated data")
            for it in self.curated_items:
                item = dict(it)
                item.setdefault("source", "curated")
                if not item.get("provider") and self.curated_provider:
                    item["provider"] = self.curated_provider
                yield item

    def parse_error(self, failure):
        # Scrapy's own request failed; our fetch_text already reports the real
        # cause, so just emit the curated fallback to keep data flowing.
        print(f"[{self.name}] scrapy request error ({failure.getErrorMessage()[:120]}) — curated fallback")
        for it in self.curated_items:
            item = dict(it)
            item.setdefault("source", "curated")
            if not item.get("provider") and self.curated_provider:
                item["provider"] = self.curated_provider
            yield item

    def try_live_extract(self, html, url):
        """Subclasses override with their extraction logic."""
        return generic_extract_scholarships(html, url, self.name)
