package com.campusai.controller;

import com.campusai.dto.AuthResponse;
import com.campusai.dto.LoginRequest;
import com.campusai.dto.OAuth2LoginRequest;
import com.campusai.dto.RegisterRequest;
import com.campusai.model.User;
import com.campusai.repository.UserRepository;
import com.campusai.service.GoogleOAuth2Service;
import com.campusai.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GoogleOAuth2Service googleOAuth2Service;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          GoogleOAuth2Service googleOAuth2Service) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleOAuth2Service = googleOAuth2Service;
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

    /**
     * POST /api/auth/oauth2/google
     * OAuth 2.0 Single Sign-On via Google
     */
    @PostMapping("/oauth2/google")
    public ResponseEntity<?> loginWithGoogleOAuth2(@RequestBody OAuth2LoginRequest req) {
        if ((req.getIdToken() == null || req.getIdToken().isBlank()) &&
            (req.getEmail() == null || req.getEmail().isBlank())) {
            return ResponseEntity.badRequest().body(Map.of("error", "idToken or email is required for OAuth2 authentication."));
        }

        String email;
        String name;
        String avatar;

        Map<String, Object> tokenInfo = googleOAuth2Service.verifyIdToken(req.getIdToken());
        if (tokenInfo != null && tokenInfo.containsKey("email")) {
            email = (String) tokenInfo.get("email");
            name = (String) tokenInfo.getOrDefault("name", email.split("@")[0]);
            avatar = (String) tokenInfo.getOrDefault("picture", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");
        } else if (req.getEmail() != null && !req.getEmail().isBlank()) {
            email = req.getEmail();
            name = req.getName() != null ? req.getName() : email.split("@")[0];
            avatar = req.getAvatar() != null ? req.getAvatar() : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Google OAuth2 verification failed. Invalid or expired token."));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            if (avatar != null && !avatar.isBlank()) {
                user.setAvatar(avatar);
                userRepository.save(user);
            }
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setRole(req.getRole() != null ? req.getRole() : "student");
            user.setDepartment(req.getDepartment() != null ? req.getDepartment() : "Computer Science & Engineering");
            user.setAvatar(avatar);
            user.setAuthProvider("GOOGLE");
            user = userRepository.save(user);
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        Map<String, Object> userMap = buildUserMap(user);

        return ResponseEntity.ok(new AuthResponse(userMap, token));
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
        if ("admin".equals(user.getRole())) {
            map.put("designation", user.getDesignation() != null ? user.getDesignation() : "System Administrator");
            map.put("accessLevel", "SuperAdmin");
        }

        map.put("avatar", user.getAvatar() != null ? user.getAvatar()
                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

        return map;
    }
}

