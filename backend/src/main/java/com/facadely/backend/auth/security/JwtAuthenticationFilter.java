package com.facadely.backend.auth.security;

import com.facadely.backend.auth.config.AuthProperties;
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

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final AuthProperties authProperties;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, AuthProperties authProperties) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.authProperties = authProperties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            String token = resolveAccessToken(request);
            if (token != null && jwtTokenProvider.isAccessTokenValid(token)) {
                Claims claims = jwtTokenProvider.parseAccessToken(token);
                String userId = claims.getSubject();
                String role = claims.get("role", String.class);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + (role == null ? "USER" : role)))
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
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
