package com.facadely.backend.auth.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "oauth_google_accounts")
public class OAuthGoogleAccount {

    @Id
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "google_sub", nullable = false, unique = true, length = 255)
    private String googleSub;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "linked_at", nullable = false)
    private Instant linkedAt;

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (linkedAt == null) {
            linkedAt = Instant.now();
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

    public String getGoogleSub() {
        return googleSub;
    }

    public void setGoogleSub(String googleSub) {
        this.googleSub = googleSub;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Instant getLinkedAt() {
        return linkedAt;
    }
}
