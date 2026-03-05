package com.facadely.backend.auth.dto;

import com.facadely.backend.auth.domain.UserRole;

import java.util.UUID;

public record MeResponse(
    UUID id,
    String email,
    String name,
    UserRole role,
    boolean termsAgreed
) {
}
