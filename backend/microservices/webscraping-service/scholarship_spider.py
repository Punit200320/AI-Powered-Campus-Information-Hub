"""
Scholarship Spider Engine — AI-Powered Campus Information Hub
=============================================================
Multi-source crawler for Indian & Global scholarship programs:
- MPTAAS (MP Tribal Affairs & Welfare Schemes)
- MMVY (Mukhyamantri Medhavi Vidyarthi Yojana)
- Reliance Foundation Undergraduate & Postgraduate Scholarships
- Tata Trusts & Tata Capital Pankh Scholarships
- Aditya Birla Capital & Birla Education Scholarships
- National (NSP, AICTE, HDFC, ONGC)
- Global Fellowships (OpportunityDesk)
"""

import sys
import os
import argparse

# Windows terminal UTF-8 encoding fix
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

# Ensure local service packages can be found
sys.path.insert(0, os.path.dirname(__file__))

import scrapy
from scrapy.crawler import CrawlerProcess
from spiders.mptaas_spider import MptaasSpider
from spiders.mmvy_spider import MmvySpider
from spiders.reliance_spider import RelianceSpider
from spiders.tata_spider import TataSpider
from spiders.birla_spider import BirlaSpider
from spiders.national_spider import NationalScholarshipSpider


class GlobalScholarshipSpider(scrapy.Spider):
    """Spider for curated international fellowships & scholarships"""
    name = "global"
    allowed_domains = ["opportunitydesk.org"]
    start_urls = ["https://opportunitydesk.org/category/fellowships-and-scholarships/"]

    custom_settings = {
        "ITEM_PIPELINES": {
            "pipelines.GoogleSheetPipeline": 300,
        },
        "LOG_LEVEL": "INFO",
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    }

    def parse(self, response):
        articles = response.css("article.l-post")
        count = 0
        for article in articles:
            title = article.css("h2.is-title a::text").get("").strip()
            link = article.css("h2.is-title a::attr(href)").get("").strip()
            cat = article.css("span.post-cat a::text").get("General").strip()
            excerpt = article.css("div.excerpt p::text").get("").strip()

            if not title or "Blog" in cat or "Tips" in title:
                continue

            amount = "Fully-funded" if "fully-funded" in title.lower() or "fully funded" in excerpt.lower() else "Tuition Grant"
            eligibility = excerpt[:120] + "..." if len(excerpt) > 120 else excerpt

            yield {
                "title": title,
                "provider": f"International Fellowships ({cat})",
                "amount": amount,
                "deadline": "Check portal",
                "eligibility": eligibility,
                "link": link,
            }
            count += 1
            if count >= 6:
                break


ALL_SPIDERS = {
    "mptaas": MptaasSpider,
    "mmvy": MmvySpider,
    "reliance": RelianceSpider,
    "tata": TataSpider,
    "birla": BirlaSpider,
    "national": NationalScholarshipSpider,
    "global": GlobalScholarshipSpider,
}


def run_crawlers(selected_spiders=None):
    process = CrawlerProcess({
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "LOG_LEVEL": "INFO",
        "ROBOTSTXT_OBEY": False,
    })

    if not selected_spiders:
        spiders_to_run = list(ALL_SPIDERS.values())
        print(f"\n[Scraper Runner] Launching ALL {len(spiders_to_run)} scholarship spiders...")
    else:
        spiders_to_run = [
            ALL_SPIDERS[name.lower()]
            for name in selected_spiders
            if name.lower() in ALL_SPIDERS
        ]
        print(f"\n[Scraper Runner] Launching selected spiders: {selected_spiders}...")

    for spider_cls in spiders_to_run:
        process.crawl(spider_cls)

    process.start()
    print("\n[Scraper Runner] All scholarship spiders finished crawling!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Campus AI Scholarship Crawler")
    parser.add_argument(
        "--spider",
        choices=list(ALL_SPIDERS.keys()) + ["all"],
        default="all",
        help="Specify which spider to run (default: all)",
    )
    args = parser.parse_args()

    if args.spider == "all":
        run_crawlers()
    else:
        run_crawlers([args.spider])
