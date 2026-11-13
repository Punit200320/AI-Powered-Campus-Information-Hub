# -*- coding: utf-8 -*-

"""
Auto-generated from mptaas_spider.py — real-fetch-first, curated fallback.
"""

import os
import sys

# Ensure this spider can import the shared base module regardless of CWD.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _base import BaseScraperSpider


class MptaasSpider(BaseScraperSpider):
    name = 'mptaas'
    allowed_domains = ['tribal.mp.gov.in', 'buddy4study.com', 'shorturl.at']
    start_urls = ['https://www.tribal.mp.gov.in/CMS', 'https://www.buddy4study.com/article/mp-scholarship', 'https://www.tribal.mp.gov.in/mptaas']

    curated_items = [
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

    def try_live_extract(self, html, url):
        # Live extraction hook — subclasses can parse `html` here.
        return []

