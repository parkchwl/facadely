package com.facadely.backend.site.dto;

import java.time.Instant;

public record PublishedSiteResponse(
    String sitePath,
    String name,
    String templateId,
    String templateSlug,
    String publishedSlug,
    String customDomain,
    Instant publishedAt
) {
}
