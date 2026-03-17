package com.facadely.backend.auth.config;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class CookieFactory {

    private final AuthProperties authProperties;

    public CookieFactory(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    public ResponseCookie accessCookie(String value, long maxAgeSeconds) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(authProperties.getCookie().getAccessName(), value)
            .httpOnly(true)
            .secure(authProperties.getCookie().isSecure())
            .sameSite(authProperties.getCookie().getSameSite())
            .path("/")
            .maxAge(maxAgeSeconds);

        applyDomain(builder);
        return builder.build();
    }

    public ResponseCookie refreshCookie(String value, long maxAgeSeconds) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(authProperties.getCookie().getRefreshName(), value)
            .httpOnly(true)
            .secure(authProperties.getCookie().isSecure())
            .sameSite(authProperties.getCookie().getSameSite())
            .path("/api/v1/auth")
            .maxAge(maxAgeSeconds);

        applyDomain(builder);
        return builder.build();
    }

    public ResponseCookie clearAccessCookie() {
        return accessCookie("", 0);
    }

    public ResponseCookie clearRefreshCookie() {
        return refreshCookie("", 0);
    }

    private void applyDomain(ResponseCookie.ResponseCookieBuilder builder) {
        String domain = authProperties.getCookie().getDomain();
        if (StringUtils.hasText(domain)) {
            builder.domain(domain);
        }
    }
}
