package com.facadely.backend.common.security;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class IpWindowRateLimiter {

    private final ConcurrentHashMap<String, CounterState> counters = new ConcurrentHashMap<>();
    private final AtomicLong lastCleanupEpochMillis = new AtomicLong(0L);

    public boolean allow(String bucket, String clientKey, int limit, Duration window, Duration cleanupInterval) {
        Instant now = Instant.now();
        long nowEpochMillis = now.toEpochMilli();
        long windowMillis = window.toMillis();
        long windowStart = (nowEpochMillis / windowMillis) * windowMillis;
        String stateKey = bucket + "|" + clientKey;

        CounterState state = counters.compute(stateKey, (ignored, existing) -> {
            if (existing == null || existing.windowStartEpochMillis != windowStart) {
                return new CounterState(windowStart, nowEpochMillis, 1);
            }

            existing.lastSeenEpochMillis = nowEpochMillis;
            existing.count += 1;
            return existing;
        });

        maybeCleanup(nowEpochMillis, windowMillis, cleanupInterval.toMillis());
        return state.count <= limit;
    }

    private void maybeCleanup(long nowEpochMillis, long windowMillis, long cleanupIntervalMillis) {
        long previousCleanup = lastCleanupEpochMillis.get();
        if ((nowEpochMillis - previousCleanup) < cleanupIntervalMillis) {
            return;
        }

        if (!lastCleanupEpochMillis.compareAndSet(previousCleanup, nowEpochMillis)) {
            return;
        }

        long staleThreshold = nowEpochMillis - (windowMillis * 2);
        counters.entrySet().removeIf((Map.Entry<String, CounterState> entry) ->
            entry.getValue().lastSeenEpochMillis < staleThreshold
        );
    }

    private static final class CounterState {
        private final long windowStartEpochMillis;
        private long lastSeenEpochMillis;
        private int count;

        private CounterState(long windowStartEpochMillis, long lastSeenEpochMillis, int count) {
            this.windowStartEpochMillis = windowStartEpochMillis;
            this.lastSeenEpochMillis = lastSeenEpochMillis;
            this.count = count;
        }
    }
}
