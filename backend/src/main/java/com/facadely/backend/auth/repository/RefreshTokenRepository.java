package com.facadely.backend.auth.repository;

import com.facadely.backend.auth.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByTokenHashAndRevokedAtIsNullAndExpiresAtAfter(String tokenHash, Instant now);
}
