# -*- coding: utf-8 -*-
"""
Campus Information Hub - Automated Scheduler
==========================================
Runs the full web-scraping + summary-enrichment + (optionally) Drive/Sheets
sync pipeline on a schedule using ONLY the Python stdlib. This avoids pulling
extra third-party packages (APScheduler etc.) so it works on this offline box.

Usage
-----
  python scheduler.py --run-once          # run the whole pipeline once, exit
  python scheduler.py --daily 02:30       # run daily at 02:30 (server time)
  python scheduler.py --interval-hours 6  # run every 6 hours
  python scheduler.py --daily 02:30 --bootstrap   # run once now, then schedule

Place this file in the project root (next to run_all_spiders.bat). It works
from any CWD.
"""
import argparse
import datetime
import logging
import os
import shutil
import subprocess
import sys
import time

LOG = logging.getLogger("campus-scheduler")

ROOT = os.path.dirname(os.path.abspath(__file__))
SPIDERS_BAT = os.path.join(ROOT, "run_all_spiders.bat")
ENRICH_WORKER = os.path.join(
    ROOT, "backend", "microservices", "gen-ai-and-rag-service", "_enrich_worker.py"
)
FASTAPI_DIR = os.path.join(ROOT, "backend", "microservices", "gen-ai-and-rag-service")


def _setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        stream=sys.stdout,
    )


def _detect_python():
    """Prefer the project venv if present, else system python."""
    candidates = [
        r"C:\Users\DELL\Desktop\Scrapy\.venv\Scripts\python.exe",
        os.path.join(ROOT, ".venv", "Scripts", "python.exe"),
        sys.executable,
    ]
    for c in candidates:
        if c and os.path.exists(c) and os.path.isfile(c):
            return c
    return sys.executable


def run_spiders():
    """Run the 9 scrapy spiders via the existing .bat (it handles env detection)."""
    if not os.path.exists(SPIDERS_BAT):
        LOG.warning("run_all_spiders.bat not found at %s", SPIDERS_BAT)
        return False
    LOG.info("Starting spider batch: %s", SPIDERS_BAT)
    # Prevent the bat from pausing forever in batch mode.
    env = dict(os.environ)
    env["AUTOMATED"] = "1"
    try:
        proc = subprocess.run(
            ["cmd", "/c", SPIDERS_BAT, "--no-pause"],
            cwd=ROOT,
            env=env,
            capture_output=True,
            text=True,
            timeout=3600,  # spiders may be slow; 1h hard cap
            errors="replace",
        )
        LOG.info("Spider batch exit code=%s", proc.returncode)
        if proc.stdout:
            LOG.info("Spider batch stdout (tail):\n%s", proc.stdout[-2000:])
        if proc.returncode != 0 and proc.stderr:
            LOG.warning("Spider batch stderr (tail):\n%s", proc.stderr[-1500:])
        return proc.returncode == 0
    except subprocess.TimeoutExpired:
        LOG.error("Spider batch timed out after 3600s")
        return False
    except Exception as exc:  # pragma: no cover
        LOG.error("Error launching spider batch: %s", exc)
        return False


def run_enrichment():
    """Run the background enrichment worker to (re)generate summaries for newly
    scraped PDFs (OCR + LLM), persisting to _cache/scraped_docs.json."""
    py = _detect_python()
    if not os.path.exists(ENRICH_WORKER):
        LOG.warning("Enrich worker not found: %s", ENRICH_WORKER)
        return False
    LOG.info("Running enrichment worker (this can take a while)...")
    try:
        proc = subprocess.run(
            [py, ENRICH_WORKER],
            cwd=FASTAPI_DIR,
            capture_output=True,
            text=True,
            timeout=7200,  # 2h hard cap
            errors="replace",
        )
        LOG.info("Enrichment exit code=%s", proc.returncode)
        if proc.stdout:
            LOG.info("Enrichment stdout (tail):\n%s", proc.stdout[-1500:])
        return proc.returncode == 0
    except subprocess.TimeoutExpired:
        LOG.error("Enrichment timed out after 7200s")
        return False
    except Exception as exc:  # pragma: no cover
        LOG.error("Enrichment error: %s", exc)
        return False


def run_pipeline(bootstrap=False):
    """The full automated pipeline."""
    LOG.info("=== Campus scheduler pipeline start %s ===", datetime.datetime.now())
    ok = True
    ok = run_spiders() and ok
    ok = run_enrichment() and ok
    LOG.info(
        "=== Pipeline finished %s (overall=%s) ===",
        datetime.datetime.now(),
        "OK" if ok else "PARTIAL/FAILED",
    )
    return ok


def _next_run_daily(daily_str):
    hh, mm = daily_str.split(":")
    now = datetime.datetime.now()
    target = now.replace(hour=int(hh), minute=int(mm), second=0, microsecond=0)
    if target <= now:
        target += datetime.timedelta(days=1)
    return target


def main():
    _setup_logging()
    ap = argparse.ArgumentParser(description="Campus scheduler (stdlib only)")
    ap.add_argument("--run-once", action="store_true", help="run pipeline once, exit")
    ap.add_argument("--daily", type=str, default=None, help="HH:MM local daily time")
    ap.add_argument("--interval-hours", type=float, default=None, help="run every N hours")
    ap.add_argument("--bootstrap", action="store_true", help="run now, then schedule")
    args = ap.parse_args()

    if args.run_once:
        sys.exit(0 if run_pipeline() else 1)

    # bootstrap -> run immediately once
    if args.bootstrap:
        run_pipeline()

    # build schedule
    if args.daily:
        nxt = _next_run_daily(args.daily)
        LOG.info("Scheduled daily at %s (next: %s)", args.daily, nxt)
    elif args.interval_hours:
        nxt = datetime.datetime.now() + datetime.timedelta(hours=args.interval_hours)
        LOG.info("Scheduled every %s h (next: %s)", args.interval_hours, nxt)
    elif args.bootstrap:
        # bootstrap without explicit schedule: go daily at 02:30 by default
        nxt = _next_run_daily("02:30")
        LOG.info("Bootstrap default schedule: daily 02:30 (next: %s)", nxt)
    else:
        ap.print_help()
        sys.exit(2)

    while True:
        now = datetime.datetime.now()
        if now >= nxt:
            run_pipeline()
            if args.daily:
                nxt = _next_run_daily(args.daily)
            elif args.interval_hours:
                nxt = now + datetime.timedelta(hours=args.interval_hours)
            else:
                nxt = _next_run_daily("02:30")
        time.sleep(30)


if __name__ == "__main__":
    main()
