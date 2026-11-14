# -*- coding: utf-8 -*-
"""Dedicated out-of-process enrichment worker for scraped PDF documents.

Launched by main.py as a subprocess so that the FastAPI server is never slowed
down by heavy OCR / LLM work. CPU thread-count limits are set BEFORE any heavy
library is imported so this worker does not saturate all machine cores and
starve the API / browser.
"""
import os, sys, json, io

# ---- limit BLAS / OMP threads to keep the machine responsive ----
for _v in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS",
           "NUMEXPR_NUM_THREADS", "VECLIB_MAXIMUM_THREADS", "RAYON_NUM_THREADS"):
    os.environ.setdefault(_v, "1")

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import importlib.util
spec = importlib.util.spec_from_file_location("campus_main", os.path.join(HERE, "main.py"))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

DIR = m._SCRAPED_DOCS_DIR
CACHE_DIR = os.path.join(HERE, "_cache")
CACHE = os.path.join(CACHE_DIR, "scraped_docs.json")

_prev = {}
try:
    if os.path.exists(CACHE):
        with io.open(CACHE, encoding="utf-8") as fh:
            data = json.load(fh)
        if isinstance(data, list):
            for e in data:
                s = e.get("source"); sm = e.get("summary")
                if s and sm:
                    _prev[s] = sm
except Exception:
    pass

results = []
try:
    if not os.path.isdir(DIR):
        sys.exit(0)
    for fname in sorted(os.listdir(DIR)):
        if not fname.lower().endswith(".pdf"):
            continue
        fpath = os.path.join(DIR, fname)
        try:
            with open(fpath, "rb") as fh:
                data = fh.read()
        except Exception:
            continue
        base = os.path.splitext(fname)[0]
        prev = str(_prev.get(fname) or "").strip()
        if prev.startswith("**1.") or "1. Analyze the Image" in prev or prev.lower().startswith("**1."):
            prev = ""
        entry = {
            "id": base,
            "title": base.replace("_", " ").title(),
            "category": "Scholarship Notice / Brochure",
            "fileType": "PDF",
            "pages": m._pdf_page_count(data) if data else 1,
            "summary": prev if len(prev) > 80 else "",
            "source": fname,
            "downloadPath": "/api/v1/scholarships/documents/{0}/download".format(base),
        }
        results.append(entry)

    import time
    for entry in results:
        if entry.get("summary"):
            continue
        fname = entry.get("source", "")
        try:
            fpath = os.path.join(DIR, fname)
            with open(fpath, "rb") as fh:
                data = fh.read()
            text = m._extract_text_from_pdf(data) or ""
            if not text.strip():
                text = "Scraped document content not extractable."
            textlen = len(text.strip())
            npages = m._pdf_page_count(data) if data else 1
            summary = ""
            if text.strip():
                summary = m._summarize_with_llm(text)
            if not summary and textlen < 120 and npages <= 6:
                summary = m._summarize_pdf_with_vision(data)
            if not summary:
                summary = text[:250]
            if summary:
                entry["summary"] = str(summary).strip()
            # yield CPU between heavy per-file work
            time.sleep(0.2)
        except Exception as exc:
            print("[WARN] enrich %s: %s" % (fname, exc))

except Exception as exc:
    print("[WARN] worker scan error: %s" % exc)

try:
    os.makedirs(CACHE_DIR, exist_ok=True)
    with io.open(CACHE, "w", encoding="utf-8") as fh:
        json.dump(results, fh, ensure_ascii=False)
    print("worker wrote %d entries" % len(results))
except Exception as exc:
    print("[WARN] worker persist error: %s" % exc)
