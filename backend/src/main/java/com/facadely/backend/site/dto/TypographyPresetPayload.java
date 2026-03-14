package com.facadely.backend.site.dto;

public record TypographyPresetPayload(
    String fontFamily,
    String fontWeight,
    String fontSize,
    String lineHeight,
    String letterSpacing
) {
}
