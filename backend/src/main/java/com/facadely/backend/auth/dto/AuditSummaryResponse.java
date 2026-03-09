package com.facadely.backend.auth.dto;

import java.time.Instant;

public record AuditSummaryResponse(
    long totalEvents,
    long signupCount,
    long passwordLoginCount,
    long googleLoginCount,
    long refreshCount,
    long logoutCount,
    Instant lastSignupAt,
    Instant lastPasswordLoginAt,
    Instant lastGoogleLoginAt,
    Instant lastRefreshAt,
    Instant lastLogoutAt
) {
}
