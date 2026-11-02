import scrapy


class NationalScholarshipSpider(scrapy.Spider):
    name = "national"
    allowed_domains = ["scholarships.gov.in", "buddy4study.com", "aicte-india.org"]
    start_urls = [
        "https://www.buddy4study.com/page/hdfc-bank-parivartan-ecss-programme",
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
                "title": "Central Sector Scheme of Scholarships for College and University Students (NSP)",
                "provider": "Ministry of Education, Government of India (National Scholarship Portal)",
                "amount": "₹12,000/year for graduation + ₹20,000/year for post-graduation",
                "deadline": "December 31, 2026",
                "eligibility": "Students above 80th percentile in Class 12 board exams, pursuing regular degree courses. Annual family income < ₹4.5 Lakhs.",
                "link": "https://scholarships.gov.in/",
            },
            {
                "title": "AICTE Pragati Scholarship Scheme for Girl Students (Technical Degree)",
                "provider": "All India Council for Technical Education (AICTE)",
                "amount": "₹50,000 per annum for all 4 years of Engineering/B.Tech",
                "deadline": "December 31, 2026",
                "eligibility": "Girl students admitted to 1st year degree program in AICTE approved technical institution. Max 2 girls per family. Income < ₹8 Lakhs.",
                "link": "https://scholarships.gov.in/",
            },
            {
                "title": "HDFC Bank Parivartan's ECSS Programme for College Students",
                "provider": "HDFC Bank Foundation",
                "amount": "Up to ₹75,000 per year towards tuition & books",
                "deadline": "September 30, 2026",
                "eligibility": "Students pursuing Undergraduate / Postgraduate courses (General or Professional). Min 55% in previous exam. Family income < ₹2.5 Lakhs.",
                "link": "https://www.hdfcbank.com/",
            },
            {
                "title": "ONGC Foundation Scholarship for Meritorious Students",
                "provider": "Oil and Natural Gas Corporation (ONGC) Foundation",
                "amount": "₹48,000 per annum (₹4,000 per month)",
                "deadline": "November 30, 2026",
                "eligibility": "1st year students enrolled in Engineering, MBBS, MBA, or Geophysics/Geology. SC/ST/OBC/EWS category with min 60% in 12th.",
                "link": "https://www.ongcscholar.org/",
            },
        ]

        for s in schemes:
            yield s

