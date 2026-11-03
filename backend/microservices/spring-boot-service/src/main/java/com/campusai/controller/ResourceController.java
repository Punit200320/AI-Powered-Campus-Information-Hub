package com.campusai.controller;

import com.campusai.model.Resource;
import com.campusai.repository.ResourceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

        // Admin approval check: user uploads are "Pending Verification" until approved by Admin
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
        res.setFileType((String) payload.getOrDefault("fileType", "PDF"));
        res.setFileSize((String) payload.getOrDefault("fileSize", "4.8 MB"));
        res.setPages(payload.get("pages") != null ? (Integer) payload.get("pages") : 16);
        res.setDownloads(payload.get("downloads") != null ? (Integer) payload.get("downloads") : 0);
        res.setRating(payload.get("rating") != null ? ((Number) payload.get("rating")).doubleValue() : 4.8);
        res.setFacultyVerified(facultyVerified);
        res.setUploadedAt(facultyVerified ? "Verified" : "Pending Admin Review");
        res.setUploadedBy(uploadedBy);
        res.setStatus(status);
        res.setPreviewText((String) payload.getOrDefault("previewText", "Document indexed in Campus Vault. Direct site download available."));

        String catLower = category.toLowerCase();
        String folderId = "1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x"; // default PYQ
        if (catLower.contains("notice")) {
            folderId = "1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q";
        } else if (catLower.contains("note") || catLower.contains("lecture")) {
            folderId = "17K7qVk7_1LgSACWtp58WsgdTaTLYnOSw";
        } else if (catLower.contains("brochure") || catLower.contains("circular") || catLower.contains("syllabus")) {
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
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + r.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_") + ".txt\"")
                .contentType(org.springframework.http.MediaType.TEXT_PLAIN)
                .body(fileBytes);
    }
}

