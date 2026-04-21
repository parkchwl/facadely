package com.facadely.backend.auth.repository;

import com.facadely.backend.auth.domain.AuthRateLimitState;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AuthRateLimitRepository extends JpaRepository<AuthRateLimitState, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select state from AuthRateLimitState state where state.rateKey = :rateKey")
    Optional<AuthRateLimitState> findForUpdate(@Param("rateKey") String rateKey);
}
