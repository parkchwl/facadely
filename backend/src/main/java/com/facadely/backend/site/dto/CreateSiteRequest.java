package com.facadely.backend.site.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateSiteRequest(
    @NotBlank(message = "templateId는 필수입니다.")
    String templateId
) {
}
