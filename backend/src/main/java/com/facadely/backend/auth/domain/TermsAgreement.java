package com.facadely.backend.auth.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "terms_agreements")
public class TermsAgreement {

    @Id
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "terms_version", nullable = false, length = 40)
    private String termsVersion;

    @Column(name = "privacy_version", nullable = false, length = 40)
    private String privacyVersion;

    @Column(name = "locale", nullable = false, length = 12)
    private String locale;

    @Column(name = "agreed_at", nullable = false)
    private Instant agreedAt;

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (agreedAt == null) {
            agreedAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getTermsVersion() {
        return termsVersion;
    }

    public void setTermsVersion(String termsVersion) {
        this.termsVersion = termsVersion;
    }

    public String getPrivacyVersion() {
        return privacyVersion;
    }

    public void setPrivacyVersion(String privacyVersion) {
        this.privacyVersion = privacyVersion;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    public Instant getAgreedAt() {
        return agreedAt;
    }

    public void setAgreedAt(Instant agreedAt) {
        this.agreedAt = agreedAt;
    }
}
