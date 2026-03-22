package com.facadely.backend.site.service;

import com.facadely.backend.auth.domain.UserAccount;
import com.facadely.backend.auth.repository.UserAccountRepository;
import com.facadely.backend.common.exception.ApiException;
import com.facadely.backend.site.domain.SiteLifecycleStatus;
import com.facadely.backend.site.domain.SiteRecord;
import com.facadely.backend.site.dto.*;
import com.facadely.backend.site.repository.SiteRecordRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class SiteService {

    private static final Pattern DOMAIN_REGEX = Pattern.compile(
        "^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,}$",
        Pattern.CASE_INSENSITIVE
    );

    private static final ThemeTokensPayload DEFAULT_THEME_TOKENS = new ThemeTokensPayload(
        "#6366f1",
        "#d946ef",
        "0.5rem",
        "1rem"
    );

    private static final TypographyTokensPayload DEFAULT_TYPOGRAPHY_TOKENS = new TypographyTokensPayload(
        new TypographyPresetPayload("\"Playfair Display\", serif", "700", "48px", "1.08", "-0.01em"),
        new TypographyPresetPayload("\"Inter\", sans-serif", "400", "16px", "1.65", "0px"),
        new TypographyPresetPayload("\"Inter\", sans-serif", "600", "14px", "1.2", "0px")
    );

    private final SiteRecordRepository siteRecordRepository;
    private final UserAccountRepository userAccountRepository;
    private final SiteTemplateCatalog siteTemplateCatalog;
    private final ObjectMapper objectMapper;

    public SiteService(
        SiteRecordRepository siteRecordRepository,
        UserAccountRepository userAccountRepository,
        SiteTemplateCatalog siteTemplateCatalog,
        ObjectMapper objectMapper
    ) {
        this.siteRecordRepository = siteRecordRepository;
        this.userAccountRepository = userAccountRepository;
        this.siteTemplateCatalog = siteTemplateCatalog;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public List<SiteResponse> listSites(UUID userId) {
        UserAccount user = requireUser(userId);
        return siteRecordRepository.findAllByOwnerUserIdOrderByUpdatedAtDesc(userId).stream()
            .map(site -> toResponse(site, user))
            .toList();
    }

    @Transactional
    public SiteResponse createSite(UUID userId, String templateIdRaw) {
        UserAccount user = requireUser(userId);
        String templateId = trimToNull(templateIdRaw);
        if (templateId == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "TEMPLATE_ID_REQUIRED", "templateId는 필수입니다.");
        }

        SiteTemplateCatalog.SiteTemplateDefinition template = siteTemplateCatalog.requireByTemplateId(templateId);
        long existingTemplateCount = siteRecordRepository.countByOwnerUserIdAndTemplateId(userId, template.templateId());
        String siteSlug = generateUniqueSiteSlug(template.slug());
        String sitePath = "/s/" + siteSlug;
        String siteName = existingTemplateCount == 0 ? template.name() : template.name() + " " + (existingTemplateCount + 1);

        SiteRecord site = new SiteRecord();
        site.setOwnerUserId(userId);
        site.setSiteSlug(siteSlug);
        site.setSitePath(sitePath);
        site.setTemplateId(template.templateId());
        site.setTemplateSlug(template.slug());
        site.setTemplatePath(template.templatePath());
        site.setName(siteName);
        site.setDescription(template.description());
        site.setCustomizationJson(writeCustomizationJson(defaultCustomization(sitePath)));
        site.setLifecycleStatus(SiteLifecycleStatus.DRAFT);

        SiteRecord saved = siteRecordRepository.save(site);
        return toResponse(saved, user);
    }

    @Transactional
    public SiteResponse updateSite(UUID userId, UUID siteId, String nameRaw) {
        UserAccount user = requireUser(userId);
        SiteRecord site = requireOwnedSiteById(userId, siteId);
        String nextName = trimToNull(nameRaw);
        if (nextName == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "SITE_NAME_REQUIRED", "name은 필수입니다.");
        }
        if (nextName.length() > 160) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "SITE_NAME_TOO_LONG", "name은 160자를 초과할 수 없습니다.");
        }

        site.setName(nextName);
        SiteRecord saved = siteRecordRepository.save(site);
        return toResponse(saved, user);
    }

    @Transactional
    public void deleteSite(UUID userId, UUID siteId) {
        requireUser(userId);
        SiteRecord site = requireOwnedSiteById(userId, siteId);
        siteRecordRepository.delete(site);
    }

    @Transactional(readOnly = true)
    public SitePublishStateResponse getPublishState(UUID userId, UUID siteId, String sitePathRaw) {
        requireUser(userId);
        SiteRecord site = requireOwnedSite(userId, siteId, sitePathRaw);
        return toPublishResponse(site);
    }

    @Transactional
    public SitePublishStateResponse publishSite(UUID userId, UUID siteId, String sitePathRaw, String customDomainRaw) {
        requireUser(userId);
        SiteRecord site = requireOwnedSite(userId, siteId, sitePathRaw);

        String customDomain = normalizeCustomDomain(customDomainRaw);
        if (customDomain != null && siteRecordRepository.existsByCustomDomainIgnoreCaseAndIdNot(customDomain, site.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "CUSTOM_DOMAIN_ALREADY_IN_USE", "이미 사용 중인 customDomain입니다.");
        }

        if (trimToNull(site.getPublishedSlug()) == null) {
            site.setPublishedSlug(site.getSiteSlug());
        }
        site.setLifecycleStatus(SiteLifecycleStatus.PUBLISHED);
        site.setCustomDomain(customDomain);
        if (site.getPublishedAt() == null) {
            site.setPublishedAt(Instant.now());
        }

        SiteRecord saved = siteRecordRepository.save(site);
        return toPublishResponse(saved);
    }

    @Transactional
    public SitePublishStateResponse unpublishSite(UUID userId, UUID siteId, String sitePathRaw) {
        requireUser(userId);
        SiteRecord site = requireOwnedSite(userId, siteId, sitePathRaw);

        site.setLifecycleStatus(SiteLifecycleStatus.DRAFT);
        site.setCustomDomain(null);

        SiteRecord saved = siteRecordRepository.save(site);
        return toPublishResponse(saved);
    }

    @Transactional(readOnly = true)
    public PublishedSiteResponse resolvePublishedSite(String publishedSlugRaw) {
        String publishedSlug = normalizePublishedSlug(publishedSlugRaw);
        SiteRecord site = siteRecordRepository
            .findByPublishedSlugAndLifecycleStatus(publishedSlug, SiteLifecycleStatus.PUBLISHED)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PUBLISHED_SITE_NOT_FOUND", "발행된 사이트를 찾을 수 없습니다."));

        return new PublishedSiteResponse(
            site.getSitePath(),
            site.getName(),
            site.getTemplateId(),
            site.getTemplateSlug(),
            site.getPublishedSlug(),
            site.getCustomDomain(),
            site.getPublishedAt()
        );
    }

    @Transactional(readOnly = true)
    public SiteCustomizationResponse getOwnedCustomization(UUID userId, UUID siteId, String sitePathRaw) {
        requireUser(userId);
        SiteRecord site = requireOwnedSite(userId, siteId, sitePathRaw);
        return readCustomization(site);
    }

    @Transactional
    public SiteCustomizationResponse saveCustomization(UUID userId, SiteCustomizationUpdateRequest request) {
        if (request == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_CUSTOMIZATION_REQUEST", "커스터마이징 요청이 필요합니다.");
        }

        SiteRecord site = requireOwnedSite(userId, request.siteId(), request.sitePath());

        List<PatchMutationRequest> patchRequests = collectPatchRequests(request);
        boolean hasWritePayload = request.themeTokens() != null
            || request.typographyTokens() != null
            || request.typographyPresetEnabled() != null
            || request.customFont() != null
            || !patchRequests.isEmpty();

        if (!hasWritePayload) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_CUSTOMIZATION_REQUEST", "저장할 커스터마이징 값이 없습니다.");
        }

        Instant now = Instant.now();
        SiteCustomizationResponse current = readCustomization(site);

        ThemeTokensPayload nextThemeTokens = request.themeTokens() == null
            ? current.themeTokens()
            : mergeThemeTokens(current.themeTokens(), request.themeTokens());

        TypographyTokensPayload nextTypographyTokens = request.typographyTokens() == null
            ? current.typographyTokens()
            : mergeTypographyTokens(current.typographyTokens(), request.typographyTokens());

        boolean nextTypographyPresetEnabled = request.typographyPresetEnabled() != null
            ? request.typographyPresetEnabled()
            : current.typographyPresetEnabled();

        List<CustomFontPayload> nextCustomFonts = request.customFont() == null
            ? current.customFonts()
            : upsertCustomFont(current.customFonts(), request.customFont(), now);

        List<ElementPatchPayload> nextElements = patchRequests.isEmpty()
            ? current.elements()
            : upsertElementPatches(current.elements(), patchRequests, now);

        SiteCustomizationResponse updated = new SiteCustomizationResponse(
            site.getSitePath(),
            nextThemeTokens,
            nextTypographyTokens,
            nextTypographyPresetEnabled,
            nextCustomFonts,
            nextElements,
            now
        );

        site.setCustomizationJson(writeCustomizationJson(updated));
        siteRecordRepository.save(site);
        return updated;
    }

    private UserAccount requireUser(UUID userId) {
        return userAccountRepository.findById(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));
    }

    private SiteRecord requireOwnedSiteById(UUID userId, UUID siteId) {
        return siteRecordRepository.findByOwnerUserIdAndId(userId, siteId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SITE_NOT_FOUND", "사이트를 찾을 수 없습니다."));
    }

    private SiteRecord requireOwnedSiteByPath(UUID userId, String sitePathRaw) {
        String sitePath = normalizeSitePath(sitePathRaw);
        return siteRecordRepository.findByOwnerUserIdAndSitePath(userId, sitePath)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SITE_NOT_FOUND", "사이트를 찾을 수 없습니다."));
    }

    private SiteRecord requireOwnedSite(UUID userId, UUID siteId, String sitePathRaw) {
        if (siteId != null) {
            return requireOwnedSiteById(userId, siteId);
        }

        return requireOwnedSiteByPath(userId, sitePathRaw);
    }

    @Transactional(readOnly = true)
    public SiteCustomizationResponse getPublishedCustomization(String publishedSlugRaw) {
        String publishedSlug = normalizePublishedSlug(publishedSlugRaw);
        SiteRecord site = siteRecordRepository
            .findByPublishedSlugAndLifecycleStatus(publishedSlug, SiteLifecycleStatus.PUBLISHED)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PUBLISHED_SITE_NOT_FOUND", "발행된 사이트를 찾을 수 없습니다."));

        return readCustomization(site);
    }

    private SiteResponse toResponse(SiteRecord site, UserAccount user) {
        return new SiteResponse(
            site.getId(),
            site.getOwnerUserId(),
            user.getEmail(),
            site.getSiteSlug(),
            site.getSitePath(),
            site.getTemplateId(),
            site.getTemplateSlug(),
            site.getTemplatePath(),
            site.getName(),
            site.getDescription(),
            site.getLifecycleStatus(),
            site.getPublishedSlug(),
            site.getCustomDomain(),
            site.getPublishedAt(),
            site.getCreatedAt(),
            site.getUpdatedAt()
        );
    }

    private SitePublishStateResponse toPublishResponse(SiteRecord site) {
        boolean published = site.getLifecycleStatus() == SiteLifecycleStatus.PUBLISHED
            && trimToNull(site.getPublishedSlug()) != null;

        return new SitePublishStateResponse(
            site.getId(),
            site.getSitePath(),
            site.getLifecycleStatus(),
            published,
            site.getPublishedSlug(),
            site.getCustomDomain(),
            site.getPublishedAt(),
            site.getUpdatedAt()
        );
    }

    private String normalizeSitePath(String sitePathRaw) {
        String trimmed = trimToNull(sitePathRaw);
        if (trimmed == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "SITE_PATH_REQUIRED", "sitePath는 필수입니다.");
        }

        String withLeadingSlash = trimmed.startsWith("/") ? trimmed : "/" + trimmed;
        String normalized = withLeadingSlash.replaceAll("/{2,}", "/");
        String withoutTrailingSlash = normalized.length() > 1 && normalized.endsWith("/")
            ? normalized.substring(0, normalized.length() - 1)
            : normalized;

        if (!withoutTrailingSlash.startsWith("/s/")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_SITE_PATH", "유효하지 않은 sitePath입니다.");
        }

        return withoutTrailingSlash;
    }

    private String normalizePublishedSlug(String publishedSlugRaw) {
        String publishedSlug = trimToNull(publishedSlugRaw);
        if (publishedSlug == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PUBLISHED_SLUG_REQUIRED", "publishedSlug는 필수입니다.");
        }
        String normalized = publishedSlug.toLowerCase(Locale.ROOT);
        if (!normalized.matches("[a-z0-9-]{3,180}")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_PUBLISHED_SLUG", "유효하지 않은 publishedSlug입니다.");
        }
        return normalized;
    }

    private String normalizeCustomDomain(String customDomainRaw) {
        String trimmed = trimToNull(customDomainRaw);
        if (trimmed == null) {
            return null;
        }
        String normalized = trimmed.toLowerCase(Locale.ROOT);
        if (!DOMAIN_REGEX.matcher(normalized).matches()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_CUSTOM_DOMAIN", "유효하지 않은 customDomain입니다.");
        }
        return normalized;
    }

    private String generateUniqueSiteSlug(String templateSlug) {
        for (int attempt = 0; attempt < 10; attempt += 1) {
            String candidate = templateSlug + "-" + UUID.randomUUID().toString().split("-")[0];
            if (!siteRecordRepository.existsBySiteSlug(candidate)) {
                return candidate;
            }
        }
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "SITE_SLUG_GENERATION_FAILED", "사이트 슬러그 생성에 실패했습니다.");
    }

    private SiteCustomizationResponse defaultCustomization(String sitePath) {
        return new SiteCustomizationResponse(
            sitePath,
            DEFAULT_THEME_TOKENS,
            DEFAULT_TYPOGRAPHY_TOKENS,
            false,
            List.of(),
            List.of(),
            Instant.now()
        );
    }

    private SiteCustomizationResponse readCustomization(SiteRecord site) {
        String rawJson = trimToNull(site.getCustomizationJson());
        if (rawJson == null) {
            return defaultCustomization(site.getSitePath());
        }

        try {
            SiteCustomizationResponse parsed = objectMapper.readValue(rawJson, SiteCustomizationResponse.class);
            return new SiteCustomizationResponse(
                site.getSitePath(),
                parsed.themeTokens() == null ? DEFAULT_THEME_TOKENS : mergeThemeTokens(DEFAULT_THEME_TOKENS, parsed.themeTokens()),
                parsed.typographyTokens() == null ? DEFAULT_TYPOGRAPHY_TOKENS : mergeTypographyTokens(DEFAULT_TYPOGRAPHY_TOKENS, parsed.typographyTokens()),
                parsed.typographyPresetEnabled(),
                parsed.customFonts() == null ? List.of() : List.copyOf(parsed.customFonts()),
                parsed.elements() == null ? List.of() : List.copyOf(parsed.elements()),
                parsed.updatedAt() == null ? site.getUpdatedAt() : parsed.updatedAt()
            );
        } catch (JsonProcessingException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "CUSTOMIZATION_PARSE_FAILED", "사이트 커스터마이징을 읽을 수 없습니다.");
        }
    }

    private String writeCustomizationJson(SiteCustomizationResponse customization) {
        try {
            return objectMapper.writeValueAsString(customization);
        } catch (JsonProcessingException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "CUSTOMIZATION_SERIALIZE_FAILED", "사이트 커스터마이징을 저장할 수 없습니다.");
        }
    }

    private List<PatchMutationRequest> collectPatchRequests(SiteCustomizationUpdateRequest request) {
        List<PatchMutationRequest> requests = new ArrayList<>();
        if (trimToNull(request.editId()) != null && request.patch() != null) {
            requests.add(new PatchMutationRequest(request.editId(), request.patch()));
        }
        if (request.patches() != null) {
            requests.addAll(request.patches());
        }
        return requests;
    }

    private ThemeTokensPayload mergeThemeTokens(ThemeTokensPayload current, ThemeTokensPayload incoming) {
        return new ThemeTokensPayload(
            coalesce(incoming.primary(), current.primary()),
            coalesce(incoming.secondary(), current.secondary()),
            coalesce(incoming.radius(), current.radius()),
            coalesce(incoming.spacingBase(), current.spacingBase())
        );
    }

    private TypographyTokensPayload mergeTypographyTokens(TypographyTokensPayload current, TypographyTokensPayload incoming) {
        return new TypographyTokensPayload(
            mergeTypographyPreset(current.heading(), incoming.heading()),
            mergeTypographyPreset(current.body(), incoming.body()),
            mergeTypographyPreset(current.button(), incoming.button())
        );
    }

    private TypographyPresetPayload mergeTypographyPreset(TypographyPresetPayload current, TypographyPresetPayload incoming) {
        if (incoming == null) {
            return current;
        }

        return new TypographyPresetPayload(
            coalesce(incoming.fontFamily(), current.fontFamily()),
            coalesce(incoming.fontWeight(), current.fontWeight()),
            coalesce(incoming.fontSize(), current.fontSize()),
            coalesce(incoming.lineHeight(), current.lineHeight()),
            coalesce(incoming.letterSpacing(), current.letterSpacing())
        );
    }

    private List<CustomFontPayload> upsertCustomFont(List<CustomFontPayload> currentFonts, CustomFontPayload incoming, Instant now) {
        String family = trimToNull(incoming.family());
        String url = trimToNull(incoming.url());
        if (family == null || url == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_CUSTOM_FONT", "customFont에는 family와 url이 필요합니다.");
        }

        List<CustomFontPayload> next = new ArrayList<>(currentFonts == null ? List.of() : currentFonts);
        CustomFontPayload normalized = new CustomFontPayload(family, url, now);

        for (int i = 0; i < next.size(); i += 1) {
            CustomFontPayload existing = next.get(i);
            if (existing.family() != null && existing.family().equalsIgnoreCase(family)) {
                next.set(i, normalized);
                return List.copyOf(next);
            }
        }

        next.add(normalized);
        return List.copyOf(next);
    }

    private List<ElementPatchPayload> upsertElementPatches(
        List<ElementPatchPayload> currentElements,
        List<PatchMutationRequest> requests,
        Instant now
    ) {
        LinkedHashMap<String, ElementPatchPayload> byEditId = new LinkedHashMap<>();
        if (currentElements != null) {
            for (ElementPatchPayload element : currentElements) {
                if (trimToNull(element.editId()) == null) {
                    continue;
                }
                byEditId.put(element.editId(), element);
            }
        }

        for (PatchMutationRequest request : requests) {
            String editId = trimToNull(request.editId());
            if (editId == null || request.patch() == null) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_PATCH_REQUEST", "각 patch 요청에는 editId와 patch가 필요합니다.");
            }

            ElementPatchPayload existing = byEditId.get(editId);
            Map<String, String> mergedStyles = new LinkedHashMap<>();
            if (existing != null && existing.styles() != null) {
                mergedStyles.putAll(existing.styles());
            }
            if (request.patch().styles() != null) {
                request.patch().styles().forEach((key, value) -> {
                    if (trimToNull(key) != null && value != null) {
                        mergedStyles.put(key, value);
                    }
                });
            }

            byEditId.put(editId, new ElementPatchPayload(
                editId,
                Collections.unmodifiableMap(mergedStyles),
                request.patch().innerText() != null ? request.patch().innerText() : existing == null ? null : existing.innerText(),
                request.patch().src() != null ? request.patch().src() : existing == null ? null : existing.src(),
                request.patch().href() != null ? request.patch().href() : existing == null ? null : existing.href(),
                now
            ));
        }

        return List.copyOf(byEditId.values());
    }

    private String coalesce(String preferred, String fallback) {
        String trimmed = trimToNull(preferred);
        return trimmed != null ? trimmed : fallback;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
