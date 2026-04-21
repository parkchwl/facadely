package com.facadely.backend.auth.repository;

import com.facadely.backend.auth.domain.UserAccount;
import com.facadely.backend.auth.domain.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserAccountRepository extends JpaRepository<UserAccount, UUID> {
    Optional<UserAccount> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByIdAndStatus(UUID id, UserStatus status);
}
