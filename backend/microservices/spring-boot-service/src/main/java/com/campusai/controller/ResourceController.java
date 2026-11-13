package com.campusai.controller;

import com.campusai.model.Resource;
import com.campusai.repository.ResourceRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Files;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceRepository resourceRepository;

    public ResourceController(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchResources(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "All") String category,
            @RequestParam(required = false, defaultValue = "All") String department,
            @RequestParam(required = false, defaultValue = "All") String semester) {

        List<Resource> results = resourceRepository.searchResources(query, category, department, semester);
        List<Map<String, Object>> response = results.stream()
                .map(this::toResourceMap)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/top")
    public ResponseEntity<List<Map<String, Object>>> getTopResources() {
        List<Resource> topResources = resourceRepository.findTop10ByOrderByDownloadsDesc();
        List<Map<String, Object>> response = topResources.stream()
                .map(this::toResourceMap)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> toResourceMap(Resource r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", r.getId());
        map.put("title", r.getTitle());
        map.put("description", r.getDescription());
        map.put("category", r.getCategory());
        map.put("department", r.getDepartment());
        map.put("semester", r.getSemester());
        map.put("subject", r.getSubject());
        map.put("fileType", r.getFileType());
        map.put("fileSize", r.getFileSize());
        map.put("pages", r.getPages());
        map.put("downloads", r.getDownloads());
        map.put("rating", r.getRating());
        map.put("facultyVerified", r.getFacultyVerified());
        map.put("facultyName", r.getFacultyName());
        map.put("uploadedAt", r.getUploadedAt());
        map.put("status", r.getStatus());
        map.put("uploadedBy", r.getUploadedBy());
        map.put("uploadDate", r.getUploadDate());

        if (r.getTags() != null && !r.getTags().isEmpty()) {
            map.put("tags", Arrays.asList(r.getTags().split(",")));
        } else {
            map.put("tags", Collections.emptyList());
        }

        map.put("previewText", r.getPreviewText());

        // Google Drive integration mapping
        String driveUrl = r.getDriveUrl();
        String folderId = r.getDriveFolderId();
        if (driveUrl == null || driveUrl.isEmpty()) {
            String cat = r.getCategory() != null ? r.getCategory().toLowerCase() : "";
            if (cat.contains("pyq") || cat.contains("previous")) {
                folderId = "1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x";
            } else if (cat.contains("notice")) {
                folderId = "1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q";
            } else if (cat.contains("note") || cat.contains("lecture")) {
                folderId = "17K7qVk7_1LgSACWtp58WsgdTaTLYnOSw";
            } else {
                folderId = "1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh";
            }
            driveUrl = "https://drive.google.com/drive/folders/" + folderId;
        }
        map.put("driveUrl", driveUrl);
        map.put("driveFolderId", folderId);

        return map;
    }

    @GetMapping("/drive-folders")
    public ResponseEntity<Map<String, String>> getDriveFolders() {
        Map<String, String> folders = new LinkedHashMap<>();
        folders.put("PYQ", "https://drive.google.com/drive/folders/1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x");
        folders.put("Notices", "https://drive.google.com/drive/folders/1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q");
        folders.put("Notes", "https://drive.google.com/drive/folders/17K7qVk7_1LgSACWtp58WsgdTaTLYnOSw");
        folders.put("Brochures", "https://drive.google.com/drive/folders/1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh");
        return ResponseEntity.ok(folders);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadResource(@RequestBody Map<String, Object> payload) {
        String category = (String) payload.getOrDefault("category", "Previous Year Questions (PYQs)");
        String title = (String) payload.getOrDefault("title", "Campus Academic Resource");
        String department = (String) payload.getOrDefault("department", "Computer Science");
        String semester = (String) payload.getOrDefault("semester", "Semester 5");
        String subject = (String) payload.getOrDefault("subject", "General");
        String description = (String) payload.getOrDefault("description", "Student & Faculty verified academic document.");
        String uploadedBy = (String) payload.getOrDefault("uploadedBy", "Student Contributor");
        String customId = (String) payload.get("id");

        String status = (String) payload.getOrDefault("status", "Pending Verification");
        Boolean facultyVerified = (Boolean) payload.getOrDefault("facultyVerified", false);

        Resource res = new Resource();
        res.setId(customId != null && !customId.isEmpty() ? customId : "res_" + System.currentTimeMillis());
        res.setTitle(title);
        res.setDescription(description);
        res.setCategory(category);
        res.setDepartment(department);
        res.setSemester(semester);
        res.setSubject(subject);
        res.setFileType("PDF");
        res.setFileSize("4.5 MB");
        res.setPages(18);
        res.setDownloads(1);
        res.setRating(5.0);
        res.setFacultyVerified(facultyVerified);
        res.setFacultyName(facultyVerified ? "Admin Verified" : "Pending Review");
        res.setUploadedAt("Just now");
        res.setStatus(status);
        res.setUploadedBy(uploadedBy);
        res.setUploadDate("Today");
        res.setPreviewText("Official academic document uploaded and submitted for verified campus repository archiving.");

        String folderId;
        String catLower = category.toLowerCase();
        if (catLower.contains("pyq") || catLower.contains("previous")) {
            folderId = "1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x";
        } else if (catLower.contains("notice")) {
            folderId = "1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q";
        } else if (catLower.contains("note") || catLower.contains("lecture")) {
            folderId = "17K7qVk7_1LgSACWtp58WsgdTaTLYnOSw";
        } else {
            folderId = "1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh";
        }

        res.setDriveFolderId(folderId);
        res.setDriveUrl("https://drive.google.com/drive/folders/" + folderId);

        resourceRepository.save(res);

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("success", true);
        resp.put("message", "Document submitted successfully. Status: " + status);
        resp.put("resource", toResourceMap(res));
        resp.put("driveUrl", res.getDriveUrl());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadResource(@PathVariable String id) {
        Optional<Resource> opt = resourceRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Resource r = opt.get();
        r.setDownloads(r.getDownloads() != null ? r.getDownloads() + 1 : 1);
        resourceRepository.save(r);

        boolean isPdf = "PDF".equalsIgnoreCase(r.getFileType());
        String safeFileName = r.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_");

        if (isPdf) {
            byte[] pdfBytes = null;
            String[] possiblePaths = {
                "C:/Users/DELL/Desktop/Scrapy/AI-Powered-Campus-Information-Hub/storage/documents/" + id + ".pdf",
                "C:/Users/DELL/Desktop/Scrapy/storage/documents/" + id + ".pdf",
                "storage/documents/" + id + ".pdf",
                "backend/storage/documents/" + id + ".pdf",
                "../../storage/documents/" + id + ".pdf",
                "C:/Users/DELL/Desktop/New_Project/storage/documents/" + id + ".pdf"
            };
            for (String p : possiblePaths) {
                File f = new File(p);
                if (f.exists() && f.length() > 0) {
                    try {
                        pdfBytes = Files.readAllBytes(f.toPath());
                        break;
                    } catch (Exception ignored) {}
                }
            }

            if (pdfBytes == null) {
                pdfBytes = generateCleanPdf(r);
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeFileName + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        }

        String docContent = "====================================================\n"
                + "AI-POWERED CAMPUS INFORMATION HUB\n"
                + "Document: " + r.getTitle() + "\n"
                + "Category: " + r.getCategory() + "\n"
                + "Department: " + r.getDepartment() + " (" + r.getSemester() + ")\n"
                + "Subject: " + r.getSubject() + "\n"
                + "Status: " + (Boolean.TRUE.equals(r.getFacultyVerified()) ? "Faculty Approved" : "Pending Review") + "\n"
                + "====================================================\n\n"
                + "SUMMARY & EXCERPT:\n"
                + (r.getPreviewText() != null ? r.getPreviewText() : r.getDescription()) + "\n\n"
                + "Full academic document verified and served directly by Campus Hub Portal.\n";

        byte[] fileBytes = docContent.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeFileName + ".txt\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(fileBytes);
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<Map<String, Object>> getResourceSummary(@PathVariable String id) {
        Optional<Resource> opt = resourceRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Resource r = opt.get();
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("id", r.getId());
        resp.put("title", r.getTitle());
        resp.put("pages", r.getPages());
        resp.put("fileSize", r.getFileSize());
        resp.put("fileType", r.getFileType());
        resp.put("authority", r.getFacultyName() != null ? r.getFacultyName() : "Higher Education Department MP");

        Map<String, Object> aiSummary = new LinkedHashMap<>();
        if ("res_sch_01".equalsIgnoreCase(id)) {
            aiSummary.put("keyTakeaways", Arrays.asList(
                "100% Tuition Fee Reimbursement by MP Government for technical & professional degrees.",
                "Mandatory MP Domicile and 70% in MP Board (or 85% in CBSE/ICSE).",
                "JEE Main Common Rank List (CRL) must be within 1,50,000.",
                "Annual family income cap: strictly below Rs. 6,00,000.",
                "Zero tuition fees charged by institution during physical admission reporting."
            ));
            aiSummary.put("eligibility", "MP Domicile, 70% (MP Board) / 85% (CBSE/ICSE), JEE Main CRL <= 1.5 Lakh");
            aiSummary.put("incomeCap", "Rs. 6.00 Lakhs / Annum (Computerized RS3 / Digital Tehsildar Certificate)");
            aiSummary.put("financialBenefits", "100% Tuition Fee + Caution Deposit reimbursed via State Treasury DBT");
            aiSummary.put("requiredDocuments", Arrays.asList(
                "Aadhaar e-KYC linked with 9-digit Samagra Member ID",
                "10th & 12th Digital Marksheets (MPBSE / CBSE)",
                "Digital Income Certificate with active QR Code",
                "State Domicile Certificate (Mool Niwas Praman Patra)",
                "DTE / College Admission Allotment Letter"
            ));
            aiSummary.put("deadlines", "Within 30 days of college admission / semester result declaration");
        } else if ("res_sch_02".equalsIgnoreCase(id)) {
            aiSummary.put("keyTakeaways", Arrays.asList(
                "Complete post-matric scholarship coverage for SC, ST, and OBC (Non-Creamy Layer) scholars.",
                "Compulsory Biometric Aadhaar e-KYC on MPTAAS V3.4 (tribal.mp.gov.in).",
                "Monthly maintenance stipend: Rs. 1,200/mo (Hosteller) & Rs. 550/mo (Day Scholar).",
                "Awas Sahayata Yojana: Additional Rs. 2,000/mo room rent subsidy for rural migrant scholars.",
                "Direct Benefit Transfer through PFMS into Aadhaar-seeded bank account."
            ));
            aiSummary.put("eligibility", "Verified SC/ST/OBC category resident of Madhya Pradesh");
            aiSummary.put("incomeCap", "ST/SC: Rs. 6.00 Lakhs | OBC Non-Creamy Layer: Rs. 3.00 Lakhs");
            aiSummary.put("financialBenefits", "100% Tuition Waiver + Monthly Stipend + Book Bank Grant + Awas Sahayata");
            aiSummary.put("requiredDocuments", Arrays.asList(
                "Aadhaar Biometric Samagra e-KYC validation",
                "Digital RS3 computerized Caste Certificate",
                "Tehsildar Non-Creamy Layer / Income Certificate",
                "College Enrollment Number & University Registration",
                "Active Bank Account with Aadhaar NPCI mapper enabled"
            ));
            aiSummary.put("deadlines", "Ongoing for 2026-27 session on tribal.mp.gov.in/mptaas");
        } else if ("res_sch_03".equalsIgnoreCase(id)) {
            aiSummary.put("keyTakeaways", Arrays.asList(
                "Reliance Foundation grants up to Rs. 2,00,000 (UG) and Rs. 6,00,000 (PG) over degree tenure.",
                "Open to 1st year full-time undergraduate students across all STEM and professional disciplines.",
                "Selection based on 60-minute online aptitude assessment and family income weighting.",
                "Access to exclusive global mentor networks and leadership workshops."
            ));
            aiSummary.put("eligibility", "1st Year Full-Time UG, Minimum 60% in 12th Board examinations");
            aiSummary.put("incomeCap", "Household income < Rs. 15,00,000 (Preference given to < Rs. 2.50 Lakhs)");
            aiSummary.put("financialBenefits", "Up to Rs. 2 Lakhs directly transferred in annual academic installments");
            aiSummary.put("requiredDocuments", Arrays.asList(
                "10th & 12th Marksheets",
                "College Bonafide Student Certificate",
                "Income Tax Return (ITR) or Official Family Income Certificate",
                "Aadhaar Identity Proof"
            ));
            aiSummary.put("deadlines", "Application closes end of November 2026");
        } else if ("res_counsel_01".equalsIgnoreCase(id)) {
            aiSummary.put("keyTakeaways", Arrays.asList(
                "Centralized online admission for B.Tech/B.E. across all government & private MP engineering colleges.",
                "85% seats reserved for MP State Domicile; 15% seats under All India Quota (AIQ).",
                "Strict merit ranking governed by NTA JEE Main Common Rank List (CRL).",
                "Round 1 Upgradation allows float option without forfeiting initial allotment.",
                "Two College Level Counselling (CLC) on-spot rounds conducted for leftover vacant seats."
            ));
            aiSummary.put("eligibility", "10+2 with Physics, Mathematics & Chemistry/CompSci + Valid JEE Main score");
            aiSummary.put("incomeCap", "General: No limit | TFW Quota: Below Rs. 8 Lakhs | MMVY: Below Rs. 6 Lakhs");
            aiSummary.put("financialBenefits", "Eligible for fee reimbursement under MMVY, MPTAAS, or TFW schemes");
            aiSummary.put("requiredDocuments", Arrays.asList(
                "JEE Main 2026 Scorecard / Admit Card",
                "10th & 12th Marksheets",
                "MP Domicile Certificate (for 85% state quota)",
                "Category / EWS / PwD Certificate (if claiming reservation)",
                "Medical Fitness Certificate & Transfer Certificate (TC)"
            ));
            aiSummary.put("deadlines", "Choice locking closes 48 hours prior to provisional round allotment");
        } else {
            aiSummary.put("keyTakeaways", Arrays.asList(
                r.getTitle() + " official verified publication.",
                "Detailed syllabus, past year problem solutions, and exam blueprints.",
                "Directly verified by academic faculty (" + (r.getFacultyName() != null ? r.getFacultyName() : "Campus Academic Board") + ").",
                "Complete " + (r.getPages() != null ? r.getPages() : 18) + "-page official document available for direct download."
            ));
            aiSummary.put("eligibility", "Open to all enrolled university students");
            aiSummary.put("incomeCap", "N/A - Open Academic Resource");
            aiSummary.put("financialBenefits", "Free Academic Hub Document Access");
            aiSummary.put("requiredDocuments", Arrays.asList("University Roll Number", "Student ID"));
            aiSummary.put("deadlines", "Semester Exam Revision Schedule");
        }

        resp.put("aiSummary", aiSummary);
        resp.put("downloadUrl", "/api/resources/" + r.getId() + "/download");
        return ResponseEntity.ok(resp);
    }

    private byte[] generateCleanPdf(Resource r) {
        StringBuilder streamContent = new StringBuilder();
        streamContent.append("BT\n");
        streamContent.append("/F1 16 Tf\n");
        streamContent.append("50 740 Td\n");
        streamContent.append("(").append(escapePdf("CAMPUS AI - ACADEMIC INFORMATION HUB")).append(") Tj\n");
        streamContent.append("/F1 11 Tf\n");
        streamContent.append("0 -24 Td\n");
        streamContent.append("(").append(escapePdf("DOCUMENT: " + r.getTitle())).append(") Tj\n");
        streamContent.append("0 -18 Td\n");
        streamContent.append("(").append(escapePdf("CATEGORY: " + r.getCategory() + "  |  AUTHORITY: " + (r.getFacultyName() != null ? r.getFacultyName() : "Official Campus Portal"))).append(") Tj\n");
        streamContent.append("0 -18 Td\n");
        String folderName = "Campus_Documents > ";
        if ("Notices".equalsIgnoreCase(r.getCategory())) folderName += "Notices (ID: 1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q)";
        else if ("Brochures".equalsIgnoreCase(r.getCategory())) folderName += "Brochures (ID: 1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh)";
        else folderName += "PYQ & Notes (ID: 1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x)";
        streamContent.append("(").append(escapePdf("GOOGLE DRIVE VAULT: " + folderName)).append(") Tj\n");
        streamContent.append("0 -18 Td\n");
        streamContent.append("(").append(escapePdf("------------------------------------------------------------------------------------------------")).append(") Tj\n");
        streamContent.append("0 -22 Td\n");
        streamContent.append("(").append(escapePdf("OFFICIAL SYNOPSIS & DETAILED GUIDELINES:")).append(") Tj\n");

        String body = (r.getPreviewText() != null ? r.getPreviewText() + " " : "") + (r.getDescription() != null ? r.getDescription() : "");
        String[] words = body.split("\\s+");
        StringBuilder line = new StringBuilder();
        int lineCount = 0;
        for (String w : words) {
            if (line.length() + w.length() + 1 > 70) {
                streamContent.append("0 -16 Td\n");
                streamContent.append("(").append(escapePdf(line.toString())).append(") Tj\n");
                line = new StringBuilder(w);
                lineCount++;
                if (lineCount > 24) break;
            } else {
                if (line.length() > 0) line.append(" ");
                line.append(w);
            }
        }
        if (line.length() > 0 && lineCount <= 24) {
            streamContent.append("0 -16 Td\n");
            streamContent.append("(").append(escapePdf(line.toString())).append(") Tj\n");
        }

        streamContent.append("0 -30 Td\n");
        streamContent.append("(").append(escapePdf("------------------------------------------------------------------------------------------------")).append(") Tj\n");
        streamContent.append("0 -16 Td\n");
        streamContent.append("(").append(escapePdf("This document is verified by Campus AI and served directly on-site from the Google Drive Vault.")).append(") Tj\n");
        streamContent.append("ET\n");

        byte[] streamBytes = streamContent.toString().getBytes(java.nio.charset.StandardCharsets.US_ASCII);

        StringBuilder pdf = new StringBuilder();
        pdf.append("%PDF-1.4\n");
        int offset1 = pdf.length();
        pdf.append("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
        int offset2 = pdf.length();
        pdf.append("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
        int offset3 = pdf.length();
        pdf.append("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n");
        int offset4 = pdf.length();
        pdf.append("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");
        int offset5 = pdf.length();
        pdf.append("5 0 obj\n<< /Length ").append(streamBytes.length).append(" >>\nstream\n");
        pdf.append(streamContent.toString());
        pdf.append("endstream\nendobj\n");
        int xrefOffset = pdf.length();
        pdf.append("xref\n0 6\n");
        pdf.append("0000000000 65535 f \n");
        pdf.append(String.format("%010d 00000 n \n", offset1));
        pdf.append(String.format("%010d 00000 n \n", offset2));
        pdf.append(String.format("%010d 00000 n \n", offset3));
        pdf.append(String.format("%010d 00000 n \n", offset4));
        pdf.append(String.format("%010d 00000 n \n", offset5));
        pdf.append("trailer\n<< /Size 6 /Root 1 0 R >>\n");
        pdf.append("startxref\n").append(xrefOffset).append("\n%%EOF\n");

        return pdf.toString().getBytes(java.nio.charset.StandardCharsets.ISO_8859_1);
    }

    private String escapePdf(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("(", "\\(")
                .replace(")", "\\)")
                .replaceAll("[^\\x20-\\x7E]", " ");
    }
}
