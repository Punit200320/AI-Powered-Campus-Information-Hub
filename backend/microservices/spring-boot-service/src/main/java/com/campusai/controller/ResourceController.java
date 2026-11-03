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
        String uploadedBy = (String) payload.getOrDefault("uploadedBy", "Campus Contributor");

        Resource res = new Resource();
        res.setId("res_" + System.currentTimeMillis());
        res.setTitle(title);
        res.setDescription(description);
        res.setCategory(category);
        res.setDepartment(department);
        res.setSemester(semester);
        res.setSubject(subject);
        res.setFileType("PDF");
        res.setFileSize("6.4 MB");
        res.setPages(18);
        res.setDownloads(1);
        res.setRating(5.0);
        res.setFacultyVerified(true);
        res.setUploadedAt("Just now");
        res.setUploadedBy(uploadedBy);
        res.setStatus("Indexed");
        res.setPreviewText("Document indexed and accessible in Google Drive academic vault.");

        String catLower = category.toLowerCase();
        String folderId = "1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x"; // default PYQ
        if (catLower.contains("notice")) {
            folderId = "1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q";
        } else if (catLower.contains("note") || catLower.contains("lecture")) {
            folderId = "17K7qVk7_1LgSACWtp58WsgdTaTLYnOSw";
        } else if (catLower.contains("brochure") || catLower.contains("circular")) {
            folderId = "1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh";
        }

        res.setDriveFolderId(folderId);
        res.setDriveUrl("https://drive.google.com/drive/folders/" + folderId);

        resourceRepository.save(res);

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("success", true);
        resp.put("message", "Document confidential record saved to Database and mapped to Google Drive folder!");
        resp.put("resource", toResourceMap(res));
        resp.put("driveUrl", res.getDriveUrl());
        return ResponseEntity.ok(resp);
    }
}

