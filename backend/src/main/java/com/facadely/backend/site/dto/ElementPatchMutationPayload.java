package com.facadely.backend.site.dto;

import java.util.Map;

public record ElementPatchMutationPayload(
    Map<String, String> styles,
    String innerText,
    String src,
    String href
) {
}
