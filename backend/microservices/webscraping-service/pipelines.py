import os
import json
import gspread

CREDENTIALS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "config", "credentials.json"
)


class GoogleSheetPipeline:
    def open_spider(self, spider):
        print(f"\n[Pipeline] Connecting to Google Sheets (Scholarships_DB) for spider '{spider.name}'...")
        self.existing_titles = set()
        self.sheet = None

        try:
            if os.path.exists(CREDENTIALS_PATH):
                self.gc = gspread.service_account(filename=CREDENTIALS_PATH)
                self.sheet = self.gc.open("Scholarships_DB").sheet1
                # Load existing titles to avoid duplicate entries
                records = self.sheet.col_values(1)
                self.existing_titles = {
                    title.strip().lower() for title in records if title.strip()
                }
                print(f"[Pipeline] Connected! Found {len(self.existing_titles)} existing entries in sheet.")
            else:
                print(f"[Pipeline] Warning: credentials.json not found at {CREDENTIALS_PATH}. Will fallback to JSON.")
        except Exception as e:
            print(f"[Pipeline] Warning: Google Sheets connection error ({e}). Will fallback to JSON.")

    def process_item(self, item, spider):
        title = item.get("title", "").strip()
        if not title:
            return item

        normalized_title = title.lower()
        if normalized_title in self.existing_titles:
            print(f"[Pipeline] Skipping duplicate: {title[:40]}...")
            return item

        row = [
            title,
            item.get("provider", "Official Portal"),
            item.get("amount", "As per norms"),
            item.get("deadline", "Check portal"),
            item.get("eligibility", "Refer to guidelines"),
            item.get("link", ""),
        ]

        # 1. Append to Google Sheets if connected
        if self.sheet:
            try:
                self.sheet.append_row(row)
                self.existing_titles.add(normalized_title)
                print(f"[Pipeline] Saved to Google Sheet: {title[:45]}...")
                return item
            except Exception as e:
                print(f"[Pipeline] Sheet append error: {e}")

        # 2. Local JSON fallback
        local_dump_path = os.path.join(os.path.dirname(__file__), "scraped_scholarships.json")
        try:
            data = []
            if os.path.exists(local_dump_path):
                with open(local_dump_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
            data.append(dict(item))
            with open(local_dump_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            self.existing_titles.add(normalized_title)
            print(f"[Pipeline] Saved to local JSON: {title[:45]}...")
        except Exception as ex:
            print(f"[Pipeline] Local JSON save error: {ex}")

        return item
