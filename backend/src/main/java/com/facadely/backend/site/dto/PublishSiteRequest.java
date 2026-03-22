package com.facadely.backend.site.dto;

import java.util.UUID;

public record PublishSiteRequest(
    UUID siteId,
    String sitePath,
    String customDomain
) {
}
