package com.facadely.backend.site.dto;

import java.util.UUID;
import java.util.List;

public record SiteCustomizationUpdateRequest(
    UUID siteId,
    String sitePath,
    String editId,
    ElementPatchMutationPayload patch,
    ThemeTokensPayload themeTokens,
    TypographyTokensPayload typographyTokens,
    Boolean typographyPresetEnabled,
    CustomFontPayload customFont,
    List<PatchMutationRequest> patches
) {
}
