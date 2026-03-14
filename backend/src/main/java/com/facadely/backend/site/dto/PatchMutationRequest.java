package com.facadely.backend.site.dto;

public record PatchMutationRequest(
    String editId,
    ElementPatchMutationPayload patch
) {
}
