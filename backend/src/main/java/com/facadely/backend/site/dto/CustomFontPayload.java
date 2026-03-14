package com.facadely.backend.site.dto;

import java.time.Instant;

public record CustomFontPayload(
    String family,
    String url,
    Instant uploadedAt
) {
}
