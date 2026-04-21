package com.facadely.backend.auth.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "auth_rate_limits")
public class AuthRateLimitState {

    @Id
    @Column(name = "rate_key", nullable = false, length = 400)
    private String rateKey;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "first_attempt_at")
    private Instant firstAttemptAt;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected AuthRateLimitState() {
    }

    public AuthRateLimitState(String rateKey) {
        this.rateKey = rateKey;
        this.attempts = 0;
    }

    @PrePersist
    void prePersist() {
        if (updatedAt == null) {
            updatedAt = Instant.now();
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public String getRateKey() {
        return rateKey;
    }

    public int getAttempts() {
        return attempts;
    }

    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }

    public Instant getFirstAttemptAt() {
        return firstAttemptAt;
    }

    public void setFirstAttemptAt(Instant firstAttemptAt) {
        this.firstAttemptAt = firstAttemptAt;
    }

    public Instant getLockedUntil() {
        return lockedUntil;
    }

    public void setLockedUntil(Instant lockedUntil) {
        this.lockedUntil = lockedUntil;
    }
}
