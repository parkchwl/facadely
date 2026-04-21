package com.facadely.backend.common.security;

import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class IpWindowRateLimiterTest {

    @Test
    void blocksWhenLimitIsExceededWithinWindow() {
        IpWindowRateLimiter limiter = new IpWindowRateLimiter();
        Duration window = Duration.ofMinutes(1);
        Duration cleanupInterval = Duration.ofMinutes(5);

        assertTrue(limiter.allow("auth-me", "127.0.0.1", 3, window, cleanupInterval));
        assertTrue(limiter.allow("auth-me", "127.0.0.1", 3, window, cleanupInterval));
        assertTrue(limiter.allow("auth-me", "127.0.0.1", 3, window, cleanupInterval));
        assertFalse(limiter.allow("auth-me", "127.0.0.1", 3, window, cleanupInterval));
    }

    @Test
    void keepsBucketsIndependent() {
        IpWindowRateLimiter limiter = new IpWindowRateLimiter();
        Duration window = Duration.ofMinutes(1);
        Duration cleanupInterval = Duration.ofMinutes(5);

        assertTrue(limiter.allow("health", "127.0.0.1", 1, window, cleanupInterval));
        assertFalse(limiter.allow("health", "127.0.0.1", 1, window, cleanupInterval));

        assertTrue(limiter.allow("sites-public", "127.0.0.1", 1, window, cleanupInterval));
    }
}
