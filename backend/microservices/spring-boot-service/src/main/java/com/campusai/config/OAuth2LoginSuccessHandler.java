package com.campusai.config;

import com.campusai.model.User;
import com.campusai.repository.UserRepository;
import com.campusai.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * After a successful OAuth2 sign-in, issues the application's own JWT and
 * redirects the browser to the frontend callback with ?token=...&user=...
 */
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String frontendUrl;
    private final String callbackPath;

    public OAuth2LoginSuccessHandler(UserRepository userRepository,
                                     JwtService jwtService,
                                     @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl,
                                     @Value("${app.frontend-callback-path:/auth/callback}") String callbackPath) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.frontendUrl = frontendUrl;
        this.callbackPath = callbackPath;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        if (!(authentication instanceof OAuth2AuthenticationToken)) {
            response.sendRedirect(frontendUrl + "/login");
            return;
        }

        OAuth2AuthenticationToken oauth2Token = (OAuth2AuthenticationToken) authentication;
        String email = oauth2Token.getPrincipal().getAttribute("email");
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            response.sendRedirect(frontendUrl + "/login?error=oauth_user_not_found");
            return;
        }

        String jwt = jwtService.generateToken(user.getEmail(), user.getRole());

        String userJson = objectMapper.writeValueAsString(buildUserMap(user));
        String encodedUser = URLEncoder.encode(userJson, StandardCharsets.UTF_8);

        String redirect = frontendUrl + callbackPath + "?token=" + jwt + "&user=" + encodedUser;
        response.sendRedirect(redirect);
    }

    private Map<String, Object> buildUserMap(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", "usr_" + user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole());
        map.put("department", user.getDepartment());
        if ("student".equals(user.getRole())) {
            map.put("studentId", user.getStudentId());
            map.put("semester", user.getSemester());
        }
        if ("faculty".equals(user.getRole())) {
            map.put("designation", user.getDesignation());
        }
        if ("admin".equals(user.getRole())) {
            map.put("designation", user.getDesignation());
            map.put("accessLevel", "SuperAdmin");
        }
        map.put("avatar", user.getAvatar() != null && !user.getAvatar().isBlank()
                ? user.getAvatar()
                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");
        return map;
    }
}
