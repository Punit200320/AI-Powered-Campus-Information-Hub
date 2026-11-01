package com.campusai.controller;

import com.campusai.dto.AuthResponse;
import com.campusai.dto.LoginRequest;
import com.campusai.dto.RegisterRequest;
import com.campusai.model.User;
import com.campusai.repository.UserRepository;
import com.campusai.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials. User not found."));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials. Wrong password."));
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        Map<String, Object> userMap = buildUserMap(user);

        return ResponseEntity.ok(new AuthResponse(userMap, token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already registered."));
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole() != null ? req.getRole() : "student");
        user.setDepartment(req.getDepartment() != null ? req.getDepartment() : "Computer Science & Engineering");
        user.setSemester(req.getSemester());
        user.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getEmail(), saved.getRole());
        Map<String, Object> userMap = buildUserMap(saved);

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(userMap, token));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully."));
    }

    private Map<String, Object> buildUserMap(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", "usr_" + user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole());
        map.put("department", user.getDepartment());

        if ("student".equals(user.getRole())) {
            map.put("studentId", user.getStudentId() != null ? user.getStudentId() : "2026-CS-" + user.getId());
            map.put("semester", user.getSemester() != null ? user.getSemester() : "6th Semester");
        }
        if ("faculty".equals(user.getRole())) {
            map.put("designation", user.getDesignation() != null ? user.getDesignation() : "Assistant Professor");
        }
        if ("admin".equals(user.getRole())) {
            map.put("designation", user.getDesignation() != null ? user.getDesignation() : "System Administrator");
            map.put("accessLevel", "SuperAdmin");
        }

        map.put("avatar", user.getAvatar() != null ? user.getAvatar()
                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

        return map;
    }
}
