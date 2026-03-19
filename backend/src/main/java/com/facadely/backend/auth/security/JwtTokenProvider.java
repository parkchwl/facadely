package com.facadely.backend.auth.security;

import com.facadely.backend.auth.config.AuthProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    private final AuthProperties authProperties;

    public JwtTokenProvider(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    public String createAccessToken(UUID userId, String email, String role) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(authProperties.getJwt().getAccessTtlSeconds());

        return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .claim("role", role)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiresAt))
            .signWith(accessKey())
            .compact();
    }

    public Claims parseAccessToken(String token) {
        return Jwts.parser()
            .verifyWith(accessKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public boolean isAccessTokenValid(String token) {
        try {
            parseAccessToken(token);
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }

    public long getAccessTtlSeconds() {
        return authProperties.getJwt().getAccessTtlSeconds();
    }

    public long getRefreshTtlSeconds() {
        return authProperties.getJwt().getRefreshTtlSeconds();
    }

    private SecretKey accessKey() {
        return deriveKey(authProperties.getJwt().getAccessSecret());
    }

    private SecretKey deriveKey(String source) {
        byte[] bytes;
        try {
            bytes = Decoders.BASE64.decode(source);
        } catch (Exception ignored) {
            bytes = source.getBytes(StandardCharsets.UTF_8);
        }
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT access secret must resolve to at least 32 bytes.");
        }
        return Keys.hmacShaKeyFor(bytes);
    }
}
