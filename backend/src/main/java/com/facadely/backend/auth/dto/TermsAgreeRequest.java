package com.facadely.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TermsAgreeRequest(
    @NotBlank @Size(max = 40) String termsVersion,
    @NotBlank @Size(max = 40) String privacyVersion,
    @NotBlank @Size(max = 12) String locale
) {
}
