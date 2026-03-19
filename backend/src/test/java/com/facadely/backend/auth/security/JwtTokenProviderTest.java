package com.facadely.backend.auth.security;

import com.facadely.backend.auth.config.AuthProperties;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtTokenProviderTest {

    @Test
    void createAccessTokenRejectsShortSecret() {
        AuthProperties properties = new AuthProperties();
        properties.getJwt().setAccessSecret("short-secret");

        JwtTokenProvider provider = new JwtTokenProvider(properties);

        assertThatThrownBy(() -> provider.createAccessToken(
            java.util.UUID.randomUUID(),
            "test-user@facadely.local",
            "USER"
        ))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("at least 32 bytes");
    }
}
