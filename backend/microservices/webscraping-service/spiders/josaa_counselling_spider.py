import os
import sys

# Windows console encoding and path fix
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import scrapy


class JosaaCounsellingSpider(scrapy.Spider):
    name = "josaa_counselling"
    allowed_domains = ["josaa.nic.in", "csab.nic.in"]
    start_urls = [
        "https://josaa.nic.in/",
        "https://csab.nic.in/",
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
        counselling_tracks = [
            {
                "title": "JoSAA 2026 Centralized Seat Allocation (IITs, NITs, IIITs & GFTIs)",
                "provider": "Joint Seat Allocation Authority (JoSAA) & Ministry of Education",
                "amount": "Central Govt Institute Seat Allotment + Fee Remission for SC/ST/PH/Income < 1L & 5L",
                "deadline": "Registration & Choice Filling: June 2026 | Rounds 1 to 5 Allotment: June - July 2026",
                "eligibility": "JEE (Advanced) 2026 rank for IITs; JEE (Main) 2026 Paper 1/2 rank for NITs, IIITs, and GFTIs. Must satisfy 75% aggregate in 12th board (65% for SC/ST/PwD) or top 20 percentile.",
                "link": "https://josaa.nic.in/",
            },
            {
                "title": "CSAB Special Rounds 2026 (Central Seat Allocation Board for NIT+ System)",
                "provider": "Central Seat Allocation Board (CSAB) & National Institute of Technology",
                "amount": "Direct Allotment to Vacant Seats in 32 NITs, 26 IIITs, and 38 Other-GFTIs",
                "deadline": "Registration & Fresh Choice Filling: July - August 2026 (2 Special Rounds)",
                "eligibility": "Candidates who appeared in JEE (Main) 2026 and meet basic eligibility. Open to all registered or non-registered JoSAA candidates desiring seat upgrade or new allotment.",
                "link": "https://csab.nic.in/",
            },
            {
                "title": "CSAB Supernumerary Round 2026 for UTs (Andaman & Nicobar, Lakshadweep, Ladakh)",
                "provider": "Central Seat Allocation Board (CSAB)",
                "amount": "Special Quota Reserved Seats at NIT Durgapur, IIEST Shibpur, SVNIT Surat, and NIT Srinagar",
                "deadline": "August 2026",
                "eligibility": "Permanent residents/domicile of Union Territories of Andaman & Nicobar, Lakshadweep, Daman & Diu, Dadra & Nagar Haveli, and Ladakh who qualified JEE Main 2026.",
                "link": "https://csab.nic.in/",
            },
            {
                "title": "CSAB NEUT 2026 (North Eastern States & Union Territories)",
                "provider": "Central Seat Allocation Board (CSAB) on behalf of MHRD / Ministry of Education",
                "amount": "Reserved AICTE Approved Engineering & Architecture Seats across India",
                "deadline": "June - July 2026",
                "eligibility": "Domicile candidates of 8 North-Eastern states (Arunachal, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura) & 5 UTs lacking adequate technical facilities.",
                "link": "https://csab.nic.in/",
            },
            {
                "title": "IIT Fee Remission Scheme under JoSAA Allotment",
                "provider": "Council of IITs & Government of India",
                "amount": "100% Tuition Fee Remission (Income < ₹1 Lakh) | 66.6% Remission (Income ₹1-5 Lakhs)",
                "deadline": "Verified automatically during online document reporting at JoSAA portal",
                "eligibility": "All undergraduate students (B.Tech/Dual Degree) admitted to any IIT via JoSAA whose family gross annual income is below the prescribed thresholds.",
                "link": "https://josaa.nic.in/",
            },
            {
                "title": "NIT & IIIT Tuition Fee Waiver Scheme under JoSAA & CSAB",
                "provider": "Ministry of Education, Government of India",
                "amount": "Full Tuition Fee Waiver for SC/ST/PwD & Economically Backward Students (< ₹1 Lakh)",
                "deadline": "Claimed upon reporting to the allotted National Institute of Technology",
                "eligibility": "Students allotted seats in any of the 31 NITs, IIEST Shibpur, or participating IIITs based on JEE Main ranks.",
                "link": "https://josaa.nic.in/",
            },
        ]

        for item in counselling_tracks:
            yield item
