package com.facadely.backend.site.dto;

import jakarta.validation.constraints.NotBlank;

public record PublishSiteRequest(
    @NotBlank(message = "sitePath는 필수입니다.")
    String sitePath,
    String customDomain
) {
}
