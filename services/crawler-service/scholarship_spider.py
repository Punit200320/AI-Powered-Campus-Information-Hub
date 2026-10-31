import re
import os
import gspread
import scrapy
from scrapy.crawler import CrawlerProcess

CREDENTIALS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "config", "credentials.json")


class GoogleSheetPipeline:
    def open_spider(self, spider):
        print("\nConnecting to Google Sheets (Scholarships_DB)...")
        self.gc = gspread.service_account(filename=CREDENTIALS_PATH)
        self.sheet = self.gc.open("Scholarships_DB").sheet1
        print("Connected to Google Sheets!\n")

    def process_item(self, item, spider):
        row = [
            item.get("title", ""),
            item.get("provider", ""),
            item.get("amount", ""),
            item.get("deadline", ""),
            item.get("eligibility", ""),
            item.get("link", ""),
        ]
        try:
            self.sheet.append_row(row)
            print(f"Saved: {item.get('title')[:45]}...")
        except Exception as e:
            print(f"Error saving row: {e}")
        return item


class LiveScholarshipSpider(scrapy.Spider):
    name = "live_scholarships"
    start_urls = ["https://opportunitydesk.org/category/fellowships-and-scholarships/"]

    custom_settings = {
        "ITEM_PIPELINES": {
            "__main__.GoogleSheetPipeline": 300,
        },
        "LOG_LEVEL": "INFO",
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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

            deadline_match = re.search(r"Deadline:\s*([A-Za-z]+ \d{1,2}, \d{4}|\w+)", excerpt)
            deadline = deadline_match.group(1) if deadline_match else "Check website"
            amount = "Fully-funded" if "fully-funded" in title.lower() or "fully funded" in excerpt.lower() else "Tuition / Grant"
            eligibility = excerpt[:120] + "..." if len(excerpt) > 120 else excerpt

            yield {
                "title": title,
                "provider": f"Global Partner ({cat})",
                "amount": amount,
                "deadline": deadline,
                "eligibility": eligibility,
                "link": link,
            }

            count += 1
            if count >= 10:
                break


if __name__ == "__main__":
    process = CrawlerProcess()
    process.crawl(LiveScholarshipSpider)
    process.start()

