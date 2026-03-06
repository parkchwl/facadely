package com.facadely.backend.auth.config;

import jakarta.annotation.PostConstruct;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.Locale;
import java.util.Set;

@Component
public class AuthConfigurationValidator {

    private static final Set<String> LOCAL_HOSTS = Set.of("localhost", "127.0.0.1", "::1");

    private final AuthProperties authProperties;
    private final Environment environment;

    public AuthConfigurationValidator(AuthProperties authProperties, Environment environment) {
        this.authProperties = authProperties;
        this.environment = environment;
    }

    @PostConstruct
    void validate() {
        boolean localOrigin = isLocalOrigin(authProperties.getFrontendOrigin());

        validateJwtSecret("JWT_ACCESS_SECRET", authProperties.getJwt().getAccessSecret(), localOrigin);
        validateJwtSecret("JWT_REFRESH_SECRET", authProperties.getJwt().getRefreshSecret(), localOrigin);
        validateOAuthSecret(
            "GOOGLE_CLIENT_ID",
            environment.getProperty("spring.security.oauth2.client.registration.google.client-id"),
            localOrigin
        );
        validateOAuthSecret(
            "GOOGLE_CLIENT_SECRET",
            environment.getProperty("spring.security.oauth2.client.registration.google.client-secret"),
            localOrigin
        );

        if (!localOrigin && !authProperties.getCookie().isSecure()) {
            throw new IllegalStateException("COOKIE_SECURE must be true for non-local FRONTEND_ORIGIN.");
        }

        if ("none".equalsIgnoreCase(authProperties.getCookie().getSameSite()) && !authProperties.getCookie().isSecure()) {
            throw new IllegalStateException("COOKIE_SECURE must be true when COOKIE_SAME_SITE=None.");
        }
    }

    private void validateJwtSecret(String key, String value, boolean localOrigin) {
        String normalized = value == null ? "" : value.trim();
        boolean placeholder = normalized.isEmpty() || normalized.contains("change-this");

        if (placeholder && !localOrigin) {
            throw new IllegalStateException(key + " must be configured with a non-placeholder value.");
        }

        if (!placeholder && normalized.length() < 32) {
            throw new IllegalStateException(key + " must be at least 32 characters long.");
        }
    }

    private void validateOAuthSecret(String key, String value, boolean localOrigin) {
        String normalized = value == null ? "" : value.trim();
        boolean placeholder = normalized.isEmpty() || normalized.contains("replace-me");
        if (placeholder && !localOrigin) {
            throw new IllegalStateException(key + " must be configured with a non-placeholder value.");
        }
    }

    private boolean isLocalOrigin(String origin) {
        try {
            URI parsed = URI.create(origin);
            String host = parsed.getHost();
            if (host == null) return false;
            return LOCAL_HOSTS.contains(host.toLowerCase(Locale.ROOT));
        } catch (Exception ignored) {
            return false;
        }
    }
}
