package com.campusai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class GoogleOAuth2Service {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

    @Value("${app.oauth2.google.client-id:}")
    private String configuredClientId;

    /**
     * Verifies Google ID Token via Google's tokeninfo endpoint.
     * Returns a map containing email, name, picture, etc. or null if invalid.
     */
    public Map<String, Object> verifyIdToken(String idToken) {
        if (idToken == null || idToken.isBlank()) {
            return null;
        }

        // Support demo token for offline testing & rapid development
        if (idToken.startsWith("demo_") || idToken.equals("mock_google_token")) {
            return Map.of(
                "email", "google.scholar@campus.edu",
                "name", "Google Student",
                "picture", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                "email_verified", "true"
            );
        }

        try {
            String url = GOOGLE_TOKENINFO_URL + idToken;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> body = (Map<String, Object>) response.getBody();

                // Optional aud verification if client-id configured
                if (configuredClientId != null && !configuredClientId.isBlank()) {
                    String aud = (String) body.get("aud");
                    if (!configuredClientId.equals(aud)) {
                        System.err.println("[WARN] OAuth2 Google Token 'aud' mismatch");
                        return null;
                    }
                }
                return body;
            }
        } catch (Exception e) {
            System.err.println("[WARN] Google OAuth2 verification error: " + e.getMessage());
        }
        return null;
    }
}

