package com.facadely.backend.site.controller;

import com.facadely.backend.common.exception.ApiException;
import com.facadely.backend.site.dto.CreateSiteRequest;
import com.facadely.backend.site.dto.PublishSiteRequest;
import com.facadely.backend.site.dto.SiteCustomizationUpdateRequest;
import com.facadely.backend.site.dto.UpdateSiteRequest;
import com.facadely.backend.site.service.SiteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sites")
public class SiteController {

    private final SiteService siteService;

    public SiteController(SiteService siteService) {
        this.siteService = siteService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
            "sites", siteService.listSites(requireUserId(authentication))
        ));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
        Authentication authentication,
        @Valid @RequestBody CreateSiteRequest request
    ) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "site", siteService.createSite(requireUserId(authentication), request.templateId())
        ));
    }

    @PatchMapping("/{siteId}")
    public ResponseEntity<Map<String, Object>> update(
        Authentication authentication,
        @PathVariable UUID siteId,
        @Valid @RequestBody UpdateSiteRequest request
    ) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "site", siteService.updateSite(requireUserId(authentication), siteId, request.name())
        ));
    }

    @DeleteMapping("/{siteId}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable UUID siteId) {
        siteService.deleteSite(requireUserId(authentication), siteId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/publish")
    public ResponseEntity<Map<String, Object>> publishState(
        Authentication authentication,
        @RequestParam String sitePath
    ) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "publish", siteService.getPublishState(requireUserId(authentication), sitePath)
        ));
    }

    @PostMapping("/publish")
    public ResponseEntity<Map<String, Object>> publish(
        Authentication authentication,
        @Valid @RequestBody PublishSiteRequest request
    ) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "publish", siteService.publishSite(requireUserId(authentication), request.sitePath(), request.customDomain())
        ));
    }

    @DeleteMapping("/publish")
    public ResponseEntity<Map<String, Object>> unpublish(
        Authentication authentication,
        @RequestParam String sitePath
    ) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "publish", siteService.unpublishSite(requireUserId(authentication), sitePath)
        ));
    }

    @GetMapping("/public/{slug}")
    public ResponseEntity<Map<String, Object>> publishedSite(@PathVariable String slug) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "publishedSite", siteService.resolvePublishedSite(slug)
        ));
    }

    @GetMapping("/customization")
    public ResponseEntity<Map<String, Object>> customization(@RequestParam String sitePath) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "customization", siteService.getCustomization(sitePath)
        ));
    }

    @PostMapping("/customization")
    public ResponseEntity<Map<String, Object>> saveCustomization(
        Authentication authentication,
        @RequestBody SiteCustomizationUpdateRequest request
    ) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "customization", siteService.saveCustomization(requireUserId(authentication), request)
        ));
    }

    private UUID requireUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "인증이 필요합니다.");
        }

        try {
            return UUID.fromString(authentication.getName());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_AUTH_SUBJECT", "잘못된 인증 주체입니다.");
        }
    }
}
