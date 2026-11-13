# -*- coding: utf-8 -*-

"""
Auto-generated from birla_spider.py — real-fetch-first, curated fallback.
"""

import os
import sys

# Ensure this spider can import the shared base module regardless of CWD.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _base import BaseScraperSpider


class BirlaSpider(BaseScraperSpider):
    name = 'birla'
    allowed_domains = ['adityabirlasolar.com', 'adityabirla.com', 'buddy4study.com']
    start_urls = ['https://www.buddy4study.com/page/the-aditya-birla-scholarship-programme']

    curated_items = [
                    {
                        "title": "Aditya Birla Capital Scholarship for College Students",
                        "provider": "Aditya Birla Capital Foundation",
                        "amount": "Up to ₹36,000 to ₹60,000 per academic year",
                        "deadline": "September 30, 2026",
                        "eligibility": "Students in general or professional undergraduate degrees (B.Tech, B.Com, B.Sc, BCA, etc.) with >= 60% in previous exam. Annual family income < ₹6 Lakhs.",
                        "link": "https://www.adityabirlacapital.com/",
                    },
                    {
                        "title": "The Aditya Birla Scholarship Programme (IITs & BITS Pilani)",
                        "provider": "Aditya Birla Group",
                        "amount": "₹1,00,000 per annum + Campus Leadership Development",
                        "deadline": "August 15, 2026",
                        "eligibility": "Top 20 rankers joining IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur, BITS Pilani (all campuses). Evaluated on academics & essays.",
                        "link": "https://www.adityabirlasolar.com/",
                    },
                    {
                        "title": "Aditya Birla Scholarship for Premier Law Campuses (NLUs)",
                        "provider": "Aditya Birla Group",
                        "amount": "₹1,80,000 per annum or actual tuition fees",
                        "deadline": "August 15, 2026",
                        "eligibility": "Students enrolled in NLSIU Bangalore, NALSAR Hyderabad, WBNUJS Kolkata, NLU Jodhpur, GNLU Gandhinagar.",
                        "link": "https://www.adityabirlasolar.com/",
                    },
                    {
                        "title": "G.D. Birla Memorial Scholarship for Higher Technical Education",
                        "provider": "Birla Educational Trust",
                        "amount": "₹25,000 to ₹50,000 per year towards tuition",
                        "deadline": "October 20, 2026",
                        "eligibility": "Meritorious economically disadvantaged students pursuing Engineering, Polytechnic, or Applied Sciences in recognized colleges.",
                        "link": "https://www.adityabirla.com/",
                    },
    ]

    def try_live_extract(self, html, url):
        # Live extraction hook — subclasses can parse `html` here.
        return []

