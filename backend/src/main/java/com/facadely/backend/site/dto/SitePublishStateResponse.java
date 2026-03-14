package com.facadely.backend.site.dto;

import com.facadely.backend.site.domain.SiteLifecycleStatus;

import java.time.Instant;
import java.util.UUID;

public record SitePublishStateResponse(
    UUID siteId,
    String sitePath,
    SiteLifecycleStatus lifecycleStatus,
    boolean published,
    String publishedSlug,
    String customDomain,
    Instant publishedAt,
    Instant updatedAt
) {
}
