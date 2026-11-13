import os
import sys
import scrapy

# Add parent directory to path so pipelines can be loaded regardless of CWD
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))



class MptaasSpider(scrapy.Spider):
    name = "mptaas"
    allowed_domains = ["tribal.mp.gov.in", "buddy4study.com", "shorturl.at"]
    start_urls = [
        "https://www.tribal.mp.gov.in/CMS",
        "https://www.buddy4study.com/article/mp-scholarship",
        "https://www.tribal.mp.gov.in/mptaas",
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
        # 1. Scrape live official notices & circulars from Tribal Affairs Department /CMS Popup Modal
        if "tribal.mp.gov.in/cms" in response.url.lower():
            anchors = response.css("a")
            for a in anchors:
                text = a.xpath("string(.)").get("").strip()
                text = " ".join(text.split())
                href = a.attrib.get("href", "").strip()
                if text and any(kw in text for kw in ["सूचना", "शिक्षक", "परीक्षा", "प्रवेश", "सत्र", "eHRMS", "EMRS", "आदेश", "विशिष्ट"]):
                    full_link = response.urljoin(href)
                    yield {
                        "title": f"MP Tribal - {text}",
                        "provider": "Department of Tribal Affairs, Govt of MP",
                        "amount": "Official Government Notice / PDF Circular",
                        "deadline": "Active Session 2026-27",
                        "eligibility": "Applicable for Tribal Affairs Beneficiaries / Candidates / Staff",
                        "link": full_link,
                    }

        # 2. Parse MP Scholarship Table from Buddy4Study
        if "buddy4study.com" in response.url:
            tables = response.css("table")
            for table in tables:
                rows = table.css("tr")
                for row in rows[1:]:
                    cells = [c.xpath("string(.)").get("").strip() for c in row.css("td")]
                    if not cells:
                        continue
                    scheme = cells[0] if len(cells) > 0 else ""
                    if any(kw in scheme.lower() for kw in ["mptaas", "st", "sc", "obc", "awas", "pratibha"]):
                        second_val = cells[1] if len(cells) > 1 else ""
                        third_val = cells[2] if len(cells) > 2 else ""

                        provider = "MP Tribal Affairs Department (MPTAAS)"
                        deadline = third_val if "202" in third_val or "throughout" in third_val.lower() else "Accepted throughout the year"
                        amount = "100% Tuition Fee Waiver + Maintenance Allowance"
                        eligibility = second_val if second_val else "MP Domicile, SC/ST/OBC category pursuing Higher Education"

                        yield {
                            "title": f"MPTAAS - {scheme}",
                            "provider": provider,
                            "amount": amount,
                            "deadline": deadline,
                            "eligibility": eligibility,
                            "link": "https://www.tribal.mp.gov.in/mptaas",
                        }

        # 3. Core verified MPTAAS schemes
        core_schemes = [
            {
                "title": "MPTAAS Post Matric Scholarship Scheme for ST Students",
                "provider": "Madhya Pradesh Tribal Welfare Department (MPTAAS)",
                "amount": "Full Tuition Fee Waiver + ₹550 to ₹1200/month stipend",
                "deadline": "Open throughout academic session",
                "eligibility": "MP Domicile, ST Category, pursuing UG/PG/Diploma courses. Annual family income < ₹6 Lakhs.",
                "link": "https://www.tribal.mp.gov.in/mptaas",
            },
            {
                "title": "MPTAAS Post Matric Scholarship Scheme for SC Students",
                "provider": "Department of Scheduled Caste Welfare, MP",
                "amount": "Full Tuition Fee + Compulsory Non-Refundable fees reimbursement",
                "deadline": "Open throughout academic session",
                "eligibility": "MP Domicile, SC Category enrolled in recognized College/University. Family income < ₹6 Lakhs.",
                "link": "https://www.tribal.mp.gov.in/mptaas",
            },
            {
                "title": "MPTAAS Post Matric Scholarship Scheme for OBC Students",
                "provider": "Backward Classes & Minorities Welfare Dept, MP",
                "amount": "100% College Tuition Fee reimbursement",
                "deadline": "Open throughout academic session",
                "eligibility": "MP Domicile, OBC Non-Creamy Layer, pursuing Degree/Professional courses. Family income < ₹3 Lakhs.",
                "link": "https://www.tribal.mp.gov.in/mptaas",
            },
            {
                "title": "MPTAAS Awas Sahayata Yojana (College Housing Scheme)",
                "provider": "Tribal Affairs Department, MP",
                "amount": "₹1,000 to ₹2,000 per month room rent allowance",
                "deadline": "Along with Post Matric Scholarship",
                "eligibility": "SC/ST students pursuing college education in rented rooms/hostels outside native town.",
                "link": "https://www.tribal.mp.gov.in/mptaas",
            },
            {
                "title": "MPTAAS Pratibha Yojana (National Exam Incentive)",
                "provider": "Tribal Welfare Department, MP",
                "amount": "₹50,000 one-time financial reward upon national admission",
                "deadline": "Within 1 year of admission",
                "eligibility": "SC/ST students of MP who qualify JEE Advanced, AIIMS/NEET, NLU, or IIM.",
                "link": "https://www.tribal.mp.gov.in/mptaas",
            },
        ]

        for s in core_schemes:
            yield s
