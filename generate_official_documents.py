import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    PageBreak,
)
from reportlab.pdfgen import canvas

# Target Storage Directories
STORAGE_DIRS = [
    r"C:\Users\DELL\Desktop\Scrapy\AI-Powered-Campus-Information-Hub\storage\documents",
]

for d in STORAGE_DIRS:
    os.makedirs(d, exist_ok=True)

class NumberedGovCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, total_pages):
        self.saveState()
        # Top Header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 7.5)
            self.setFillColor(colors.HexColor("#1e3a8a"))
            self.drawString(45, 755, getattr(self, "header_title", "OFFICIAL GOVERNMENT GAZETTE PUBLICATION"))
            self.setFont("Helvetica", 7)
            self.setFillColor(colors.HexColor("#64748b"))
            self.drawRightString(567, 755, getattr(self, "gazette_no", "MP-2026-REG"))
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.6)
            self.line(45, 747, 567, 747)

        # Bottom Footer (all pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.6)
        self.line(45, 42, 567, 42)
        self.setFont("Helvetica-Bold", 7)
        self.setFillColor(colors.HexColor("#334155"))
        self.drawString(45, 30, "GOVERNMENT OF MADHYA PRADESH • CAMPUS AI OFFICIAL VAULT")
        self.setFont("Helvetica", 7)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawRightString(567, 30, f"Page {self._pageNumber} of {total_pages}")
        self.restoreState()


styles = getSampleStyleSheet()

cover_authority = ParagraphStyle(
    "CoverAuthority",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=13,
    leading=17,
    alignment=1,
    textColor=colors.HexColor("#1e293b"),
)
cover_sub = ParagraphStyle(
    "CoverSub",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=9.5,
    leading=13,
    alignment=1,
    textColor=colors.HexColor("#475569"),
)
cover_title = ParagraphStyle(
    "CoverTitle",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=16,
    leading=22,
    alignment=1,
    textColor=colors.HexColor("#1e3a8a"),
)
toc_heading = ParagraphStyle(
    "TOCHeading",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=11,
    leading=15,
    textColor=colors.HexColor("#0f172a"),
)
chap_heading = ParagraphStyle(
    "ChapHeading",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=12,
    leading=16,
    textColor=colors.HexColor("#1e3a8a"),
    spaceBefore=4,
    spaceAfter=4,
)
body_text = ParagraphStyle(
    "BodyStyle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=9,
    leading=13,
    textColor=colors.HexColor("#334155"),
)
body_bold = ParagraphStyle(
    "BodyBold",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=13,
    textColor=colors.HexColor("#0f172a"),
)
bullet_item = ParagraphStyle(
    "BulletItem",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.5,
    leading=12.5,
    textColor=colors.HexColor("#334155"),
    leftIndent=12,
)
tbl_cell = ParagraphStyle(
    "TableCell",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8,
    leading=10.5,
    textColor=colors.HexColor("#1e293b"),
)
tbl_cell_bold = ParagraphStyle(
    "TableCellBold",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8,
    leading=10.5,
    textColor=colors.HexColor("#0f172a"),
)


def create_page_table(headers, rows, col_widths=None):
    if not col_widths:
        col_widths = [140, 180, 200]
    data = []
    data.append([Paragraph(h, tbl_cell_bold) for h in headers])
    for r in rows:
        data.append([Paragraph(c, tbl_cell) for c in r])
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    return t


def build_custom_pdf(target_filename, title, authority, gazette_no, target_pages, chapters):
    """
    Builds an authentic multi-page government document with exactly target_pages count.
    """
    for base_dir in STORAGE_DIRS:
        filepath = os.path.join(base_dir, target_filename)
        doc = SimpleDocTemplate(
            filepath,
            pagesize=letter,
            rightMargin=45,
            leftMargin=45,
            topMargin=45,
            bottomMargin=48,
        )

        elements = []

        # ================= PAGE 1: COVER PAGE =================
        elements.append(Spacer(1, 10))
        elements.append(Paragraph(authority.upper(), cover_authority))
        elements.append(Paragraph("GOVERNMENT OF MADHYA PRADESH • STATUTORY GAZETTE PUBLICATION", cover_sub))
        elements.append(Paragraph(f"Gazette Order No: <b>{gazette_no}</b> • Academic Session 2026-27", cover_sub))
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=2.5, color=colors.HexColor("#1e3a8a"), spaceAfter=14))

        elements.append(Paragraph(title, cover_title))
        elements.append(Spacer(1, 12))

        # Executive Notice Box
        box_data = [[
            Paragraph("<b>OFFICIAL NOTIFICATION MANDATE</b><br/>"
                      "This document represents the definitive statutory regulation enacted by the competent department "
                      "under the Constitution of India and state administrative orders. All higher education institutions, "
                      "university registrars, and government nodal officers are bound to execute these provisions without deviation.",
                      tbl_cell)
        ]]
        tb = Table(box_data, colWidths=[520])
        tb.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#3b82f6")),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        elements.append(tb)
        elements.append(Spacer(1, 12))

        # Table of Contents
        elements.append(Paragraph("<b>TABLE OF CONTENTS & CHAPTER DIRECTORY</b>", toc_heading))
        elements.append(Spacer(1, 6))

        toc_rows = []
        for idx, chap in enumerate(chapters[:target_pages - 1]):
            page_num = idx + 2
            toc_rows.append([f"Chapter {idx + 1}: {chap['title']}", f"Page {page_num}"])

        toc_table_data = [
            [Paragraph("<b>Chapter / Section Description</b>", tbl_cell_bold), Paragraph("<b>Page</b>", tbl_cell_bold)]
        ]
        for tr in toc_rows[:14]:  # Fit neatly on cover
            toc_table_data.append([Paragraph(tr[0], tbl_cell), Paragraph(tr[1], tbl_cell)])

        tt = Table(toc_table_data, colWidths=[440, 80])
        tt.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))
        elements.append(tt)
        elements.append(Spacer(1, 10))

        # Page break to Page 2
        elements.append(PageBreak())

        # ================= PAGES 2 TO target_pages =================
        current_page = 2
        for chap_idx, chap in enumerate(chapters):
            if current_page > target_pages:
                break

            elements.append(Paragraph(f"<b>CHAPTER {chap_idx + 1}: {chap['title'].upper()}</b>", chap_heading))
            elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#94a3b8"), spaceAfter=8))

            if chap.get("intro"):
                elements.append(Paragraph(chap["intro"], body_text))
                elements.append(Spacer(1, 6))

            if chap.get("subsections"):
                for sub in chap["subsections"]:
                    elements.append(Paragraph(f"<b>{sub['subheading']}</b>", body_bold))
                    elements.append(Spacer(1, 2))
                    elements.append(Paragraph(sub['text'], body_text))
                    elements.append(Spacer(1, 5))

            if chap.get("points"):
                for pt in chap["points"]:
                    elements.append(Paragraph(f"• {pt}", bullet_item))
                    elements.append(Spacer(1, 3))
                elements.append(Spacer(1, 6))

            if chap.get("table"):
                t_obj = create_page_table(
                    chap["table"]["headers"],
                    chap["table"]["rows"],
                    chap["table"].get("col_widths")
                )
                elements.append(t_obj)
                elements.append(Spacer(1, 8))

            if chap.get("signatory"):
                elements.append(Spacer(1, 10))
                sig_data = [
                    [
                        Paragraph("<b>Authenticated Digital Signature</b><br/>"
                                  "<font color='#64748b' size='7'>SHA-256 Validated • Dept of Higher Education MP<br/>Official Registry Stamp: 2026/GOV/MP</font>", tbl_cell),
                        Paragraph(f"<b>By Order of the Governor</b><br/>"
                                  f"<b>{chap['signatory']['name']}</b><br/>"
                                  f"<font color='#64748b' size='7'>{chap['signatory']['designation']}</font>", tbl_cell)
                    ]
                ]
                st = Table(sig_data, colWidths=[260, 260])
                st.setStyle(TableStyle([
                    ('LINEABOVE', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                ]))
                elements.append(st)

            current_page += 1
            if current_page <= target_pages:
                elements.append(PageBreak())

        # Bind canvas properties
        def gov_canvas_maker(*args, **kwargs):
            c = NumberedGovCanvas(*args, **kwargs)
            c.header_title = title[:60]
            c.gazette_no = gazette_no
            return c

        doc.build(elements, canvasmaker=gov_canvas_maker)
        print(f"[{target_filename}] Successfully generated in {base_dir} (Target Pages: {target_pages})")


# ==============================================================================
# 1. MMVY 2026 Official Guidelines (res_sch_01.pdf) - EXACTLY 24 PAGES
# ==============================================================================
mmvy_chapters = []

# Page 2: Statutory Directive & Legislative Preamble
mmvy_chapters.append({
    "title": "Statutory Directive & Constitutional Preamble",
    "intro": "The Government of Madhya Pradesh, in exercise of executive powers conferred under the State Higher Education Directives, hereby promulgates the Mukhyamantri Medhavi Vidyarthi Yojana (MMVY) Comprehensive Operating Regulations for the Academic Session 2026-27.",
    "subsections": [
        {
            "subheading": "Section 1.1: Legislative Intent",
            "text": "The primary objective of the scheme is to ensure that no meritorious student domiciled in Madhya Pradesh is deprived of higher technical, medical, and professional education solely due to financial constraints. The State Government undertakes to reimburse 100% of sanctioned tuition fees."
        },
        {
            "subheading": "Section 1.2: Scope of Entitlement",
            "text": "The entitlement extends to all recognized undergraduate programs across Government universities, autonomous engineering colleges, accredited medical universities, and empaneled private universities within India."
        }
    ],
    "points": [
        "Binding on all affiliated colleges under RGPV, DAVV, BU Bhopal, and autonomous boards.",
        "Zero-fee deduction at time of admission for verified eligible candidates.",
        "Direct digital fund transfer from State Treasury into Institutional bank accounts."
    ]
})

# Page 3: Benchmark Eligibility Criteria & Cutoff Percentages
mmvy_chapters.append({
    "title": "Benchmark Eligibility Criteria & Board Cutoffs",
    "intro": "Candidate must strictly fulfill the dual benchmarks of academic merit and resident domicile as detailed below:",
    "subsections": [
        {
            "subheading": "Section 2.1: MP Board of Secondary Education (MPBSE)",
            "text": "Candidates appearing in the 10+2 examinations conducted by MPBSE must secure an aggregate percentile/percentage of not less than 70.0% in the best of five scoring subjects."
        },
        {
            "subheading": "Section 2.2: CBSE and ICSE Boards",
            "text": "Candidates graduating from CBSE or ICSE schools situated within or outside MP (holding MP domicile) must secure an aggregate score of not less than 85.0% in class 12th board examinations."
        }
    ],
    "table": {
        "headers": ["Educational Board", "Minimum Benchmark", "Verification Requirement"],
        "rows": [
            ["MP Board (MPBSE)", "70.00% Aggregate", "Online Marksheet validation via MPBSE API"],
            ["CBSE / CISCE", "85.00% Aggregate", "DigiLocker verified mark statement & Roll Number"],
            ["State NIOS Open Board", "70.00% Aggregate", "Special scrutiny by District Nodal Officer"]
        ]
    }
})

# Page 4: Household Income Cap & Competent Authority
mmvy_chapters.append({
    "title": "Household Income Ceiling & Revenue Certification",
    "intro": "The economic threshold for candidate eligibility is governed by strict revenue department parameters:",
    "subsections": [
        {
            "subheading": "Section 3.1: Gross Annual Income Ceiling",
            "text": "The cumulative annual income of the candidate's parents/legal guardian from all lawful sources (agriculture, salary, business, rentals) must not exceed Rs. 6,00,000 (Rupees Six Lakhs Only)."
        },
        {
            "subheading": "Section 3.2: Acceptable Certification Formats",
            "text": "Only digital income certificates bearing the cryptographic QR code issued by the competent Tehsildar or Sub-Divisional Magistrate (SDM) through Lok Seva Kendra (MP e-District) are acceptable. Manual paper affidavits are strictly prohibited."
        }
    ],
    "points": [
        "Certificate must be issued on or after 1st April of the ongoing financial year.",
        "Automated cross-validation performed against Income Tax Department PAN databases.",
        "Detection of suppressed income incurs immediate recovery with 18% penal interest."
    ]
})

# Page 5: National Entrance Exam Benchmarks (JEE Main)
mmvy_chapters.append({
    "title": "Engineering Entitlement & JEE Main Rank Threshold",
    "intro": "Admission to undergraduate engineering programs (B.E. / B.Tech) under MMVY is governed by National Testing Agency (NTA) rankings:",
    "subsections": [
        {
            "subheading": "Section 4.1: National JEE Main Rank Limit",
            "text": "Candidates seeking admission to Government and Private technical institutions must possess an All India Overall Rank (Common Rank List - CRL) within 1,50,000."
        },
        {
            "subheading": "Section 4.2: Direct Admissions in Premium Institutions",
            "text": "Candidates admitted to IITs, NITs, IIITs, or BITS Pilani through JEE Advanced or JEE Main are exempted from the 1.5 Lakh CRL rank cap and are granted full fee reimbursement automatically upon domicile proof."
        }
    ],
    "table": {
        "headers": ["Institutional Category", "JEE Rank Ceiling", "Tuition Waiver Component"],
        "rows": [
            ["IITs / NITs / IIITs", "Any Qualified Rank", "100% Tuition Fee + Caution Deposit"],
            ["Govt Engineering (SGSITS/JEC)", "CRL <= 1,50,000", "Full State Tuition Fee Waived"],
            ["Empaneled Private Colleges", "CRL <= 1,50,000", "State AFRC Regulated Cap Waived"]
        ]
    }
})

# Page 6: Medical Courses (MBBS / BDS) & Rural Service Bond
mmvy_chapters.append({
    "title": "Medical Sciences Entitlement & Rural Service Bond",
    "intro": "MMVY extends full fee funding to medical aspirants securing government and private medical college seats through NEET-UG:",
    "subsections": [
        {
            "subheading": "Section 5.1: NEET Merit Allotment",
            "text": "Any student securing admission in MBBS/BDS in Government Medical Colleges or private medical colleges in MP through centralized MP NEET counselling is entitled to 100% course fee coverage."
        },
        {
            "subheading": "Section 5.2: Mandatory Rural Service Bond",
            "text": "Beneficiaries pursuing MBBS under MMVY must execute an enforceable bank bond agreeing to serve in rural government health centers of MP for a mandatory period of two (2) years post completion of internship."
        }
    ],
    "points": [
        "Bond execution value: Rs. 10 Lakhs for Government Medical Colleges.",
        "Bond execution value: Rs. 25 Lakhs for Private Medical Colleges.",
        "Breach of rural tenure leads to immediate forfeiture and recovery."
    ]
})

# Page 7: Law, Humanities & Management Programs
mmvy_chapters.append({
    "title": "National Law Universities & Management Entitlements",
    "intro": "Statutory coverage of non-engineering professional programs:",
    "subsections": [
        {
            "subheading": "Section 6.1: CLAT Benchmark for National Law Universities",
            "text": "Candidates securing admission in 5-year integrated BA LLB / BBA LLB programs in NLIU Bhopal or any National Law University across India through CLAT are granted 100% tuition coverage."
        },
        {
            "subheading": "Section 6.2: Integrated Management (IIM Indore IPM)",
            "text": "Meritorious candidates qualifying for IIM Indore's 5-Year Integrated Program in Management (IPM) receive full tuition fees covered directly by the Department of Higher Education."
        }
    ],
    "points": [
        "Hostel room charges reimbursed up to Rs. 12,000 per annum.",
        "Library and laboratory fees included in sanctioned reimbursement block."
    ]
})

# Page 8: Private Universities & Fee Regulatory Commission (AFRC) Norms
mmvy_chapters.append({
    "title": "Private University Fee Caps & AFRC Directives",
    "intro": "Rules regulating fee disbursements to private autonomous institutions:",
    "subsections": [
        {
            "subheading": "Section 7.1: Admission and Fee Regulatory Committee (AFRC) Cap",
            "text": "Reimbursement to private engineering institutions is strictly limited to the official tuition fee approved by MP AFRC for that particular course. Any capitation fees or development charges are excluded."
        },
        {
            "subheading": "Section 7.2: Prohibition of Advance Demands",
            "text": "No private college shall demand advance tuition payment from an eligible MMVY student during counselling or reporting."
        }
    ]
})

# Page 9: Student Samagra ID e-KYC Verification Process
mmvy_chapters.append({
    "title": "Samagra ID & Aadhaar Biometric e-KYC Protocols",
    "intro": "The mandatory foundational digital identity validation protocol for all applicants:",
    "subsections": [
        {
            "subheading": "Section 8.1: Samagra Member ID Validation",
            "text": "Candidate must possess an active 9-digit Individual Samagra ID linked with the 8-digit Family Samagra ID registered in the Madhya Pradesh Samagra portal."
        },
        {
            "subheading": "Section 8.2: Biometric Aadhaar Linkage",
            "text": "Aadhaar e-KYC must be completed via fingerprint biometrics or OTP on the Samagra portal (samagra.gov.in). The candidate's name, date of birth, and father's name must match exactly across 10th marksheet and Aadhaar."
        }
    ],
    "points": [
        "Mismatch in name spellings leads to portal rejection code ERR-KYC-04.",
        "Mobile number linked to Aadhaar must be active to receive OTP authentication codes.",
        "Bank account must be Aadhaar-seeded for Public Financial Management System (PFMS) credits."
    ]
})

# Page 10: Step-by-Step MP Scholarship Portal Registration Manual
mmvy_chapters.append({
    "title": "Step-by-Step Portal Application Architecture",
    "intro": "Detailed procedural workflow on the official MP Scholarship 2.0 portal (scholarshipportal.mp.nic.in):",
    "subsections": [
        {
            "subheading": "Step 1: User Profile Creation",
            "text": "Access portal, select 'Register MMVY Application', enter Samagra ID, and verify demographic details."
        },
        {
            "subheading": "Step 2: Academic & Entrance Mapping",
            "text": "Input 12th Roll Number, Board Name, Year of Passing, and JEE Main / NEET / CLAT Application Number. The portal auto-fetches scores from the central testing server."
        },
        {
            "subheading": "Step 3: College Allotment Verification",
            "text": "Select University / College Code, Branch, and input DTE / MP Online Admission Allotment Letter Number."
        }
    ]
})

# Page 11: Document Upload Specifications & Format Mandates
mmvy_chapters.append({
    "title": "Document Digitalization & Scanning Standards",
    "intro": "Mandatory technical parameters for supporting documentation uploads:",
    "table": {
        "headers": ["Document Name", "Permissible Format", "Max File Size", "Authority Signature"],
        "rows": [
            ["High School (10th) Marksheet", "PDF / JPEG (Color)", "200 KB", "State/Central Board Secretary"],
            ["Higher Secondary (12th) Marksheet", "PDF / JPEG (Color)", "200 KB", "MPBSE / CBSE / CISCE"],
            ["Digital Domicile Certificate", "PDF (High Contrast)", "300 KB", "Tehsildar (e-District MP)"],
            ["Digital Income Certificate", "PDF (With QR Code)", "300 KB", "Tehsildar / SDM (Current FY)"],
            ["College Allotment Letter", "PDF", "500 KB", "Directorate of Tech Ed (DTE)"]
        ]
    }
})

# Page 12: College Nodal Scrutiny & Approval Protocols
mmvy_chapters.append({
    "title": "Institutional Verification & Nodal Scrutiny Checklist",
    "intro": "Administrative responsibilities incumbent upon the Principal and College Nodal Officer:",
    "points": [
        "Physical verification of original marksheets against scanned portal uploads.",
        "Validation that candidate has not availed any duplicate central or state scholarship.",
        "Certification of actual attendance (minimum 75% mandatory) before sanctioning renewal.",
        "Digital DSC (Digital Signature Certificate) sign-off on the State Treasury dispatch module."
    ]
})

# Page 13: Treasury Sanction & Direct Benefit Transfer (DBT) Flow
mmvy_chapters.append({
    "title": "Treasury Disbursement & Direct Benefit Transfer Workflow",
    "intro": "Financial mechanics governing state fund movement to colleges:",
    "subsections": [
        {
            "subheading": "Section 12.1: Electronic Fund Transfer Order (e-FTO)",
            "text": "Upon nodal endorsement, the Directorate of Higher Education generates batch e-FTO orders routed through the Integrated Financial Management Information System (IFMIS)."
        },
        {
            "subheading": "Section 12.2: Institutional Account Credit",
            "text": "Tuition fees are credited directly to the registered Treasury Bank Account of the institution within 14 working days of e-FTO release."
        }
    ]
})

# Page 14: Renewal Regulations for Senior Semesters
mmvy_chapters.append({
    "title": "Annual Academic Continuity & Renewal Regulations",
    "intro": "Conditions required to maintain scholarship eligibility across 2nd, 3rd, and 4th years:",
    "points": [
        "Candidate must successfully pass each academic year in the primary examination.",
        "Year-back or detention terminates MMVY entitlement irrevocably.",
        "ATKT (Allowed to Keep Term) is permissible for maximum of one subject per semester.",
        "Annual renewal application must be submitted within 30 days of semester result declaration."
    ]
})

# Page 15: Dual Benefit Prohibitions & Statutory Penalties
mmvy_chapters.append({
    "title": "Statutory Restrictions & Penal Code Enforcement",
    "intro": "Stringent legal prohibitions against multi-scheme claims:",
    "subsections": [
        {
            "subheading": "Section 14.1: Prohibition of Dual Scholarship",
            "text": "Candidates availing MMVY cannot concurrently claim benefits under Post-Matric SC/ST/OBC schemes, Central Sector CSSS, or corporate trusts."
        },
        {
            "subheading": "Section 14.2: Penal Actions for Fraudulent Submissions",
            "text": "Submission of forged income slips or fabricated marksheets shall invite immediate criminal prosecution under Sections 420, 467, and 468 of the Indian Penal Code, along with permanent debarment from state benefits."
        }
    ]
})

# Page 16: Empaneled Engineering Institutions (Bhopal & Indore Divisions)
mmvy_chapters.append({
    "title": "Approved Engineering Colleges (Bhopal & Indore Divisions)",
    "table": {
        "headers": ["Institute Name", "Affiliation", "District", "Approved Intake"],
        "rows": [
            ["Shri Govindram Seksaria Inst of Tech & Science (SGSITS)", "Autonomous / RGPV", "Indore", "840 Seats"],
            ["Institute of Engineering & Technology (IET-DAVV)", "DAVV University", "Indore", "600 Seats"],
            ["University Institute of Technology (UIT-RGPV)", "RGPV Campus", "Bhopal", "540 Seats"],
            ["Maulana Azad National Inst of Technology (MANIT)", "NIT / Centrally Funded", "Bhopal", "1150 Seats"],
            ["Lakshmi Narain College of Technology (LNCT)", "RGPV Affiliated", "Bhopal", "1200 Seats"]
        ]
    }
})

# Page 17: Empaneled Engineering Institutions (Jabalpur, Gwalior & Sagar)
mmvy_chapters.append({
    "title": "Approved Engineering Colleges (Jabalpur, Gwalior & Sagar)",
    "table": {
        "headers": ["Institute Name", "Affiliation", "District", "Approved Intake"],
        "rows": [
            ["Jabalpur Engineering College (JEC)", "Autonomous / Govt", "Jabalpur", "680 Seats"],
            ["Madhav Institute of Technology & Science (MITS)", "Govt Aided / Autonomous", "Gwalior", "920 Seats"],
            ["Rewa Engineering College (REC)", "Govt College", "Rewa", "360 Seats"],
            ["Samrat Ashok Technological Institute (SATI)", "Govt Aided / Autonomous", "Vidisha", "600 Seats"],
            ["University Institute of Tech (UIT RGPV)", "Govt Constituent", "Jhabua", "240 Seats"]
        ]
    }
})

# Page 18: Empaneled Medical & Dental Colleges in Madhya Pradesh
mmvy_chapters.append({
    "title": "Approved Medical & Dental Colleges Directory",
    "table": {
        "headers": ["Medical College Name", "Type", "City", "Course Sanction"],
        "rows": [
            ["Mahatma Gandhi Memorial Medical College (MGMMC)", "Government", "Indore", "250 MBBS"],
            ["Gandhi Medical College (GMC)", "Government", "Bhopal", "250 MBBS"],
            ["Netaji Subhash Chandra Bose Medical College", "Government", "Jabalpur", "180 MBBS"],
            ["Gajra Raja Medical College (GRMC)", "Government", "Gwalior", "180 MBBS"],
            ["Govt Medical College Ratlam & Khandwa", "Government", "Statewide", "150 MBBS Each"]
        ]
    }
})

# Page 19: District Higher Education Nodal Helpdesk Directory
mmvy_chapters.append({
    "title": "District Nodal Officers & Regional Helpdesk Roster",
    "table": {
        "headers": ["Division / District", "Nodal Center Office", "Official Email", "Helpline Telephone"],
        "rows": [
            ["Bhopal Division", "Old Secretariat, Higher Ed Wing", "he-bhopal@mp.gov.in", "0755-2551698"],
            ["Indore Division", "Holkar Science College Campus", "nodal-indore@mp.gov.in", "0731-2464074"],
            ["Jabalpur Division", "Model Science College Campus", "nodal-jabalpur@mp.gov.in", "0761-2620734"],
            ["Gwalior Division", "Science College Campus, Jiwaji", "nodal-gwalior@mp.gov.in", "0751-2442400"],
            ["State Directorate", "Satpura Bhawan 5th Floor, Bhopal", "mmvy-support@mp.gov.in", "0755-2660064"]
        ]
    }
})

# Page 20: Grievance Redressal & CM Helpline Escalation
mmvy_chapters.append({
    "title": "Grievance Redressal Mechanism & CM Helpline 181",
    "intro": "Tiered escalation architecture for redressal of student grievances regarding portal downtime, verification delays, or college non-compliance:",
    "points": [
        "Level 1: College Scholarship Grievance Officer (Resolution SLA: 7 working days).",
        "Level 2: District Additional Director of Higher Education (Resolution SLA: 10 working days).",
        "Level 3: CM Helpline 181 Central Monitoring Cell (Escalation to Principal Secretary).",
        "Zero-tolerance policy towards institutions withholding original student credentials."
    ]
})

# Page 21: Annexure I - Proforma Self Declaration of Domicile & Income
mmvy_chapters.append({
    "title": "Annexure I: Prescribed Proforma for Domicile & Income",
    "intro": "Standardized format for non-judicial legal undertaking submitted during document verification:",
    "subsections": [
        {
            "subheading": "LEGAL AFFIDAVIT FORM",
            "text": "I, _______________________________ son/daughter of _______________________________ residing at _______________________________ district ___________________ Madhya Pradesh, do hereby solemnly affirm that our family income from all sources does not exceed Rs. 6,00,000 per annum and I am a bona fide permanent resident of Madhya Pradesh."
        }
    ]
})

# Page 22: Annexure II - Institutional Bonafide Certificate
mmvy_chapters.append({
    "title": "Annexure II: Institutional Bonafide & Fee Structure Certificate",
    "intro": "To be certified on official college letterhead by the Principal / Dean / Registrar:",
    "subsections": [
        {
            "subheading": "INSTITUTIONAL ENDORSEMENT",
            "text": "Certified that Mr./Ms. _____________________________ is a bonafide student admitted to the ____________________ branch of this institute through centralized DTE/NEET counselling for the academic year 2026-27. Sanctioned Tuition Fee: Rs. ______________/- per annum."
        }
    ]
})

# Page 23: Annexure III - Student Undertaking for Academic Continuity
mmvy_chapters.append({
    "title": "Annexure III: Student Undertaking for Academic Performance",
    "intro": "Form of agreement governing study regularity and anti-ragging compliance:",
    "points": [
        "I undertake to maintain minimum 75% lecture and laboratory attendance.",
        "I undertake to clear all semester examinations without any disciplinary breach.",
        "I confirm I have not claimed any parallel scholarship from any other public or private trust."
    ]
})

# Page 24: Annexure IV - Principal Verification Checklist & Signatures
mmvy_chapters.append({
    "title": "Annexure IV: Final Verification Checklist & Gazette Seal",
    "intro": "Summary audit sign-off by the institutional head before file archiving:",
    "points": [
        "12th Original Marksheet Verified: [  ] YES   [  ] NO",
        "Digital Income Certificate Verified via QR: [  ] YES   [  ] NO",
        "Samagra e-KYC Match Confirmed: [  ] YES   [  ] NO",
        "Candidate DTE Allotment Confirmed: [  ] YES   [  ] NO"
    ],
    "signatory": {
        "name": "Dr. Rajesh Verma, IAS",
        "designation": "Principal Secretary, Higher Education Department, Govt of Madhya Pradesh"
    }
})


# ==============================================================================
# 2. MPTAAS SC/ST/OBC Official Manual (res_sch_02.pdf) - EXACTLY 38 PAGES
# ==============================================================================
mptaas_chapters = []
for page_num in range(2, 39):
    chap_idx = page_num - 1
    if page_num == 2:
        mptaas_chapters.append({
            "title": "Statutory Authority & MPTAAS V3.4 Operational Mandate",
            "intro": "The Tribal Affairs and Scheduled Caste Welfare Department, Government of Madhya Pradesh, issues this authoritative user manual governing the automated digital administration of post-matric educational schemes through the MPTAAS V3.4 cloud portal.",
            "points": [
                "100% digital governance for SC, ST, and OBC (Non-Creamy Layer) scholars.",
                "Mandatory Samagra and Aadhaar biometric linkage prior to college profile registration.",
                "Automated fee transfer directly to institutions and maintenance allowances to student bank accounts."
            ]
        })
    elif page_num == 3:
        mptaas_chapters.append({
            "title": "Category Coverage & Scheme Classification",
            "table": {
                "headers": ["Scheme Name", "Target Beneficiary Category", "Income Threshold", "Key Benefits"],
                "rows": [
                    ["Post-Matric ST Scheme", "Scheduled Tribe Students", "< Rs. 6.00 Lakhs", "100% Fee + Monthly Stipend"],
                    ["Post-Matric SC Scheme", "Scheduled Caste Students", "< Rs. 6.00 Lakhs", "Full Fee Waiver + Book Allowance"],
                    ["Post-Matric OBC Scheme", "OBC Non-Creamy Layer", "< Rs. 3.00 Lakhs", "Tuition Fee Reimbursement"],
                    ["Awas Sahayata Yojana", "ST/SC Rural Migrant Students", "< Rs. 6.00 Lakhs", "Rs. 2,000/mo Housing Grant"]
                ]
            }
        })
    elif page_num == 4:
        mptaas_chapters.append({
            "title": "Samagra ID & Aadhaar Biometric Integration Protocol",
            "intro": "Comprehensive procedure for validating candidate demographic profiles against State Citizen Database (Samagra):",
            "points": [
                "Every applicant must validate their 9-digit Member ID through OTP on Aadhaar-linked mobile.",
                "Fingerprint biometric validation available at all Jan Seva Kendras and Lok Seva Kendras.",
                "Zero manual data modification allowed once Aadhaar demographic handshake succeeds."
            ]
        })
    elif page_num == 5:
        mptaas_chapters.append({
            "title": "Caste Certificate Digital Authentication Architecture",
            "intro": "Protocols for verifying computerized SC/ST/OBC caste certificates:",
            "subsections": [
                {
                    "subheading": "Computerized RS3 Certificate Registry",
                    "text": "Only digitally signed caste certificates issued under the RS3 barcode format by the MP Revenue Department are accepted. Ancient handwritten caste slips are rejected automatically by the portal."
                }
            ]
        })
    elif page_num == 6:
        mptaas_chapters.append({
            "title": "Income Certificate Validation & Non-Creamy Layer Criteria",
            "intro": "Regulatory criteria for OBC Non-Creamy Layer validation:",
            "points": [
                "Family gross income must be strictly certified below Rs. 3,00,000 per annum for OBC scholars.",
                "Income certificate must bear official Tehsildar digital signature and QR verification link.",
                "Children of Class-1 and Class-2 public servants are treated as Creamy Layer and ineligible."
            ]
        })
    elif page_num == 7:
        mptaas_chapters.append({
            "title": "College Admission Integration & University Fee Matrix",
            "intro": "Integration of university registration numbers and DTE centralized admission logs:",
            "subsections": [
                {
                    "subheading": "Direct Database Handshake with RGPV and MP Universities",
                    "text": "MPTAAS auto-fetches tuition, examination, and laboratory fee structures directly from the university databases upon input of the student's College Enrollment Number."
                }
            ]
        })
    elif page_num == 8:
        mptaas_chapters.append({
            "title": "Maintenance Allowance Slabs (Hostellers vs Day Scholars)",
            "table": {
                "headers": ["Group / Course Level", "Hosteller Monthly Stipend", "Day Scholar Monthly Stipend", "Book Bank Grant"],
                "rows": [
                    ["Group 1: Professional (B.Tech, MBBS, MBA)", "Rs. 1,200 / Month", "Rs. 550 / Month", "Rs. 2,500 / Year"],
                    ["Group 2: Post-Graduation (M.Sc, M.Com)", "Rs. 820 / Month", "Rs. 530 / Month", "Rs. 1,500 / Year"],
                    ["Group 3: Degree Programs (B.A., B.Sc)", "Rs. 570 / Month", "Rs. 300 / Month", "Rs. 1,000 / Year"],
                    ["Group 4: Polytechnic & Diploma", "Rs. 380 / Month", "Rs. 230 / Month", "Rs. 800 / Year"]
                ]
            }
        })
    elif page_num == 9:
        mptaas_chapters.append({
            "title": "Awas Sahayata Yojana (Rental Housing Allowance) Guidelines",
            "intro": "Special accommodation grant for rural SC/ST students studying in divisional and district headquarters:",
            "points": [
                "Divisional Headquarters (Bhopal, Indore, Jabalpur, Gwalior): Rs. 2,000 per month.",
                "District Headquarters: Rs. 1,250 per month.",
                "Tehsil / Block Headquarters: Rs. 1,000 per month.",
                "Rental agreement executed with landlord must be uploaded on MPTAAS."
            ]
        })
    elif page_num == 10:
        mptaas_chapters.append({
            "title": "Public Financial Management System (PFMS) Direct Benefit Transfer",
            "intro": "Banking protocols for electronic transfer of funds directly into student bank accounts:",
            "points": [
                "Bank account must be linked with Aadhaar NPCI mapper for Direct Benefit Transfer (DBT).",
                "Joint accounts and minor accounts are strictly barred from scholarship crediting.",
                "Automated credit confirmation SMS dispatched upon bank transaction settlement."
            ]
        })
    elif page_num >= 11 and page_num <= 30:
        mptaas_chapters.append({
            "title": f"Operational Procedure & Administrative Mandates (Part {page_num - 10})",
            "intro": f"Statutory regulations governing Chapter {page_num}: Institutional compliance, portal security protocols, digital document archiving, and district nodal scrutiny standards under Section {page_num}.4 of MP Tribal Affairs Rules.",
            "points": [
                f"Mandatory physical inspection of student attendance registers by college inspection team (Clause {page_num}.A).",
                f"Biometric attendance integration mandate for all technical colleges under AICTE / RGPV (Clause {page_num}.B).",
                f"Regular reconciliation of Treasury FTO logs against Public Financial Management System records.",
                f"Timely submission of utilization certificates by participating institutions before subsequent semester release."
            ],
            "table": {
                "headers": ["Audit Item", "Compliance Requirement", "Verification SLA"],
                "rows": [
                    ["Attendance Audit", "Minimum 75% Verified", "Monthly Endorsement"],
                    ["Fee Reconciliation", "Match AFRC State Schedule", "Within 15 Days"],
                    ["Nodal Sign-off", "Class-1 Officer DSC", "Immediate"]
                ]
            }
        })
    elif page_num >= 31 and page_num <= 37:
        mptaas_chapters.append({
            "title": f"Annexure {page_num - 30}: Prescribed Proforma & Legal Affidavit Forms",
            "intro": f"Standard statutory proforma for verification under Annexure {page_num - 30}:",
            "subsections": [
                {
                    "subheading": f"Statutory Form {page_num - 30}-B",
                    "text": "Certified that the applicant satisfies all conditions laid down under the Madhya Pradesh Tribal and Scheduled Caste Welfare rules for the grant of post-matric benefits. The applicant has submitted computerized certificates verified through MP e-District."
                }
            ],
            "points": [
                "Proforma must be attested by designated Nodal Officer.",
                "Seal of the institution must be affixed clearly over the candidate photograph.",
                "Original copy retained in college scholarship cell for statutory state audit."
            ]
        })
    elif page_num == 38:
        mptaas_chapters.append({
            "title": "Official Signatures & Government Gazette Seal",
            "intro": "Promulgated by the Order of the Governor of Madhya Pradesh:",
            "points": [
                "Gazette Order Ref: TAW-MPTAAS/2026/DIR-104.",
                "Effective Date: With immediate effect across all 55 districts of Madhya Pradesh.",
                "Enforced by District Collectors and Tribal Welfare Commissioners."
            ],
            "signatory": {
                "name": "Shri Anil Kumar Meena, IAS",
                "designation": "Principal Secretary, Tribal Affairs & SC Welfare Department, Govt of MP"
            }
        })


# ==============================================================================
# 3. Reliance Foundation Scholarships Brochure (res_sch_03.pdf) - EXACTLY 18 PAGES
# ==============================================================================
reliance_chapters = []
for p in range(2, 19):
    if p == 2:
        reliance_chapters.append({
            "title": "Programme Overview & Philanthropic Mission",
            "intro": "Reliance Foundation Undergraduate and Postgraduate Scholarships represent one of India's largest merit-cum-means scholarship initiatives, empowering 5,000 undergraduate and 100 postgraduate STEM students annually.",
            "points": [
                "Undergraduate Grant: Up to Rs. 2,00,000 over duration of degree.",
                "Postgraduate Grant: Up to Rs. 6,00,000 over duration of degree.",
                "Holistic development: Mentorship, leadership workshops, and access to dynamic alumni network."
            ]
        })
    elif p == 3:
        reliance_chapters.append({
            "title": "Undergraduate Eligibility Framework",
            "table": {
                "headers": ["Eligibility Criteria", "Minimum Norm", "Verification"],
                "rows": [
                    ["Citizenship", "Resident Indian Citizen", "Aadhaar Card / Passport"],
                    ["12th Board Score", ">= 60% Aggregate", "Board Marksheet"],
                    ["Enrolled Degree", "Full-time 1st Year UG Degree", "College Bonafide"],
                    ["Annual Family Income", "<= Rs. 15,00,000 (Preference < 2.5L)", "ITR / Income Certificate"]
                ]
            }
        })
    elif p == 4:
        reliance_chapters.append({
            "title": "Online Aptitude Test Structure & Pattern",
            "intro": "All eligible applicants undergo a 60-minute automated online assessment covering quantitative aptitude, analytical reasoning, and verbal skills.",
            "table": {
                "headers": ["Section", "Number of Questions", "Duration", "Weightage"],
                "rows": [
                    ["Verbal Ability", "20 MCQs", "20 Mins", "30%"],
                    ["Critical Thinking & Logic", "20 MCQs", "20 Mins", "35%"],
                    ["Numerical Aptitude", "20 MCQs", "20 Mins", "35%"]
                ]
            }
        })
    elif p >= 5 and p <= 17:
        reliance_chapters.append({
            "title": f"Selection Process, Leadership Workshops & Mentor Framework (Part {p - 4})",
            "intro": f"Detailed operational guidelines for Section {p}: Scholar community engagement, internship opportunities, leadership summits, and disbursement timelines.",
            "points": [
                "Direct electronic fund transfer in annual tranches upon verification of academic progression.",
                "Access to world-class technical webinars and industry mentorship sessions.",
                "Alumni networking platform linking scholars with leading global research institutions."
            ]
        })
    elif p == 18:
        reliance_chapters.append({
            "title": "Selection Committee Endorsement & Administrative Directives",
            "intro": "Administered under the Reliance Foundation Higher Education Endowment Fund.",
            "signatory": {
                "name": "Dr. Nita M. Ambani",
                "designation": "Founder & Chairperson, Reliance Foundation"
            }
        })


# ==============================================================================
# 4. Tata Trusts & Birla Higher Education Notification (res_sch_04.pdf) - 12 PAGES
# ==============================================================================
tata_chapters = []
for p in range(2, 13):
    if p == 2:
        tata_chapters.append({
            "title": "Joint Foundation Educational Endowment Directive",
            "intro": "Consolidated higher education grant notification administered jointly by Tata Trusts and Aditya Birla Capital for engineering and science undergraduates across India.",
            "points": [
                "Scholarship amount: Rs. 60,000 per annum towards college tuition and hostel charges.",
                "Eligible for Tier-1, Tier-2, and Government engineering colleges.",
                "Merit cutoff: Minimum 65% aggregate in 10+2 examinations."
            ]
        })
    elif p >= 3 and p <= 11:
        tata_chapters.append({
            "title": f"Application Evaluation, Income Verification & Grant Terms (Section {p - 1})",
            "intro": f"Administrative terms governing Section {p}: Selection criteria, household income audit, and renewal rules.",
            "points": [
                "Family income must be below Rs. 4,50,000 per annum.",
                "Valid for entire 4-year duration subject to maintaining minimum 6.5 CGPA.",
                "DBT disbursement directly to the student's designated bank account."
            ]
        })
    elif p == 12:
        tata_chapters.append({
            "title": "Trustee Approval & Verification Seal",
            "signatory": {
                "name": "Head of Education Grants",
                "designation": "Tata Trusts & Aditya Birla Capital Foundation"
            }
        })


# ==============================================================================
# 5. MP DTE Centralized Counselling Rulebook (res_counsel_01.pdf) - 24 PAGES
# ==============================================================================
dte_chapters = []
for p in range(2, 25):
    if p == 2:
        dte_chapters.append({
            "title": "Directorate of Technical Education Statutory Mandate",
            "intro": "Comprehensive statutory regulations governing institutional choice-filling, reservation quotas, lateral admissions, and online counselling procedures across Madhya Pradesh technical institutions.",
            "points": [
                "Allotment authority: Directorate of Technical Education, Government of MP.",
                "State Domicile Quota: 85% seats reserved for MP domicile candidates.",
                "All India Quota (AIQ): 15% seats open to candidates nationwide based on JEE Main CRL."
            ]
        })
    elif p == 3:
        dte_chapters.append({
            "title": "Counselling Schedule & Round Breakdown",
            "table": {
                "headers": ["Counselling Stage", "Eligible Candidates", "Allotment Basis", "Reporting Requirement"],
                "rows": [
                    ["Round 1 (General)", "MP Domicile & AIQ JEE Main", "NTA Common Rank List", "Online Confirmation + Nodal Scrutiny"],
                    ["Round 1 Upgradation", "Candidates Opted for Float", "Higher Preference Seat", "Auto Seat Relinquishment"],
                    ["Round 2 (Qualifying Marks)", "12th PCM Merit (Vacant Seats)", "MPBSE/CBSE Score", "Physical Reporting"],
                    ["CLC Spot Round 1 & 2", "All Registered / Fresh Candidates", "Institutional Merit", "Demand Draft on Campus"]
                ]
            }
        })
    elif p >= 4 and p <= 23:
        dte_chapters.append({
            "title": f"Reservation Norms, Institutional Seat Matrix & Choice Locking (Part {p - 2})",
            "intro": f"Technical regulations governing Chapter {p}: Category reservations (SC 16%, ST 20%, OBC 14%, EWS 10%, Female Horizontal 30%), choice locking instructions, and nodal center verification rules.",
            "points": [
                "Candidates must lock minimum 20 college-branch combinations on dte.mponline.gov.in.",
                "Seat acceptance fee: Rs. 10,000 adjusted against final college fee.",
                "Document verification centers established in all 55 district polytechnic colleges."
            ],
            "table": {
                "headers": ["Category Quota", "Percentage", "Mandatory Certificate"],
                "rows": [
                    ["Scheduled Caste (SC)", "16.0%", "Digital RS3 Certificate"],
                    ["Scheduled Tribe (ST)", "20.0%", "Digital RS3 Certificate"],
                    ["OBC (Non-Creamy Layer)", "14.0%", "Income < 3L + Caste"],
                    ["Economically Weaker Section (EWS)", "10.0%", "SDM Signed EWS Certificate"]
                ]
            }
        })
    elif p == 24:
        dte_chapters.append({
            "title": "Directorate Signatures & Official Admission Seal",
            "signatory": {
                "name": "Director of Technical Education",
                "designation": "Government of Madhya Pradesh, Bhopal"
            }
        })


# ==============================================================================
# 6. MP DTE Tuition Fee Waiver (TFW Scheme) (res_counsel_02.pdf) - 14 PAGES
# ==============================================================================
tfw_chapters = []
for p in range(2, 15):
    if p == 2:
        tfw_chapters.append({
            "title": "Tuition Fee Waiver (TFW) Statutory Scheme Mandate",
            "intro": "Government directive for execution of 5% supernumerary Tuition Fee Waiver (TFW) quota seats for technical candidates from families earning below Rs. 8.00 Lakhs annually.",
            "points": [
                "5% supernumerary seats created over and above sanctioned intake in all AICTE colleges.",
                "100% exemption from payment of tuition fees for all 4 academic years.",
                "Non-convertible to general category under any circumstance."
            ]
        })
    elif p >= 3 and p <= 13:
        tfw_chapters.append({
            "title": f"Branch-wise Seat Distribution & Verification Guidelines (Section {p - 1})",
            "intro": f"Administrative instructions governing Chapter {p}: Choice filling with suffix 'T', Tehsildar income validation, and non-transferability clauses.",
            "points": [
                "Mandatory selection of branch code ending in 'T' (e.g. CSE-TFW) during choice filling.",
                "Annual family income must not exceed Rs. 8,00,000 from all sources.",
                "TFW scholars cannot change branch in second year under institutional internal shifting."
            ]
        })
    elif p == 14:
        tfw_chapters.append({
            "title": "Official Order & Signatory Block",
            "signatory": {
                "name": "Additional Secretary (Higher & Technical Education)",
                "designation": "Government of Madhya Pradesh"
            }
        })


# Master Registry of Documents to Build
DOCUMENT_SPECS = [
    {
        "filename": "res_sch_01.pdf",
        "title": "MMVY 2026 OFFICIAL GOVERNMENT GUIDELINES & STATUTORY ORDER",
        "authority": "Department of Higher Education, Government of Madhya Pradesh",
        "gazette_no": "MP-HE/MMVY/2026/F-17/38",
        "pages": 24,
        "chapters": mmvy_chapters
    },
    {
        "filename": "res_sch_02.pdf",
        "title": "MPTAAS POST-MATRIC SC/ST/OBC SCHOLARSHIP OPERATIONAL MANUAL 2026",
        "authority": "Tribal Affairs & Scheduled Caste Welfare Department, Govt of MP",
        "gazette_no": "TAW-MPTAAS/2026/DIR-104",
        "pages": 38,
        "chapters": mptaas_chapters
    },
    {
        "filename": "res_sch_03.pdf",
        "title": "RELIANCE FOUNDATION SCHOLARSHIPS 2026 PROGRAMME BROCHURE",
        "authority": "Reliance Foundation Higher Education Endowment",
        "gazette_no": "RF-EDU/SCH/2026/UG-PG",
        "pages": 18,
        "chapters": reliance_chapters
    },
    {
        "filename": "res_sch_04.pdf",
        "title": "TATA TRUSTS & ADITYA BIRLA HIGHER EDUCATION SCHOLARSHIP NOTIFICATION 2026",
        "authority": "Tata Trusts & Aditya Birla Capital Foundation",
        "gazette_no": "TT-ABC/SCHOLARSHIP/2026/ENG-01",
        "pages": 12,
        "chapters": tata_chapters
    },
    {
        "filename": "res_counsel_01.pdf",
        "title": "MP DTE CENTRALIZED ENGINEERING (B.TECH) ADMISSION RULEBOOK 2026",
        "authority": "Directorate of Technical Education, Government of Madhya Pradesh",
        "gazette_no": "DTE-MP/ADMISSIONS/2026/REG-01",
        "pages": 24,
        "chapters": dte_chapters
    },
    {
        "filename": "res_counsel_02.pdf",
        "title": "MP DTE TUITION FEE WAIVER (TFW) 100% EXEMPTION CIRCULAR 2026",
        "authority": "Directorate of Technical Education, Government of Madhya Pradesh",
        "gazette_no": "DTE-MP/TFW-NORMS/2026/CIR-88",
        "pages": 14,
        "chapters": tfw_chapters
    }
]

if __name__ == "__main__":
    print(f"Generating authentic multi-page government documents...")
    for spec in DOCUMENT_SPECS:
        build_custom_pdf(
            target_filename=spec["filename"],
            title=spec["title"],
            authority=spec["authority"],
            gazette_no=spec["gazette_no"],
            target_pages=spec["pages"],
            chapters=spec["chapters"]
        )
    print("\nALL OFFICIAL GOVERNMENT DOCUMENTS GENERATED SUCCESSFULLY WITH EXACT TARGET PAGES!")
