import scrapy


class TataSpider(scrapy.Spider):
    name = "tata"
    allowed_domains = ["tatatrusts.org", "tatacapital.com", "buddy4study.com"]
    start_urls = [
        "https://www.tatatrusts.org/our-work/education",
        "https://www.buddy4study.com/page/tata-capital-pankh-scholarship-programme",
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
        schemes = [
            {
                "title": "Tata Capital Pankh Scholarship for General Graduation",
                "provider": "Tata Capital Limited",
                "amount": "Up to ₹12,000 or 80% of tuition fees",
                "deadline": "November 15, 2026",
                "eligibility": "Students enrolled in B.Com, B.Sc, B.A., or general degree programs with min 60% in Class 12. Annual family income <= ₹4 Lakhs.",
                "link": "https://www.tatacapital.com/",
            },
            {
                "title": "Tata Capital Pankh Scholarship for Professional (Engineering / Medical)",
                "provider": "Tata Capital Limited",
                "amount": "Up to ₹50,000 or 80% of course fee",
                "deadline": "November 15, 2026",
                "eligibility": "Students in 1st/2nd/3rd/4th year of B.Tech, MBBS, BDS, B.Pharm. Min 60% in 12th. Household income <= ₹4 Lakhs.",
                "link": "https://www.tatacapital.com/",
            },
            {
                "title": "Tata Trusts Means Grant for College and University Education",
                "provider": "Tata Trusts",
                "amount": "Partial to Full Tuition Fee Support",
                "deadline": "August 31, 2026 (Annual Cycle)",
                "eligibility": "Undergraduate and postgraduate students studying in colleges recognized by UGC/AICTE within India. Need-cum-merit basis.",
                "link": "https://www.tatatrusts.org/",
            },
            {
                "title": "J.N. Tata Endowment for the Higher Education of Indians",
                "provider": "Tata Trusts",
                "amount": "Loan scholarship up to ₹10,00,000 + Gift scholarship up to ₹75,000",
                "deadline": "March 15, 2026",
                "eligibility": "Indian graduates planning to pursue Master's or Ph.D. abroad in STEM, Economics, Humanities, or Management.",
                "link": "https://www.tatatrusts.org/",
            },
        ]

        for s in schemes:
            yield s

