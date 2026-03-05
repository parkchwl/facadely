package com.facadely.backend.auth.repository;

import com.facadely.backend.auth.domain.AuthAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AuthAuditLogRepository extends JpaRepository<AuthAuditLog, UUID> {
}
