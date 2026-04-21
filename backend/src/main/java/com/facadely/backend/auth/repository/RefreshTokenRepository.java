package com.facadely.backend.auth.repository;

import com.facadely.backend.auth.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByTokenHashAndRevokedAtIsNullAndExpiresAtAfter(String tokenHash, Instant now);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        update RefreshToken token
           set token.revokedAt = :revokedAt
         where token.tokenHash = :tokenHash
           and token.revokedAt is null
           and token.expiresAt > :now
        """)
    int revokeByTokenHashIfActive(
        @Param("tokenHash") String tokenHash,
        @Param("now") Instant now,
        @Param("revokedAt") Instant revokedAt
    );

    @Query("select token.userId from RefreshToken token where token.tokenHash = :tokenHash")
    Optional<UUID> findUserIdByTokenHash(@Param("tokenHash") String tokenHash);
}
