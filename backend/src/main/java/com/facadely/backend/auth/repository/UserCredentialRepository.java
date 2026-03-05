package com.facadely.backend.auth.repository;

import com.facadely.backend.auth.domain.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserCredentialRepository extends JpaRepository<UserCredential, UUID> {
}
