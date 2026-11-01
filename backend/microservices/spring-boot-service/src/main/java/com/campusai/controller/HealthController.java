package com.campusai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of(
            "message", "Campus AI Spring Boot Backend is running.",
            "version", "1.0.0",
            "port", "5000"
        );
    }
}
