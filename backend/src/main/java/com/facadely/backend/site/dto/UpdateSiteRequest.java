package com.facadely.backend.site.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateSiteRequest(
    @NotBlank(message = "name은 필수입니다.")
    @Size(max = 160, message = "name은 160자를 초과할 수 없습니다.")
    String name
) {
}
