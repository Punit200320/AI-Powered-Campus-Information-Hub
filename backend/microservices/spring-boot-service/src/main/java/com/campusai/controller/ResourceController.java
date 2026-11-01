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
        return map;
    }
}

