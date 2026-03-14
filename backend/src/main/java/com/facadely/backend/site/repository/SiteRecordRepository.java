package com.facadely.backend.site.repository;

import com.facadely.backend.site.domain.SiteLifecycleStatus;
import com.facadely.backend.site.domain.SiteRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SiteRecordRepository extends JpaRepository<SiteRecord, UUID> {
    List<SiteRecord> findAllByOwnerUserIdOrderByUpdatedAtDesc(UUID ownerUserId);
    Optional<SiteRecord> findByOwnerUserIdAndId(UUID ownerUserId, UUID id);
    Optional<SiteRecord> findByOwnerUserIdAndSitePath(UUID ownerUserId, String sitePath);
    Optional<SiteRecord> findBySitePath(String sitePath);
    Optional<SiteRecord> findByPublishedSlugAndLifecycleStatus(String publishedSlug, SiteLifecycleStatus lifecycleStatus);
    boolean existsBySiteSlug(String siteSlug);
    boolean existsByCustomDomainIgnoreCaseAndIdNot(String customDomain, UUID id);
    long countByOwnerUserIdAndTemplateId(UUID ownerUserId, String templateId);
}
