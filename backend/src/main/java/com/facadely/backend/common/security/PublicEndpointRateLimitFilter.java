package com.facadely.backend.common.security;

import com.facadely.backend.common.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;

@Component
public class PublicEndpointRateLimitFilter extends OncePerRequestFilter {

    private static final String RATE_LIMIT_CODE = "RATE_LIMITED";
    private static final String RATE_LIMIT_MESSAGE = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
    private static final int TOO_MANY_REQUESTS_STATUS = HttpStatus.TOO_MANY_REQUESTS.value();

    private final IpWindowRateLimiter ipWindowRateLimiter;
    private final ObjectMapper objectMapper;
    private final boolean enabled;
    private final Duration window;
    private final Duration cleanupInterval;
    private final int healthMaxRequests;
    private final int authMeMaxRequests;
    private final int sitesPublicMaxRequests;

    public PublicEndpointRateLimitFilter(
        IpWindowRateLimiter ipWindowRateLimiter,
        ObjectMapper objectMapper,
        @Value("${app.security.public-rate-limit.enabled:true}") boolean enabled,
        @Value("${app.security.public-rate-limit.window-seconds:60}") long windowSeconds,
        @Value("${app.security.public-rate-limit.cleanup-interval-seconds:300}") long cleanupIntervalSeconds,
        @Value("${app.security.public-rate-limit.health-max-requests:120}") int healthMaxRequests,
        @Value("${app.security.public-rate-limit.auth-me-max-requests:60}") int authMeMaxRequests,
        @Value("${app.security.public-rate-limit.sites-public-max-requests:240}") int sitesPublicMaxRequests
    ) {
        this.ipWindowRateLimiter = ipWindowRateLimiter;
        this.objectMapper = objectMapper;
        this.enabled = enabled;
        this.window = Duration.ofSeconds(Math.max(windowSeconds, 1));
        this.cleanupInterval = Duration.ofSeconds(Math.max(cleanupIntervalSeconds, 30));
        this.healthMaxRequests = Math.max(healthMaxRequests, 1);
        this.authMeMaxRequests = Math.max(authMeMaxRequests, 1);
        this.sitesPublicMaxRequests = Math.max(sitesPublicMaxRequests, 1);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!enabled) {
            return true;
        }

        if (HttpMethod.OPTIONS.matches(request.getMethod()) || HttpMethod.HEAD.matches(request.getMethod())) {
            return true;
        }

        return resolvePolicy(request.getRequestURI()) == null;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        RateLimitPolicy policy = resolvePolicy(request.getRequestURI());
        if (policy == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = resolveClientIp(request);
        boolean allowed = ipWindowRateLimiter.allow(
            policy.bucket(),
            clientIp,
            policy.maxRequests(),
            window,
            cleanupInterval
        );

        if (!allowed) {
            writeRateLimitResponse(response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private RateLimitPolicy resolvePolicy(String path) {
        if (path == null || path.isBlank()) {
            return null;
        }

        if ("/api/v1/health".equals(path)) {
            return new RateLimitPolicy("health", healthMaxRequests);
        }

        if ("/api/v1/auth/me".equals(path)) {
            return new RateLimitPolicy("auth-me", authMeMaxRequests);
        }

        if (path.startsWith("/api/v1/sites/public/")) {
            return new RateLimitPolicy("sites-public", sitesPublicMaxRequests);
        }

        return null;
    }

    private void writeRateLimitResponse(HttpServletResponse response) throws IOException {
        response.setStatus(TOO_MANY_REQUESTS_STATUS);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        ErrorResponse payload = new ErrorResponse(
            Instant.now(),
            TOO_MANY_REQUESTS_STATUS,
            RATE_LIMIT_CODE,
            RATE_LIMIT_MESSAGE,
            Map.of()
        );
        response.getWriter().write(objectMapper.writeValueAsString(payload));
    }

    private String resolveClientIp(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();
        if (remoteAddr == null || remoteAddr.isBlank()) {
            return "unknown";
        }

        return remoteAddr.trim();
    }

    private record RateLimitPolicy(String bucket, int maxRequests) {
    }
}
