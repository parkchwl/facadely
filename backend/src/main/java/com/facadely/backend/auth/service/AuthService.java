package com.facadely.backend.auth.service;

import com.facadely.backend.auth.config.AuthProperties;
import com.facadely.backend.auth.domain.*;
import com.facadely.backend.auth.dto.LoginRequest;
import com.facadely.backend.auth.dto.MeResponse;
import com.facadely.backend.auth.dto.SignupRequest;
import com.facadely.backend.auth.dto.TermsAgreeRequest;
import com.facadely.backend.auth.repository.*;
import com.facadely.backend.auth.security.JwtTokenProvider;
import com.facadely.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final UserCredentialRepository userCredentialRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TermsAgreementRepository termsAgreementRepository;
    private final AuthAuditLogRepository authAuditLogRepository;
    private final OAuthGoogleAccountRepository oAuthGoogleAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final LoginAttemptService loginAttemptService;
    private final AuthProperties authProperties;

    public AuthService(
        UserAccountRepository userAccountRepository,
        UserCredentialRepository userCredentialRepository,
        RefreshTokenRepository refreshTokenRepository,
        TermsAgreementRepository termsAgreementRepository,
        AuthAuditLogRepository authAuditLogRepository,
        OAuthGoogleAccountRepository oAuthGoogleAccountRepository,
        PasswordEncoder passwordEncoder,
        JwtTokenProvider jwtTokenProvider,
        LoginAttemptService loginAttemptService,
        AuthProperties authProperties
    ) {
        this.userAccountRepository = userAccountRepository;
        this.userCredentialRepository = userCredentialRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.termsAgreementRepository = termsAgreementRepository;
        this.authAuditLogRepository = authAuditLogRepository;
        this.oAuthGoogleAccountRepository = oAuthGoogleAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.loginAttemptService = loginAttemptService;
        this.authProperties = authProperties;
    }

    @Transactional
    public AuthBundle signup(SignupRequest request, String userAgent, String ipAddress) {
        if (userAccountRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "EMAIL_EXISTS", "이미 가입된 이메일입니다.");
        }

        UserAccount user = new UserAccount();
        user.setEmail(request.email().trim().toLowerCase());
        user.setName(request.name().trim());
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);
        user = userAccountRepository.save(user);

        UserCredential credential = new UserCredential();
        credential.setUser(user);
        credential.setPasswordHash(passwordEncoder.encode(request.password()));
        userCredentialRepository.save(credential);

        upsertTermsAgreement(user.getId(), new TermsAgreeRequest(
            authProperties.getTermsVersion(),
            authProperties.getPrivacyVersion(),
            request.locale()
        ));

        logAudit(user.getId(), "SIGNUP_SUCCESS", ipAddress, userAgent);
        return issueTokens(user, userAgent, ipAddress);
    }

    @Transactional
    public AuthBundle login(LoginRequest request, String userAgent, String ipAddress) {
        String email = request.email().trim().toLowerCase();

        if (loginAttemptService.isLocked(email, ipAddress)) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "LOGIN_RATE_LIMITED", "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.");
        }

        UserAccount user = userAccountRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> invalidCredentials(email, ipAddress));

        UserCredential credential = userCredentialRepository.findById(user.getId())
            .orElseThrow(() -> invalidCredentials(email, ipAddress));

        if (!passwordEncoder.matches(request.password(), credential.getPasswordHash())) {
            throw invalidCredentials(email, ipAddress);
        }

        loginAttemptService.recordSuccess(email, ipAddress);
        logAudit(user.getId(), "LOGIN_SUCCESS", ipAddress, userAgent);
        return issueTokens(user, userAgent, ipAddress);
    }

    @Transactional
    public AuthBundle refresh(String refreshTokenRaw, String userAgent, String ipAddress) {
        if (refreshTokenRaw == null || refreshTokenRaw.isBlank()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "REFRESH_TOKEN_REQUIRED", "리프레시 토큰이 필요합니다.");
        }

        String tokenHash = hash(refreshTokenRaw);
        RefreshToken existing = refreshTokenRepository
            .findByTokenHashAndRevokedAtIsNullAndExpiresAtAfter(tokenHash, Instant.now())
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN", "유효하지 않은 리프레시 토큰입니다."));

        existing.setRevokedAt(Instant.now());
        refreshTokenRepository.save(existing);

        UserAccount user = userAccountRepository.findById(existing.getUserId())
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));

        logAudit(user.getId(), "REFRESH_SUCCESS", ipAddress, userAgent);
        return issueTokens(user, userAgent, ipAddress);
    }

    @Transactional
    public void logout(String refreshTokenRaw, String userAgent, String ipAddress) {
        if (refreshTokenRaw != null && !refreshTokenRaw.isBlank()) {
            String hash = hash(refreshTokenRaw);
            Optional<RefreshToken> token = refreshTokenRepository
                .findByTokenHashAndRevokedAtIsNullAndExpiresAtAfter(hash, Instant.now());
            token.ifPresent(value -> {
                value.setRevokedAt(Instant.now());
                refreshTokenRepository.save(value);
                logAudit(value.getUserId(), "LOGOUT_SUCCESS", ipAddress, userAgent);
            });
        }
    }

    @Transactional(readOnly = true)
    public MeResponse me(UUID userId) {
        UserAccount user = userAccountRepository.findById(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));

        boolean termsAgreed = termsAgreementRepository.existsByUserId(user.getId());

        return new MeResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            termsAgreed
        );
    }

    @Transactional
    public void upsertTermsAgreement(UUID userId, TermsAgreeRequest request) {
        TermsAgreement agreement = termsAgreementRepository.findByUserId(userId)
            .orElseGet(TermsAgreement::new);

        agreement.setUserId(userId);
        agreement.setTermsVersion(request.termsVersion());
        agreement.setPrivacyVersion(request.privacyVersion());
        agreement.setLocale(request.locale());
        agreement.setAgreedAt(Instant.now());
        termsAgreementRepository.save(agreement);
    }

    @Transactional
    public AuthBundle handleGoogleLogin(String googleSub, String email, String name, String userAgent, String ipAddress) {
        OAuthGoogleAccount linked = oAuthGoogleAccountRepository.findByGoogleSub(googleSub).orElse(null);

        UserAccount user;
        if (linked != null) {
            user = userAccountRepository.findById(linked.getUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));
        } else {
            user = userAccountRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
                UserAccount created = new UserAccount();
                created.setEmail(email.toLowerCase());
                created.setName(name == null || name.isBlank() ? email : name);
                created.setRole(UserRole.USER);
                created.setStatus(UserStatus.ACTIVE);
                return userAccountRepository.save(created);
            });

            OAuthGoogleAccount googleAccount = new OAuthGoogleAccount();
            googleAccount.setUserId(user.getId());
            googleAccount.setGoogleSub(googleSub);
            googleAccount.setEmail(email.toLowerCase());
            oAuthGoogleAccountRepository.save(googleAccount);
        }

        logAudit(user.getId(), "GOOGLE_LOGIN_SUCCESS", ipAddress, userAgent);
        return issueTokens(user, userAgent, ipAddress);
    }

    private ApiException invalidCredentials(String email, String ipAddress) {
        loginAttemptService.recordFailure(email, ipAddress);
        return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    private AuthBundle issueTokens(UserAccount user, String userAgent, String ipAddress) {
        String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshTokenRaw = generateSecureToken();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setTokenHash(hash(refreshTokenRaw));
        refreshToken.setExpiresAt(Instant.now().plusSeconds(jwtTokenProvider.getRefreshTtlSeconds()));
        refreshToken.setUserAgent(userAgent);
        refreshToken.setIpAddress(ipAddress);
        refreshTokenRepository.save(refreshToken);

        MeResponse meResponse = me(user.getId());
        return new AuthBundle(
            accessToken,
            refreshTokenRaw,
            jwtTokenProvider.getAccessTtlSeconds(),
            jwtTokenProvider.getRefreshTtlSeconds(),
            meResponse
        );
    }

    private void logAudit(UUID userId, String eventType, String ipAddress, String userAgent) {
        AuthAuditLog log = new AuthAuditLog();
        log.setUserId(userId);
        log.setEventType(eventType);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        authAuditLogRepository.save(log);
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[48];
        new SecureRandom().nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private String hash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (Exception e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "HASH_ERROR", "토큰 해시 처리에 실패했습니다.");
        }
    }

    public record AuthBundle(
        String accessToken,
        String refreshToken,
        long accessMaxAgeSeconds,
        long refreshMaxAgeSeconds,
        MeResponse me
    ) {
    }
}
