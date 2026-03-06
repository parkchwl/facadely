package com.facadely.backend.auth.security;

import com.facadely.backend.auth.config.AuthProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URI;

@Component
public class AuthOriginValidationFilter extends OncePerRequestFilter {

    private final AuthProperties authProperties;

    public AuthOriginValidationFilter(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String method = request.getMethod();
        String path = request.getRequestURI();

        if (HttpMethod.GET.matches(method) || HttpMethod.HEAD.matches(method) || HttpMethod.OPTIONS.matches(method)) {
            return true;
        }

        return path == null || !path.startsWith("/api/v1/auth/");
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String allowedOrigin = trimTrailingSlash(authProperties.getFrontendOrigin());
        String origin = request.getHeader("Origin");
        String referer = request.getHeader("Referer");

        boolean allowed = false;
        if (origin != null && !origin.isBlank()) {
            allowed = trimTrailingSlash(origin).equals(allowedOrigin);
        } else if (referer != null && !referer.isBlank()) {
            allowed = refererOrigin(referer).equals(allowedOrigin);
        }

        if (!allowed) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":\"INVALID_ORIGIN\",\"message\":\"허용되지 않은 요청 출처입니다.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String trimTrailingSlash(String value) {
        return value != null && value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }

    private String refererOrigin(String referer) {
        try {
            URI uri = URI.create(referer);
            if (uri.getScheme() == null || uri.getAuthority() == null) {
                return "";
            }
            return trimTrailingSlash(uri.getScheme() + "://" + uri.getAuthority());
        } catch (Exception ignored) {
            return "";
        }
    }
}
