package com.facadely.backend.auth.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AuthConfigurationValidatorTest {

    @Test
    void nonLocalOriginRequiresCookieDomain() {
        AuthProperties properties = baseProperties();
        properties.setFrontendOrigin("https://facadely.com");
        properties.getCookie().setDomain(null);

        AuthConfigurationValidator validator = new AuthConfigurationValidator(properties, environment());

        assertThatThrownBy(validator::validate)
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("COOKIE_DOMAIN must be configured");
    }

    @Test
    void cookieDomainMustMatchFrontendOriginOrParentDomain() {
        AuthProperties properties = baseProperties();
        properties.setFrontendOrigin("https://facadely.com");
        properties.getCookie().setDomain("another-domain.com");

        AuthConfigurationValidator validator = new AuthConfigurationValidator(properties, environment());

        assertThatThrownBy(validator::validate)
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("COOKIE_DOMAIN must match FRONTEND_ORIGIN or its parent domain");
    }

    @Test
    void matchingCookieDomainPassesValidation() {
        AuthProperties properties = baseProperties();
        properties.setFrontendOrigin("https://app.facadely.com");
        properties.getCookie().setDomain("facadely.com");

        AuthConfigurationValidator validator = new AuthConfigurationValidator(properties, environment());

        assertThatCode(validator::validate).doesNotThrowAnyException();
    }

    private AuthProperties baseProperties() {
        AuthProperties properties = new AuthProperties();
        properties.getJwt().setAccessSecret("12345678901234567890123456789012");
        properties.getCookie().setSecure(true);
        properties.getCookie().setSameSite("Lax");
        return properties;
    }

    private MockEnvironment environment() {
        return new MockEnvironment()
            .withProperty("spring.security.oauth2.client.registration.google.client-id", "test-client-id")
            .withProperty("spring.security.oauth2.client.registration.google.client-secret", "test-client-secret");
    }
}
