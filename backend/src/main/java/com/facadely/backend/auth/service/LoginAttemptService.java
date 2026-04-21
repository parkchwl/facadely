package com.facadely.backend.auth.service;

import com.facadely.backend.auth.domain.AuthRateLimitState;
import com.facadely.backend.auth.repository.AuthRateLimitRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;

@Service
public class LoginAttemptService {

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int MAX_SIGNUP_ATTEMPTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);

    private static final int CREATE_RETRY_COUNT = 3;

    private final AuthRateLimitRepository authRateLimitRepository;

    public LoginAttemptService(AuthRateLimitRepository authRateLimitRepository) {
        this.authRateLimitRepository = authRateLimitRepository;
    }

    @Transactional
    public boolean isLocked(String email, String ipAddress) {
        return isLocked(key(email, ipAddress));
    }

    @Transactional
    public void recordFailure(String email, String ipAddress) {
        recordAttempt(key(email, ipAddress), MAX_LOGIN_ATTEMPTS);
    }

    @Transactional
    public void recordSuccess(String email, String ipAddress) {
        authRateLimitRepository.deleteById(key(email, ipAddress));
    }

    @Transactional
    public boolean isSignupLocked(String ipAddress) {
        return isLocked(signupKey(ipAddress));
    }

    @Transactional
    public void recordSignupAttempt(String ipAddress) {
        recordAttempt(signupKey(ipAddress), MAX_SIGNUP_ATTEMPTS);
    }

    @Transactional
    public void clearAll() {
        authRateLimitRepository.deleteAllInBatch();
    }

    private boolean isLocked(String rateKey) {
        AuthRateLimitState state = authRateLimitRepository.findForUpdate(rateKey).orElse(null);
        if (state == null) {
            return false;
        }

        Instant now = Instant.now();
        if (state.getLockedUntil() != null && state.getLockedUntil().isAfter(now)) {
            return true;
        }

        if (state.getFirstAttemptAt() != null && state.getFirstAttemptAt().plus(WINDOW).isBefore(now)) {
            authRateLimitRepository.delete(state);
            return false;
        }

        return false;
    }

    private void recordAttempt(String rateKey, int maxAttempts) {
        Instant now = Instant.now();
        AuthRateLimitState state = loadOrCreateLocked(rateKey);
        Instant firstAttemptAt = state.getFirstAttemptAt();

        if (firstAttemptAt == null || firstAttemptAt.plus(WINDOW).isBefore(now)) {
            state.setFirstAttemptAt(now);
            state.setAttempts(1);
            state.setLockedUntil(null);
            authRateLimitRepository.save(state);
            return;
        }

        int attempts = state.getAttempts() + 1;
        state.setAttempts(attempts);
        if (attempts >= maxAttempts) {
            state.setLockedUntil(now.plus(WINDOW));
        }
        authRateLimitRepository.save(state);
    }

    private AuthRateLimitState loadOrCreateLocked(String rateKey) {
        for (int attempt = 0; attempt < CREATE_RETRY_COUNT; attempt += 1) {
            AuthRateLimitState existing = authRateLimitRepository.findForUpdate(rateKey).orElse(null);
            if (existing != null) {
                return existing;
            }

            try {
                return authRateLimitRepository.saveAndFlush(new AuthRateLimitState(rateKey));
            } catch (DataIntegrityViolationException ignored) {
                // Another request inserted concurrently; retry and acquire lock.
            }
        }

        throw new IllegalStateException("Unable to create rate-limit state.");
    }

    private String key(String email, String ipAddress) {
        return email.toLowerCase() + "|" + (ipAddress == null ? "unknown" : ipAddress);
    }

    private String signupKey(String ipAddress) {
        return "signup|" + (ipAddress == null ? "unknown" : ipAddress);
    }
}
