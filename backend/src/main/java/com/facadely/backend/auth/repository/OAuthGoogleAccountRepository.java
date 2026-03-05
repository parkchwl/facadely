package com.facadely.backend.auth.repository;

import com.facadely.backend.auth.domain.OAuthGoogleAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OAuthGoogleAccountRepository extends JpaRepository<OAuthGoogleAccount, UUID> {
    Optional<OAuthGoogleAccount> findByGoogleSub(String googleSub);
    Optional<OAuthGoogleAccount> findByUserId(UUID userId);
}
