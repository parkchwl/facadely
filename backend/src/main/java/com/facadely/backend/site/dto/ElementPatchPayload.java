package com.facadely.backend.site.dto;

import java.time.Instant;
import java.util.Map;

public record ElementPatchPayload(
    String editId,
    Map<String, String> styles,
    String innerText,
    String src,
    String href,
    Instant updatedAt
) {
}
