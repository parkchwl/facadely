package com.facadely.backend.site.dto;

import com.facadely.backend.site.domain.SiteLifecycleStatus;

import java.time.Instant;
import java.util.UUID;

public record SiteResponse(
    UUID id,
    UUID ownerUserId,
    String ownerEmail,
    String siteSlug,
    String sitePath,
    String templateId,
    String templateSlug,
    String templatePath,
    String name,
    String description,
    SiteLifecycleStatus lifecycleStatus,
    String publishedSlug,
    String customDomain,
    Instant publishedAt,
    Instant createdAt,
    Instant updatedAt
) {
}
