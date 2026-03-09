package com.facadely.backend.auth.security;

import com.facadely.backend.auth.config.AuthProperties;
import com.facadely.backend.auth.config.CookieFactory;
import com.facadely.backend.auth.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private static final int MAX_NEXT_PATH_LENGTH = 1024;

    private final AuthService authService;
    private final CookieFactory cookieFactory;
    private final AuthProperties authProperties;

    public OAuth2LoginSuccessHandler(AuthService authService, CookieFactory cookieFactory, AuthProperties authProperties) {
        this.authService = authService;
        this.cookieFactory = cookieFactory;
        this.authProperties = authProperties;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
        throws IOException, ServletException {

        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String sub = principal.getAttribute("sub");
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");

        if (sub == null || email == null) {
            clearOAuthSession(request, response);
            response.addHeader("Set-Cookie", "facadely_lang=; Path=/; Max-Age=0; SameSite=Lax");
            response.addHeader("Set-Cookie", "facadely_next=; Path=/; Max-Age=0; SameSite=Lax");
            response.sendRedirect(buildFrontendUrl(resolveLocale(request), "error", "google_profile_invalid", resolveNextPath(request)));
            return;
        }

        AuthService.AuthBundle bundle = authService.handleGoogleLogin(
            sub,
            email,
            name,
            request.getHeader("User-Agent"),
            request.getRemoteAddr()
        );

        response.addHeader("Set-Cookie", cookieFactory.accessCookie(bundle.accessToken(), bundle.accessMaxAgeSeconds()).toString());
        response.addHeader("Set-Cookie", cookieFactory.refreshCookie(bundle.refreshToken(), bundle.refreshMaxAgeSeconds()).toString());
        response.addHeader("Set-Cookie", "facadely_lang=; Path=/; Max-Age=0; SameSite=Lax");
        response.addHeader("Set-Cookie", "facadely_next=; Path=/; Max-Age=0; SameSite=Lax");
        clearOAuthSession(request, response);

        response.sendRedirect(buildFrontendUrl(resolveLocale(request), "success", null, resolveNextPath(request)));
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

    private String buildFrontendUrl(String locale, String result, String errorCode, String nextPath) {
        UriComponentsBuilder builder = UriComponentsBuilder
            .fromUriString(authProperties.getFrontendOrigin())
            .pathSegment(locale, "login")
            .queryParam("oauth", result);

        if (errorCode != null) {
            builder.queryParam("error", errorCode);
        }
        if (nextPath != null) {
            builder.queryParam("next", nextPath);
        }

        return builder.build(true).toUriString();
    }
}
