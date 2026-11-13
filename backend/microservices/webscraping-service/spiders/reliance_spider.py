# -*- coding: utf-8 -*-

"""
Auto-generated from reliance_spider.py — real-fetch-first, curated fallback.
"""

import os
import sys

# Ensure this spider can import the shared base module regardless of CWD.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _base import BaseScraperSpider


class RelianceSpider(BaseScraperSpider):
    name = 'reliance'
    allowed_domains = ['scholarships.reliancefoundation.org', 'buddy4study.com']
    start_urls = ['https://www.scholarships.reliancefoundation.org/', 'https://www.buddy4study.com/page/reliance-foundation-scholarships']

    curated_items = [
                    {
                        "title": "Reliance Foundation Undergraduate Scholarships",
                        "provider": "Reliance Foundation",
                        "amount": "Up to ₹2,00,000 over the course of degree",
                        "deadline": "October 15, 2026",
                        "eligibility": "Resident Indian citizen, 1st year full-time undergraduate degree in any stream. Min 60% in 12th. Household income < ₹15 Lakhs (preference < ₹2.5L).",
                        "link": "https://www.scholarships.reliancefoundation.org/",
                    },
                    {
                        "title": "Reliance Foundation Postgraduate Scholarships (STEM & AI)",
                        "provider": "Reliance Foundation",
                        "amount": "Up to ₹6,00,000 for degree duration + Mentorship & Leadership summits",
                        "deadline": "December 17, 2026",
                        "eligibility": "1st year PG students in Computer Science, Artificial Intelligence, Mathematics, Electrical, Mechanical, Renewable Energy, Material Science. Gate score / aptitude evaluated.",
                        "link": "https://www.scholarships.reliancefoundation.org/",
                    },
                    {
                        "title": "Dhirubhai Ambani Scholarship Programme (Physically Challenged)",
                        "provider": "Reliance Foundation",
                        "amount": "Complete College Tuition + Books & Hostel Allowance",
                        "deadline": "Rolling Admissions",
                        "eligibility": "Specially-abled meritorious students pursuing recognized Degree/Diploma in Indian Universities.",
                        "link": "https://www.scholarships.reliancefoundation.org/",
                    },
    ]

    def try_live_extract(self, html, url):
        # Live extraction hook — subclasses can parse `html` here.
        return []

