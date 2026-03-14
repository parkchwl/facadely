package com.facadely.backend.site.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sites")
public class SiteRecord {

    @Id
    private UUID id;

    @Column(name = "owner_user_id", nullable = false)
    private UUID ownerUserId;

    @Column(name = "site_slug", nullable = false, unique = true, length = 160)
    private String siteSlug;

    @Column(name = "site_path", nullable = false, unique = true, length = 180)
    private String sitePath;

    @Column(name = "template_id", nullable = false, length = 120)
    private String templateId;

    @Column(name = "template_slug", nullable = false, length = 160)
    private String templateSlug;

    @Column(name = "template_path", nullable = false, length = 180)
    private String templatePath;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name = "customization_json", nullable = false, columnDefinition = "TEXT")
    private String customizationJson;

    @Enumerated(EnumType.STRING)
    @Column(name = "lifecycle_status", nullable = false, length = 32)
    private SiteLifecycleStatus lifecycleStatus;

    @Column(name = "published_slug", unique = true, length = 180)
    private String publishedSlug;

    @Column(name = "custom_domain", length = 255)
    private String customDomain;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (lifecycleStatus == null) {
            lifecycleStatus = SiteLifecycleStatus.DRAFT;
        }
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(UUID ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public String getSiteSlug() {
        return siteSlug;
    }

    public void setSiteSlug(String siteSlug) {
        this.siteSlug = siteSlug;
    }

    public String getSitePath() {
        return sitePath;
    }

    public void setSitePath(String sitePath) {
        this.sitePath = sitePath;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public String getTemplateSlug() {
        return templateSlug;
    }

    public void setTemplateSlug(String templateSlug) {
        this.templateSlug = templateSlug;
    }

    public String getTemplatePath() {
        return templatePath;
    }

    public void setTemplatePath(String templatePath) {
        this.templatePath = templatePath;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCustomizationJson() {
        return customizationJson;
    }

    public void setCustomizationJson(String customizationJson) {
        this.customizationJson = customizationJson;
    }

    public SiteLifecycleStatus getLifecycleStatus() {
        return lifecycleStatus;
    }

    public void setLifecycleStatus(SiteLifecycleStatus lifecycleStatus) {
        this.lifecycleStatus = lifecycleStatus;
    }

    public String getPublishedSlug() {
        return publishedSlug;
    }

    public void setPublishedSlug(String publishedSlug) {
        this.publishedSlug = publishedSlug;
    }

    public String getCustomDomain() {
        return customDomain;
    }

    public void setCustomDomain(String customDomain) {
        this.customDomain = customDomain;
    }

    public Instant getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(Instant publishedAt) {
        this.publishedAt = publishedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
