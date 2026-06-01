package com.facadely.backend.common.security;

import com.facadely.backend.common.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class EmergencyLockFilter extends OncePerRequestFilter {

    private static final String HEALTH_PATH = "/api/v1/health";
    private static final int SERVICE_UNAVAILABLE_STATUS = HttpStatus.SERVICE_UNAVAILABLE.value();

    private final ObjectMapper objectMapper;
    private final boolean enabled;

    public EmergencyLockFilter(
        ObjectMapper objectMapper,
        @Value("${app.security.emergency-lock.enabled:true}") boolean enabled
    ) {
        this.objectMapper = objectMapper;
        this.enabled = enabled;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !enabled || HEALTH_PATH.equals(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        response.setStatus(SERVICE_UNAVAILABLE_STATUS);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        response.setHeader("Retry-After", "3600");

        ErrorResponse payload = new ErrorResponse(
            Instant.now(),
            SERVICE_UNAVAILABLE_STATUS,
            "SERVICE_LOCKED",
            "현재 보안 점검을 위해 서비스를 일시적으로 중단했습니다.",
            Map.of()
        );
        response.getWriter().write(objectMapper.writeValueAsString(payload));
    }
}
