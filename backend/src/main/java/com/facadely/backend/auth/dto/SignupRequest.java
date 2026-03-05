package com.facadely.backend.auth.dto;

import jakarta.validation.constraints.*;

public record SignupRequest(
    @NotBlank @Email @Size(max = 255) String email,
    @NotBlank @Size(min = 8, max = 72) String password,
    @NotBlank @Size(max = 120) String name,
    @NotBlank @Size(max = 12) String locale,
    @AssertTrue(message = "약관 동의가 필요합니다.") boolean agreeTerms
) {
}
