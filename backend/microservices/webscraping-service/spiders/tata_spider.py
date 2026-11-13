# -*- coding: utf-8 -*-

"""
Auto-generated from tata_spider.py — real-fetch-first, curated fallback.
"""

import os
import sys

# Ensure this spider can import the shared base module regardless of CWD.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _base import BaseScraperSpider


class TataSpider(BaseScraperSpider):
    name = 'tata'
    allowed_domains = ['tatatrusts.org', 'tatacapital.com', 'buddy4study.com']
    start_urls = ['https://www.tatatrusts.org/our-work/education', 'https://www.buddy4study.com/page/tata-capital-pankh-scholarship-programme']

    curated_items = [
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

    def try_live_extract(self, html, url):
        # Live extraction hook — subclasses can parse `html` here.
        return []

