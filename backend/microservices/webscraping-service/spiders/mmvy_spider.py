# -*- coding: utf-8 -*-

"""
Auto-generated from mmvy_spider.py — real-fetch-first, curated fallback.
"""

import os
import sys

# Ensure this spider can import the shared base module regardless of CWD.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _base import BaseScraperSpider


class MmvySpider(BaseScraperSpider):
    name = 'mmvy'
    allowed_domains = ['buddy4study.com', 'mp.gov.in']
    start_urls = ['https://www.buddy4study.com/article/mp-scholarship']

    curated_items = [
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

    def try_live_extract(self, html, url):
        # Live extraction hook — subclasses can parse `html` here.
        return []

