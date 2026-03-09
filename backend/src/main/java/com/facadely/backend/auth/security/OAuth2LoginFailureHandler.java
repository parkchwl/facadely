package com.facadely.backend.auth.security;

import com.facadely.backend.auth.config.AuthProperties;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {

    private static final int MAX_NEXT_PATH_LENGTH = 1024;

    private final AuthProperties authProperties;

    public OAuth2LoginFailureHandler(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
        throws IOException, ServletException {

        String locale = resolveLocale(request);
        String nextPath = resolveNextPath(request);
        clearOAuthSession(request, response);
        response.addHeader("Set-Cookie", "facadely_lang=; Path=/; Max-Age=0; SameSite=Lax");
        response.addHeader("Set-Cookie", "facadely_next=; Path=/; Max-Age=0; SameSite=Lax");

        UriComponentsBuilder redirectBuilder = UriComponentsBuilder
            .fromUriString(authProperties.getFrontendOrigin())
            .pathSegment(locale, "login")
            .queryParam("oauth", "error")
            .queryParam("error", "google_login_failed");

        if (nextPath != null) {
            redirectBuilder.queryParam("next", nextPath);
        }

        String redirectUrl = redirectBuilder.build(true).toUriString();

        response.sendRedirect(redirectUrl);
    }

    private String resolveLocale(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("facadely_lang".equals(cookie.getName())) {
                    String value = cookie.getValue();
                    if (value != null && value.matches("^[a-zA-Z-]{2,10}$")) {
                        return value;
                    }
                }
            }
        }
        return authProperties.getDefaultLocale();
    }

    private String resolveNextPath(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if ("facadely_next".equals(cookie.getName())) {
                String value = cookie.getValue();
                if (value == null || value.isBlank()) {
                    return null;
                }

                final String decoded;
                try {
                    decoded = URLDecoder.decode(value, StandardCharsets.UTF_8);
                } catch (IllegalArgumentException ex) {
                    return null;
                }

                String normalized = decoded.trim();
                if (normalized.isEmpty() || normalized.length() > MAX_NEXT_PATH_LENGTH) {
                    return null;
                }

                if (normalized.startsWith("/") && !normalized.startsWith("//")
                    && !normalized.contains("\r") && !normalized.contains("\n")
                    && !normalized.contains("\0")
                    && !normalized.startsWith("/api/")
                    && !normalized.startsWith("/_next/")
                    && !isLoginPath(normalized)) {
                    return normalized;
                }
                return null;
            }
        }

        return null;
    }

    private boolean isLoginPath(String path) {
        return path.matches("^/(?:[a-zA-Z-]{2,10}/)?login/?(?:\\?.*)?$");
    }

    private void clearOAuthSession(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();

        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        ResponseCookie sessionCookie = ResponseCookie.from("JSESSIONID", "")
            .httpOnly(true)
            .maxAge(0)
            .path("/")
            .sameSite("Lax")
            .build();
        response.addHeader("Set-Cookie", sessionCookie.toString());
    }
}
