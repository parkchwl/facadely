package com.facadely.backend.site.dto;

public record ThemeTokensPayload(
    String primary,
    String secondary,
    String radius,
    String spacingBase
) {
}
