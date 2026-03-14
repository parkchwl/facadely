package com.facadely.backend.site.dto;

import java.time.Instant;
import java.util.List;

public record SiteCustomizationResponse(
    String sitePath,
    ThemeTokensPayload themeTokens,
    TypographyTokensPayload typographyTokens,
    boolean typographyPresetEnabled,
    List<CustomFontPayload> customFonts,
    List<ElementPatchPayload> elements,
    Instant updatedAt
) {
}
