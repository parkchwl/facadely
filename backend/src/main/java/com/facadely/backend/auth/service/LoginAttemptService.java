package com.facadely.backend.auth.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);

    private final Map<String, AttemptState> states = new ConcurrentHashMap<>();

    public boolean isLocked(String email, String ipAddress) {
        AttemptState state = states.get(key(email, ipAddress));
        if (state == null) {
            return false;
        }
        Instant now = Instant.now();
        if (state.lockedUntil != null && state.lockedUntil.isAfter(now)) {
            return true;
        }
        if (state.firstFailure != null && state.firstFailure.plus(WINDOW).isBefore(now)) {
            states.remove(key(email, ipAddress));
            return false;
        }
        return false;
    }

    public void recordFailure(String email, String ipAddress) {
        String key = key(email, ipAddress);
        Instant now = Instant.now();
        states.compute(key, (k, prev) -> {
            AttemptState next = prev == null ? new AttemptState() : prev;
            if (next.firstFailure == null || next.firstFailure.plus(WINDOW).isBefore(now)) {
                next.firstFailure = now;
                next.failures = 1;
                next.lockedUntil = null;
                return next;
            }

            next.failures += 1;
            if (next.failures >= MAX_ATTEMPTS) {
                next.lockedUntil = now.plus(WINDOW);
            }
            return next;
        });
    }

    public void recordSuccess(String email, String ipAddress) {
        states.remove(key(email, ipAddress));
    }

    private String key(String email, String ipAddress) {
        return email.toLowerCase() + "|" + (ipAddress == null ? "unknown" : ipAddress);
    }

    private static class AttemptState {
        private int failures;
        private Instant firstFailure;
        private Instant lockedUntil;
    }
}
