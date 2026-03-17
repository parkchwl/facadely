package com.facadely.backend.auth;

import com.facadely.backend.auth.domain.UserAccount;
import com.facadely.backend.auth.repository.AuthAuditLogRepository;
import com.facadely.backend.auth.repository.OAuthGoogleAccountRepository;
import com.facadely.backend.auth.repository.RefreshTokenRepository;
import com.facadely.backend.auth.repository.TermsAgreementRepository;
import com.facadely.backend.auth.repository.UserAccountRepository;
import com.facadely.backend.auth.repository.UserCredentialRepository;
import com.facadely.backend.auth.service.LoginAttemptService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.mock.web.MockHttpSession;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    private static final String AUTH_BASE = "/api/v1/auth";
    private static final String FRONTEND_ORIGIN = "http://localhost:3000";
    private static final String ACCESS_COOKIE = "facadely_at";
    private static final String REFRESH_COOKIE = "facadely_rt";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthAuditLogRepository authAuditLogRepository;

    @Autowired
    private OAuthGoogleAccountRepository oAuthGoogleAccountRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private TermsAgreementRepository termsAgreementRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private UserCredentialRepository userCredentialRepository;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @BeforeEach
    void cleanDatabase() {
        refreshTokenRepository.deleteAllInBatch();
        authAuditLogRepository.deleteAllInBatch();
        oAuthGoogleAccountRepository.deleteAllInBatch();
        termsAgreementRepository.deleteAllInBatch();
        userCredentialRepository.deleteAllInBatch();
        userAccountRepository.deleteAllInBatch();
        loginAttemptService.clearAll();
    }

    @Test
    void signupSetsCookiesAndPersistsTermsAgreement() throws Exception {
        MvcResult result = signup("signup@example.com");

        Map<String, String> cookies = responseCookies(result);

        assertThat(cookies).containsKeys(ACCESS_COOKIE, REFRESH_COOKIE);
        assertThat(refreshTokenRepository.count()).isEqualTo(1);

        UserAccount user = userAccountRepository.findByEmailIgnoreCase("signup@example.com").orElseThrow();
        assertThat(termsAgreementRepository.existsByUserId(user.getId())).isTrue();
    }

    @Test
    void refreshRotatesRefreshTokenAndRejectsReuse() throws Exception {
        MvcResult signupResult = signup("refresh@example.com");
        String originalRefreshToken = responseCookies(signupResult).get(REFRESH_COOKIE);

        MvcResult refreshResult = mockMvc.perform(post(AUTH_BASE + "/refresh")
                .header("Origin", FRONTEND_ORIGIN)
                .cookie(new Cookie(REFRESH_COOKIE, originalRefreshToken)))
            .andExpect(status().isOk())
            .andReturn();

        String rotatedRefreshToken = responseCookies(refreshResult).get(REFRESH_COOKIE);

        assertThat(rotatedRefreshToken).isNotBlank();
        assertThat(rotatedRefreshToken).isNotEqualTo(originalRefreshToken);
        assertThat(refreshTokenRepository.count()).isEqualTo(2);

        mockMvc.perform(post(AUTH_BASE + "/refresh")
                .header("Origin", FRONTEND_ORIGIN)
                .cookie(new Cookie(REFRESH_COOKIE, originalRefreshToken)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value("INVALID_REFRESH_TOKEN"));
    }

    @Test
    void auditSummaryAggregatesCurrentUsersAuthEvents() throws Exception {
        signup("audit@example.com");

        MvcResult loginResult = login("audit@example.com");
        Map<String, String> loginCookies = responseCookies(loginResult);

        MvcResult refreshResult = mockMvc.perform(post(AUTH_BASE + "/refresh")
                .header("Origin", FRONTEND_ORIGIN)
                .cookie(new Cookie(REFRESH_COOKIE, loginCookies.get(REFRESH_COOKIE))))
            .andExpect(status().isOk())
            .andReturn();

        Map<String, String> refreshedCookies = responseCookies(refreshResult);

        mockMvc.perform(post(AUTH_BASE + "/logout")
                .header("Origin", FRONTEND_ORIGIN)
                .cookie(
                    new Cookie(ACCESS_COOKIE, refreshedCookies.get(ACCESS_COOKIE)),
                    new Cookie(REFRESH_COOKIE, refreshedCookies.get(REFRESH_COOKIE))
                ))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("로그아웃 되었습니다."));

        mockMvc.perform(get(AUTH_BASE + "/audit-summary")
                .cookie(new Cookie(ACCESS_COOKIE, refreshedCookies.get(ACCESS_COOKIE))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalEvents").value(4))
            .andExpect(jsonPath("$.signupCount").value(1))
            .andExpect(jsonPath("$.passwordLoginCount").value(1))
            .andExpect(jsonPath("$.googleLoginCount").value(0))
            .andExpect(jsonPath("$.refreshCount").value(1))
            .andExpect(jsonPath("$.logoutCount").value(1))
            .andExpect(jsonPath("$.lastSignupAt").isNotEmpty())
            .andExpect(jsonPath("$.lastPasswordLoginAt").isNotEmpty())
            .andExpect(jsonPath("$.lastRefreshAt").isNotEmpty())
            .andExpect(jsonPath("$.lastLogoutAt").isNotEmpty());
    }

    @Test
    void mePrefersJwtCookieOverExistingNonUuidAuthentication() throws Exception {
        MvcResult signupResult = signup("google-session@example.com");
        String accessToken = responseCookies(signupResult).get(ACCESS_COOKIE);

        mockMvc.perform(get(AUTH_BASE + "/me")
                .cookie(new Cookie(ACCESS_COOKIE, accessToken))
                .with(authentication(new UsernamePasswordAuthenticationToken("google-subject", null))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("google-session@example.com"))
            .andExpect(jsonPath("$.termsAgreed").value(true));
    }

    @Test
    void logoutClearsSessionAuthenticationAndRejectsMeWithoutAccessCookie() throws Exception {
        MvcResult signupResult = signup("logout-session@example.com");
        Map<String, String> cookies = responseCookies(signupResult);
        MockHttpSession session = new MockHttpSession();

        mockMvc.perform(get(AUTH_BASE + "/me")
                .session(session)
                .cookie(new Cookie(ACCESS_COOKIE, cookies.get(ACCESS_COOKIE))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("logout-session@example.com"));

        mockMvc.perform(post(AUTH_BASE + "/logout")
                .session(session)
                .header("Origin", FRONTEND_ORIGIN)
                .cookie(
                    new Cookie(ACCESS_COOKIE, cookies.get(ACCESS_COOKIE)),
                    new Cookie(REFRESH_COOKIE, cookies.get(REFRESH_COOKIE))
                ))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("로그아웃 되었습니다."));

        mockMvc.perform(get(AUTH_BASE + "/me")
                .session(session))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    void authPostRejectsMismatchedOrigin() throws Exception {
        mockMvc.perform(post(AUTH_BASE + "/signup")
                .header("Referer", "http://malicious.local/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signupPayload("blocked@example.com")))
            .andExpect(status().isForbidden())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            .andExpect(jsonPath("$.code").value("INVALID_ORIGIN"));
    }

    @Test
    void signupRateLimitsRepeatedAttemptsFromSameIp() throws Exception {
        for (int i = 0; i < 5; i += 1) {
            signup("signup-rate-" + i + "@example.com");
        }

        mockMvc.perform(post(AUTH_BASE + "/signup")
                .header("Origin", FRONTEND_ORIGIN)
                .header("User-Agent", "JUnit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signupPayload("signup-rate-blocked@example.com")))
            .andExpect(status().isTooManyRequests())
            .andExpect(jsonPath("$.code").value("SIGNUP_RATE_LIMITED"));
    }

    private MvcResult signup(String email) throws Exception {
        return mockMvc.perform(post(AUTH_BASE + "/signup")
                .header("Origin", FRONTEND_ORIGIN)
                .header("User-Agent", "JUnit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signupPayload(email)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value(email))
            .andExpect(jsonPath("$.termsAgreed").value(true))
            .andReturn();
    }

    private MvcResult login(String email) throws Exception {
        return mockMvc.perform(post(AUTH_BASE + "/login")
                .header("Origin", FRONTEND_ORIGIN)
                .header("User-Agent", "JUnit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "%s",
                      "password": "Password123!"
                    }
                    """.formatted(email)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value(email))
            .andReturn();
    }

    private String signupPayload(String email) {
        return """
            {
              "email": "%s",
              "password": "Password123!",
              "name": "Demo User",
              "locale": "ko",
              "agreeTerms": true
            }
            """.formatted(email);
    }

    private Map<String, String> responseCookies(MvcResult result) {
        List<String> headers = result.getResponse().getHeaders(HttpHeaders.SET_COOKIE);
        Map<String, String> cookies = new LinkedHashMap<>();
        for (String header : headers) {
            String[] parts = header.split(";", 2)[0].split("=", 2);
            if (parts.length == 2) {
                cookies.put(parts[0], parts[1]);
            }
        }
        return cookies;
    }
}
