package com.campusai.config;

import com.campusai.model.User;
import com.campusai.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Maps an external identity provider (Google) user to the local User entity.
 * Creates a new student account on first sign-in, or returns the existing user.
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        Map<String, Object> attrs = oauth2User.getAttributes();

        String email = (String) attrs.get("email");
        String name = (String) attrs.getOrDefault("name", email);
        String picture = (String) attrs.getOrDefault("picture", "");

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Email not provided by the identity provider.");
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User created = new User(name, email, UUID.randomUUID().toString(),
                    "student", "Computer Science & Engineering");
            return userRepository.save(created);
        });

        // Keep profile data refreshed from the provider.
        if (user.getName() == null || user.getName().isBlank()) {
            user.setName(name);
        }
        if ((user.getAvatar() == null || user.getAvatar().isBlank()) && !picture.isBlank()) {
            user.setAvatar(picture);
        }
        userRepository.save(user);

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase())
        );

        return new DefaultOAuth2User(authorities, attrs, "email");
    }
}
