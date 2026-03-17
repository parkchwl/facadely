package com.facadely.backend.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.auth")
public class AuthProperties {

    private String frontendOrigin = "http://localhost:3000";
    private String defaultLocale = "en";
    private String termsVersion = "2026-01";
    private String privacyVersion = "2026-01";
    private final Jwt jwt = new Jwt();
    private final Cookie cookie = new Cookie();

    public String getFrontendOrigin() {
        return frontendOrigin;
    }

    public void setFrontendOrigin(String frontendOrigin) {
        this.frontendOrigin = frontendOrigin;
    }

    public String getDefaultLocale() {
        return defaultLocale;
    }

    public void setDefaultLocale(String defaultLocale) {
        this.defaultLocale = defaultLocale;
    }

    public String getTermsVersion() {
        return termsVersion;
    }

    public void setTermsVersion(String termsVersion) {
        this.termsVersion = termsVersion;
    }

    public String getPrivacyVersion() {
        return privacyVersion;
    }

    public void setPrivacyVersion(String privacyVersion) {
        this.privacyVersion = privacyVersion;
    }

    public Jwt getJwt() {
        return jwt;
    }

    public Cookie getCookie() {
        return cookie;
    }

    public static class Jwt {
        private String accessSecret = "change-this-access-secret-change-this-access-secret";
        private long accessTtlSeconds = 900;
        private long refreshTtlSeconds = 1209600;

        public String getAccessSecret() {
            return accessSecret;
        }

        public void setAccessSecret(String accessSecret) {
            this.accessSecret = accessSecret;
        }

        public long getAccessTtlSeconds() {
            return accessTtlSeconds;
        }

        public void setAccessTtlSeconds(long accessTtlSeconds) {
            this.accessTtlSeconds = accessTtlSeconds;
        }

        public long getRefreshTtlSeconds() {
            return refreshTtlSeconds;
        }

        public void setRefreshTtlSeconds(long refreshTtlSeconds) {
            this.refreshTtlSeconds = refreshTtlSeconds;
        }
    }

    public static class Cookie {
        private boolean secure = false;
        private String sameSite = "Lax";
        private String accessName = "facadely_at";
        private String refreshName = "facadely_rt";
        private String domain;

        public boolean isSecure() {
            return secure;
        }

        public void setSecure(boolean secure) {
            this.secure = secure;
        }

        public String getSameSite() {
            return sameSite;
        }

        public void setSameSite(String sameSite) {
            this.sameSite = sameSite;
        }

        public String getAccessName() {
            return accessName;
        }

        public void setAccessName(String accessName) {
            this.accessName = accessName;
        }

        public String getRefreshName() {
            return refreshName;
        }

        public void setRefreshName(String refreshName) {
            this.refreshName = refreshName;
        }

        public String getDomain() {
            return domain;
        }

        public void setDomain(String domain) {
            this.domain = domain;
        }
    }
}
