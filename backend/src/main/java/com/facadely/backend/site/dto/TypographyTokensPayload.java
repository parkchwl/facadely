package com.facadely.backend.site.dto;

public record TypographyTokensPayload(
    TypographyPresetPayload heading,
    TypographyPresetPayload body,
    TypographyPresetPayload button
) {
}
