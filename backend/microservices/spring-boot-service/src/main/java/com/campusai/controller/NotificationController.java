package com.campusai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final List<Map<String, Object>> subscriptions = new CopyOnWriteArrayList<>();
    private final List<Map<String, Object>> broadcastHistory = new CopyOnWriteArrayList<>();

    public NotificationController() {
        // Seed initial notifications for realistic demo
        Map<String, Object> demoBroadcast = new LinkedHashMap<>();
        demoBroadcast.put("id", "bc_initial_01");
        demoBroadcast.put("title", "MMVY Scholarship 2026 Verification Window Open");
        demoBroadcast.put("message", "All eligible engineering students are advised to submit hardcopies of income certificates to the scholarship desk before Nov 20, 2026.");
        demoBroadcast.put("targetAudience", "All Registered Students");
        demoBroadcast.put("channels", List.of("EMAIL", "SMS"));
        demoBroadcast.put("emailDelivered", 1840);
        demoBroadcast.put("smsDelivered", 1840);
        demoBroadcast.put("timestamp", "Nov 3, 2026, 11:30 AM");
        broadcastHistory.add(demoBroadcast);
    }

    /**
     * POST /api/notifications/subscribe
     * Subscribes a student's email and mobile number for real-time scholarship / counselling alerts
     */
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody Map<String, Object> req) {
        String email = (String) req.getOrDefault("email", "");
        String phone = (String) req.getOrDefault("phone", "");
        String targetTitle = (String) req.getOrDefault("targetTitle", "Campus Notification Service");
        String targetType = (String) req.getOrDefault("targetType", "scholarship"); // scholarship, counselling, general
        List<?> channels = (List<?>) req.getOrDefault("channels", List.of("EMAIL", "SMS", "WHATSAPP"));

        if (email.isBlank() && phone.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Either an email address or mobile phone number is required."));
        }

        String subId = "sub_" + UUID.randomUUID().toString().substring(0, 8);
        String formattedDate = new SimpleDateFormat("MMM d, yyyy, h:mm a").format(new Date());

        Map<String, Object> sub = new LinkedHashMap<>();
        sub.put("id", subId);
        sub.put("email", email);
        sub.put("phone", phone);
        sub.put("targetTitle", targetTitle);
        sub.put("targetType", targetType);
        sub.put("channels", channels);
        sub.put("status", "ACTIVE");
        sub.put("subscribedAt", formattedDate);

        subscriptions.add(sub);

        // Simulation logs for SMS and Email gateways
        System.out.println("==================================================");
        System.out.println("CAMPUS NOTIFICATION SUBSCRIBED:");
        System.out.println("Topic: " + targetTitle);
        if (!email.isBlank()) {
            System.out.println("Email Dispatch: [QUEUED -> DELIVERED] to " + email);
        }
        if (!phone.isBlank()) {
            System.out.println("Mobile SMS / WhatsApp: [DISPATCHED via Gateway] to " + phone);
        }
        System.out.println("==================================================");

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("subscriptionId", subId);
        response.put("message", "Subscribed successfully! Confirmation alert sent to " +
                (!email.isBlank() ? email : "") +
                (!email.isBlank() && !phone.isBlank() ? " and " : "") +
                (!phone.isBlank() ? phone : "") + ".");
        
        Map<String, String> delivery = new LinkedHashMap<>();
        delivery.put("emailStatus", !email.isBlank() ? "DELIVERED to " + email : "NOT_REQUESTED");
        delivery.put("smsStatus", !phone.isBlank() ? "DELIVERED via SMS to " + phone : "NOT_REQUESTED");
        delivery.put("whatsappStatus", !phone.isBlank() ? "SENT via WhatsApp" : "NOT_REQUESTED");
        response.put("delivery", delivery);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/notifications/broadcast
     * Administrator blasts urgent circular via Email & Mobile SMS
     */
    @PostMapping("/broadcast")
    public ResponseEntity<Map<String, Object>> broadcast(@RequestBody Map<String, Object> req) {
        String title = (String) req.getOrDefault("title", "Campus Academic Circular");
        String message = (String) req.getOrDefault("message", "Important circular published.");
        String targetAudience = (String) req.getOrDefault("targetAudience", "All Enrolled Students");
        List<?> channels = (List<?>) req.getOrDefault("channels", List.of("EMAIL", "SMS"));

        String bcId = "bc_" + System.currentTimeMillis();
        String formattedDate = new SimpleDateFormat("MMM d, yyyy, h:mm a").format(new Date());
        int recipientsCount = 1420 + subscriptions.size();

        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("id", bcId);
        entry.put("title", title);
        entry.put("message", message);
        entry.put("targetAudience", targetAudience);
        entry.put("channels", channels);
        entry.put("emailDelivered", recipientsCount);
        entry.put("smsDelivered", recipientsCount);
        entry.put("timestamp", formattedDate);

        broadcastHistory.add(0, entry);

        System.out.println("==================================================");
        System.out.println("ADMIN BROADCAST ALERT DISPATCHED:");
        System.out.println("Title: " + title);
        System.out.println("Recipients: " + recipientsCount + " students & applicants");
        System.out.println("Channels: " + channels);
        System.out.println("==================================================");

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("broadcastId", bcId);
        response.put("message", "Broadcast circular dispatched to " + recipientsCount + " students via Email and SMS.");
        response.put("recipientsCount", recipientsCount);
        response.put("emailDelivered", recipientsCount);
        response.put("smsDelivered", recipientsCount);
        response.put("timestamp", formattedDate);

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/notifications/stats
     * Telemetry stats for Admin Dashboard & Telemetry
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalSubscribers", 1240 + subscriptions.size());
        stats.put("totalEmailsSent", 8450 + (broadcastHistory.size() * 1420));
        stats.put("totalSmsSent", 7920 + (broadcastHistory.size() * 1420));
        stats.put("recentBroadcasts", broadcastHistory);
        stats.put("recentSubscriptions", subscriptions);
        return ResponseEntity.ok(stats);
    }
}

