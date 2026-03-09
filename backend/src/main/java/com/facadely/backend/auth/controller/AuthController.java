package com.facadely.backend.auth.controller;

import com.facadely.backend.auth.config.AuthProperties;
import com.facadely.backend.auth.config.CookieFactory;
import com.facadely.backend.auth.dto.*;
import com.facadely.backend.auth.service.AuthService;
import com.facadely.backend.common.exception.ApiException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final CookieFactory cookieFactory;
    private final AuthProperties authProperties;

    public AuthController(AuthService authService, CookieFactory cookieFactory, AuthProperties authProperties) {
        this.authService = authService;
        this.cookieFactory = cookieFactory;
        this.authProperties = authProperties;
    }

    @PostMapping("/signup")
    public ResponseEntity<MeResponse> signup(@Valid @RequestBody SignupRequest request, HttpServletRequest servletRequest) {
        AuthService.AuthBundle bundle = authService.signup(
            request,
            servletRequest.getHeader("User-Agent"),
            servletRequest.getRemoteAddr()
        );

        return withAuthCookies(bundle).body(bundle.me());
    }

    @PostMapping("/login")
    public ResponseEntity<MeResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        AuthService.AuthBundle bundle = authService.login(
            request,
            servletRequest.getHeader("User-Agent"),
            servletRequest.getRemoteAddr()
        );

        return withAuthCookies(bundle).body(bundle.me());
    }

    @PostMapping("/refresh")
    public ResponseEntity<MeResponse> refresh(HttpServletRequest servletRequest) {
        String refreshToken = extractCookie(servletRequest, authProperties.getCookie().getRefreshName());
        AuthService.AuthBundle bundle = authService.refresh(
            refreshToken,
            servletRequest.getHeader("User-Agent"),
            servletRequest.getRemoteAddr()
        );

        return withAuthCookies(bundle).body(bundle.me());
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletRequest servletRequest) {
        String refreshToken = extractCookie(servletRequest, authProperties.getCookie().getRefreshName());
        authService.logout(
            refreshToken,
            servletRequest.getHeader("User-Agent"),
            servletRequest.getRemoteAddr()
        );
        clearSession(servletRequest);

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, clearSessionCookie().toString())
            .header(HttpHeaders.SET_COOKIE, cookieFactory.clearAccessCookie().toString())
            .header(HttpHeaders.SET_COOKIE, cookieFactory.clearRefreshCookie().toString())
            .body(new MessageResponse("로그아웃 되었습니다."));
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.me(requireUserId(authentication)));
    }

    @PostMapping("/terms/agree")
    public ResponseEntity<MessageResponse> agreeTerms(
        Authentication authentication,
        @Valid @RequestBody TermsAgreeRequest request
    ) {
        authService.upsertTermsAgreement(requireUserId(authentication), request);
        return ResponseEntity.ok(new MessageResponse("약관 동의가 완료되었습니다."));
    }

    @GetMapping("/audit-summary")
    public ResponseEntity<AuditSummaryResponse> auditSummary(Authentication authentication) {
        return ResponseEntity.ok(authService.auditSummary(requireUserId(authentication)));
    }

    private ResponseEntity.BodyBuilder withAuthCookies(AuthService.AuthBundle bundle) {
        return ResponseEntity.status(HttpStatus.OK)
            .header(HttpHeaders.SET_COOKIE, cookieFactory.accessCookie(bundle.accessToken(), bundle.accessMaxAgeSeconds()).toString())
            .header(HttpHeaders.SET_COOKIE, cookieFactory.refreshCookie(bundle.refreshToken(), bundle.refreshMaxAgeSeconds()).toString());
    }

    private UUID requireUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "인증이 필요합니다.");
        }

        try {
            return UUID.fromString(authentication.getName());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_AUTH_SUBJECT", "잘못된 인증 주체입니다.");
        }
    }

    private String extractCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private void clearSession(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }

    private ResponseCookie clearSessionCookie() {
        return ResponseCookie.from("JSESSIONID", "")
            .httpOnly(true)
            .secure(authProperties.getCookie().isSecure())
            .sameSite(authProperties.getCookie().getSameSite())
            .path("/")
            .maxAge(0)
            .build();
    }
}
