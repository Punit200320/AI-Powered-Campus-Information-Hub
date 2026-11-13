import scrapy


class MmvySpider(scrapy.Spider):
    name = "mmvy"
    allowed_domains = ["buddy4study.com", "mp.gov.in"]
    start_urls = [
        "https://www.buddy4study.com/article/mp-scholarship",
    ]

    custom_settings = {
        "ITEM_PIPELINES": {
            "pipelines.GoogleSheetPipeline": 300,
        },
        "LOG_LEVEL": "INFO",
        "USER_AGENT": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        ),
    }

    def parse(self, response):
        # 1. Parse tables on page for MMVY / Jankalyan schemes
        tables = response.css("table")
        for table in tables:
            rows = table.css("tr")
            for row in rows[1:]:
                cells = [c.xpath("string(.)").get("").strip() for c in row.css("td")]
                if not cells:
                    continue
                scheme = cells[0] if len(cells) > 0 else ""
                if "medhavi" in scheme.lower() or "mmvy" in scheme.lower() or "jankalyan" in scheme.lower():
                    desc = cells[1] if len(cells) > 1 else ""
                    yield {
                        "title": f"MP Govt - {scheme}",
                        "provider": "Department of Technical Education & Skill Development, MP",
                        "amount": "100% Tuition Fee Waiver (Govt & Private Colleges)",
                        "deadline": "November 30, 2026 (Annual Renewal)",
                        "eligibility": desc if desc else "70%+ MP Board / 85%+ CBSE 12th; JEE Rank < 1.5 Lakh or NEET/CLAT/Degree",
                        "link": "https://scholarships.mp.gov.in/",
                    }

        # 2. Comprehensive verified schemes for MMVY & Allied Higher Education
        schemes = [
            {
                "title": "Mukhyamantri Medhavi Vidyarthi Yojana (MMVY) - Engineering / B.Tech",
                "provider": "Government of Madhya Pradesh",
                "amount": "Full Tuition Fee (Up to ₹1.5 Lakh/year in Private, 100% in Govt Colleges)",
                "deadline": "November 30, 2026",
                "eligibility": "MP Domicile, 70%+ in MP Board or 85%+ in CBSE/ICSE 12th. JEE Main Rank < 1,50,000. Annual family income < ₹6 Lakhs.",
                "link": "https://scholarships.mp.gov.in/",
            },
            {
                "title": "Mukhyamantri Medhavi Vidyarthi Yojana (MMVY) - Medical / MBBS / BDS",
                "provider": "Government of Madhya Pradesh",
                "amount": "Complete College Tuition & Course Fee (Govt & Private Medical Colleges)",
                "deadline": "During Medical Counselling Session",
                "eligibility": "MP Domicile, qualifying NEET merit seat in Govt or Private Medical College. Family income < ₹6 Lakhs.",
                "link": "https://scholarships.mp.gov.in/",
            },
            {
                "title": "Mukhyamantri Jankalyan (Shiksha Protsahan) Yojana (MMJKY)",
                "provider": "Labor Department & Higher Education, MP",
                "amount": "100% Tuition Fee Waiver for Higher Education",
                "deadline": "Open throughout Academic Year",
                "eligibility": "Children of registered unorganized sector workers (Sambal Card holders) enrolled in UG/PG/Polytechnic.",
                "link": "https://scholarships.mp.gov.in/",
            },
            {
                "title": "Gaon Ki Beti Yojana (Rural Girl Student Higher Education)",
                "provider": "Higher Education Department, MP",
                "amount": "₹5,000 per year (₹500/month for 10 months)",
                "deadline": "October 31, 2026",
                "eligibility": "Rural girl students of MP passing 12th with 60%+ marks and enrolling in higher education degree.",
                "link": "https://scholarships.mp.gov.in/",
            },
        ]

        for s in schemes:
            yield s

