package com.campusai.controller;

import com.campusai.model.Resource;
import com.campusai.model.User;
import com.campusai.repository.ResourceRepository;
import com.campusai.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public AdminController(ResourceRepository resourceRepository, UserRepository userRepository) {
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalStudents = userRepository.count();
        long totalDocs = resourceRepository.count();

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalStudents", totalStudents);
        metrics.put("facultyMembers", userRepository.findAll().stream()
                .filter(u -> "faculty".equals(u.getRole())).count());
        metrics.put("totalDocuments", totalDocs);
        metrics.put("aiQueriesToday", 8942);
        metrics.put("vectorStorageSize", "4.8 GB");
        metrics.put("avgResponseLatency", "240 ms");
        metrics.put("accuracyScore", "99.4%");
        metrics.put("systemUptime", "99.98%");

        List<Map<String, Object>> queryTrends = List.of(
            Map.of("time", "08:00", "queries", 210, "tokens", 45000),
            Map.of("time", "10:00", "queries", 780, "tokens", 180000),
            Map.of("time", "12:00", "queries", 1420, "tokens", 340000),
            Map.of("time", "14:00", "queries", 1890, "tokens", 490000),
            Map.of("time", "16:00", "queries", 1650, "tokens", 410000),
            Map.of("time", "18:00", "queries", 1320, "tokens", 320000),
            Map.of("time", "20:00", "queries", 1100, "tokens", 260000),
            Map.of("time", "22:00", "queries", 570, "tokens", 140000)
        );

        List<Map<String, Object>> popularQueries = List.of(
            Map.of("query", "Dijkstra algorithm vs Bellman-Ford", "count", 842, "department", "CS"),
            Map.of("query", "Mid-term fee payment deadline", "count", 710, "department", "General"),
            Map.of("query", "Virtual memory page replacement FIFO vs LRU", "count", 685, "department", "CS"),
            Map.of("query", "Campus placement eligibility CGPA cutoffs", "count", 620, "department", "Placements"),
            Map.of("query", "Transformer self-attention matrix derivation", "count", 540, "department", "AI"),
            Map.of("query", "Hostel night pass portal issue", "count", 430, "department", "Administration")
        );

        List<Resource> docsQueue = resourceRepository.findDocumentsQueue();
        List<Map<String, Object>> documentsQueue = docsQueue.stream().map(r -> {
            Map<String, Object> doc = new LinkedHashMap<>();
            doc.put("id", r.getId());
            doc.put("title", r.getTitle());
            doc.put("department", r.getDepartment());
            doc.put("uploadedBy", r.getUploadedBy());
            doc.put("status", r.getStatus());
            doc.put("chunks", r.getChunks());
            doc.put("uploadDate", r.getUploadDate());
            doc.put("vectorId", r.getVectorId());
            return doc;
        }).collect(Collectors.toList());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("metrics", metrics);
        response.put("queryTrends", queryTrends);
        response.put("popularQueries", popularQueries);
        response.put("documentsQueue", documentsQueue);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/documents/{docId}")
    public ResponseEntity<?> deleteDocument(@PathVariable String docId) {
        if (resourceRepository.existsById(docId)) {
            resourceRepository.deleteById(docId);
            return ResponseEntity.ok(Map.of("message", "Document deleted successfully.", "id", docId));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/documents/{docId}/approve")
    public ResponseEntity<?> approveDocument(@PathVariable String docId) {
        Optional<Resource> opt = resourceRepository.findById(docId);
        if (opt.isPresent()) {
            Resource doc = opt.get();
            doc.setStatus("Indexed");
            doc.setFacultyVerified(true);
            resourceRepository.save(doc);
            return ResponseEntity.ok(Map.of("message", "Document approved and indexed.", "id", docId));
        }
        return ResponseEntity.notFound().build();
    }
}

