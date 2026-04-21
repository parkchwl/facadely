package com.facadely.backend.auth.security;

import com.facadely.backend.auth.config.AuthProperties;
import com.facadely.backend.auth.domain.UserStatus;
import com.facadely.backend.auth.repository.UserAccountRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final AuthProperties authProperties;
    private final UserAccountRepository userAccountRepository;

    public JwtAuthenticationFilter(
        JwtTokenProvider jwtTokenProvider,
        AuthProperties authProperties,
        UserAccountRepository userAccountRepository
    ) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.authProperties = authProperties;
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String token = resolveAccessToken(request);
        if (token != null && jwtTokenProvider.isAccessTokenValid(token)) {
            Claims claims = jwtTokenProvider.parseAccessToken(token);
            String subject = claims.getSubject();
            UUID userId;
            try {
                userId = UUID.fromString(subject);
            } catch (Exception ignored) {
                filterChain.doFilter(request, response);
                return;
            }

            if (!userAccountRepository.existsByIdAndStatus(userId, UserStatus.ACTIVE)) {
                SecurityContextHolder.clearContext();
                filterChain.doFilter(request, response);
                return;
            }

            String role = claims.get("role", String.class);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userId.toString(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + (role == null ? "USER" : role)))
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveAccessToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        String accessCookieName = authProperties.getCookie().getAccessName();
        for (Cookie cookie : cookies) {
            if (accessCookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
