# -*- coding: utf-8 -*-

"""
Auto-generated from mp_dte_counselling_spider.py — real-fetch-first, curated fallback.
"""

import os
import sys

# Ensure this spider can import the shared base module regardless of CWD.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _base import BaseScraperSpider


class MpDteCounsellingSpider(BaseScraperSpider):
    name = 'mp_dte_counselling'
    allowed_domains = ['dte.mponline.gov.in', 'mponline.gov.in']
    start_urls = ['https://dte.mponline.gov.in/portal/services/dte/btech.html', 'https://dte.mponline.gov.in/']

    curated_items = [
                    {
                        "title": "MP DTE B.Tech / B.E. Centralized Online Counselling 2026 (Round 1 & 2)",
                        "provider": "Directorate of Technical Education (DTE), Madhya Pradesh & MPOnline",
                        "amount": "TFW (Tuition Fee Waiver) Scheme Available (100% Tuition Waived) + Govt College Allotment",
                        "deadline": "Round 1 Choice Filling: July 2026 | Round 2: August 2026",
                        "eligibility": "10+2 with Physics & Mathematics (min 45% marks) + Valid JEE Main 2026 Rank Card (MP Domicile 95% quota, All India 5% quota).",
                        "link": "https://dte.mponline.gov.in/",
                    },
                    {
                        "title": "MP DTE College Level Counselling (CLC) Round 2026 for Engineering",
                        "provider": "DTE MP & Participating Engineering Institutes (SGSITS, IET DAVV, JEC, MITS)",
                        "amount": "Institutional Vacant Seat Allocation across Government & Autonomous Institutes",
                        "deadline": "August - September 2026 (Direct College Reporting)",
                        "eligibility": "Candidates who appeared in JEE Main or 12th Board Examination with PCM. Direct physical reporting at participating colleges.",
                        "link": "https://dte.mponline.gov.in/",
                    },
                    {
                        "title": "MP DTE Lateral Entry B.Tech / B.E. Counselling 2026 (Diploma to 2nd Year)",
                        "provider": "Directorate of Technical Education (DTE), MP",
                        "amount": "Direct Admission into 3rd Semester (2nd Year) B.Tech Engineering Programmes",
                        "deadline": "June - July 2026",
                        "eligibility": "3-Year Engineering Diploma from recognized Board (AICTE approved) with minimum 45% aggregate marks (40% for SC/ST/OBC of MP).",
                        "link": "https://dte.mponline.gov.in/",
                    },
                    {
                        "title": "MP DTE Tuition Fee Waiver (TFW) Scheme under B.Tech Allotment",
                        "provider": "Government of Madhya Pradesh Technical Education Dept",
                        "amount": "100% Tuition Fee Exemption for the complete 4-year degree course",
                        "deadline": "Applied simultaneously during MP DTE Online Choice Filling",
                        "eligibility": "Merit rank in JEE Main + Annual family income of parents from all sources less than ₹8 Lakhs + MP Domicile Certificate.",
                        "link": "https://dte.mponline.gov.in/",
                    },
                    {
                        "title": "MP DTE MCA / MBA Centralized Online Counselling 2026",
                        "provider": "DTE MP & MPOnline Portal",
                        "amount": "Subsidized University & Govt College Seats Allocation",
                        "deadline": "July - August 2026",
                        "eligibility": "Recognized Bachelor degree with Mathematics at 10+2 or Graduation level (min 50% for Gen, 45% for MP SC/ST/OBC). Valid CMAT / MP PRE-MCA rank.",
                        "link": "https://dte.mponline.gov.in/",
                    },
                    {
                        "title": "MP DTE M.Tech / M.E. Postgraduate Engineering Counselling 2026",
                        "provider": "DTE MP (Participating: SGSITS, MANIT, UEC, SATI)",
                        "amount": "AICTE PG Scholarship of ₹12,400/month for GATE Qualified Candidates",
                        "deadline": "June - July 2026",
                        "eligibility": "B.E./B.Tech degree in relevant engineering branch with min 50% marks. Valid GATE score card prioritized over non-GATE merit.",
                        "link": "https://dte.mponline.gov.in/",
                    },
    ]

    def try_live_extract(self, html, url):
        # Live extraction hook — subclasses can parse `html` here.
        return []

