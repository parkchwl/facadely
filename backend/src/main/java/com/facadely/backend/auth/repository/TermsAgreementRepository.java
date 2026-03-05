package com.facadely.backend.auth.repository;

import com.facadely.backend.auth.domain.TermsAgreement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TermsAgreementRepository extends JpaRepository<TermsAgreement, UUID> {
    Optional<TermsAgreement> findByUserId(UUID userId);
    boolean existsByUserId(UUID userId);
}
