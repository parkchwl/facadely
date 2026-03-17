package com.facadely.backend.auth.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int MAX_SIGNUP_ATTEMPTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);

    private final Map<String, AttemptState> loginStates = new ConcurrentHashMap<>();
    private final Map<String, AttemptState> signupStates = new ConcurrentHashMap<>();

    public boolean isLocked(String email, String ipAddress) {
        return isLocked(loginStates, key(email, ipAddress));
    }

    public void recordFailure(String email, String ipAddress) {
        recordAttempt(loginStates, key(email, ipAddress), MAX_LOGIN_ATTEMPTS);
    }

    public void recordSuccess(String email, String ipAddress) {
        loginStates.remove(key(email, ipAddress));
    }

    public boolean isSignupLocked(String ipAddress) {
        return isLocked(signupStates, signupKey(ipAddress));
    }

    public void recordSignupAttempt(String ipAddress) {
        recordAttempt(signupStates, signupKey(ipAddress), MAX_SIGNUP_ATTEMPTS);
    }

    public void clearAll() {
        loginStates.clear();
        signupStates.clear();
    }

    private boolean isLocked(Map<String, AttemptState> states, String key) {
        AttemptState state = states.get(key);
        if (state == null) {
            return false;
        }
        Instant now = Instant.now();
        if (state.lockedUntil != null && state.lockedUntil.isAfter(now)) {
            return true;
        }
        if (state.firstAttempt != null && state.firstAttempt.plus(WINDOW).isBefore(now)) {
            states.remove(key);
            return false;
        }
        return false;
    }

    private void recordAttempt(Map<String, AttemptState> states, String key, int maxAttempts) {
        Instant now = Instant.now();
        states.compute(key, (ignored, prev) -> {
            AttemptState next = prev == null ? new AttemptState() : prev;
            if (next.firstAttempt == null || next.firstAttempt.plus(WINDOW).isBefore(now)) {
                next.firstAttempt = now;
                next.attempts = 1;
                next.lockedUntil = null;
                return next;
            }

            next.attempts += 1;
            if (next.attempts >= maxAttempts) {
                next.lockedUntil = now.plus(WINDOW);
            }
            return next;
        });
    }

    private String key(String email, String ipAddress) {
        return email.toLowerCase() + "|" + (ipAddress == null ? "unknown" : ipAddress);
    }

    private String signupKey(String ipAddress) {
        return "signup|" + (ipAddress == null ? "unknown" : ipAddress);
    }

    private static class AttemptState {
        private int attempts;
        private Instant firstAttempt;
        private Instant lockedUntil;
    }
}
