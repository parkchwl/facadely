package com.facadely.backend.site;

import com.facadely.backend.auth.repository.AuthAuditLogRepository;
import com.facadely.backend.auth.repository.OAuthGoogleAccountRepository;
import com.facadely.backend.auth.repository.RefreshTokenRepository;
import com.facadely.backend.auth.repository.TermsAgreementRepository;
import com.facadely.backend.auth.repository.UserAccountRepository;
import com.facadely.backend.auth.repository.UserCredentialRepository;
import com.facadely.backend.auth.service.LoginAttemptService;
import com.facadely.backend.site.repository.SiteRecordRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SiteControllerIntegrationTest {

    private static final String AUTH_BASE = "/api/v1/auth";
    private static final String SITE_BASE = "/api/v1/sites";
    private static final String FRONTEND_ORIGIN = "http://localhost:3000";
    private static final String ACCESS_COOKIE = "facadely_at";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SiteRecordRepository siteRecordRepository;

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
        siteRecordRepository.deleteAllInBatch();
        refreshTokenRepository.deleteAllInBatch();
        authAuditLogRepository.deleteAllInBatch();
        oAuthGoogleAccountRepository.deleteAllInBatch();
        termsAgreementRepository.deleteAllInBatch();
        userCredentialRepository.deleteAllInBatch();
        userAccountRepository.deleteAllInBatch();
        loginAttemptService.clearAll();
    }

    @Test
    void createSitePersistsOwnedSiteAndListsIt() throws Exception {
        MvcResult signupResult = signup("site-owner@example.com");
        String accessToken = responseCookies(signupResult).get(ACCESS_COOKIE);

        mockMvc.perform(post(SITE_BASE)
                .cookie(new Cookie(ACCESS_COOKIE, accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "templateId": "velocity-saas-landing"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.site.templateId").value("velocity-saas-landing"))
            .andExpect(jsonPath("$.site.name").value("Velocity SaaS Landing"))
            .andExpect(jsonPath("$.site.lifecycleStatus").value("DRAFT"));

        mockMvc.perform(get(SITE_BASE)
                .cookie(new Cookie(ACCESS_COOKIE, accessToken)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sites.length()").value(1))
            .andExpect(jsonPath("$.sites[0].templateSlug").value("velocity-saas-landing"));
    }

    @Test
    void siteCanBeRenamedAndDeletedByOwner() throws Exception {
        MvcResult signupResult = signup("rename-owner@example.com");
        String accessToken = responseCookies(signupResult).get(ACCESS_COOKIE);
        JsonNode site = createSite(accessToken, "onepro-dashboard-white");
        String siteId = site.path("id").asText();

        mockMvc.perform(patch(SITE_BASE + "/" + siteId)
                .cookie(new Cookie(ACCESS_COOKIE, accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "name": "Park Workspace"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.site.name").value("Park Workspace"));

        mockMvc.perform(delete(SITE_BASE + "/" + siteId)
                .cookie(new Cookie(ACCESS_COOKIE, accessToken)))
            .andExpect(status().isNoContent());

        mockMvc.perform(get(SITE_BASE)
                .cookie(new Cookie(ACCESS_COOKIE, accessToken)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sites.length()").value(0));
    }

    @Test
    void siteCanBePublishedAndResolvedPublicly() throws Exception {
        MvcResult signupResult = signup("publish-owner@example.com");
        String accessToken = responseCookies(signupResult).get(ACCESS_COOKIE);
        JsonNode site = createSite(accessToken, "velocity-saas-landing");
        String sitePath = site.path("sitePath").asText();
        String siteSlug = site.path("siteSlug").asText();

        mockMvc.perform(post(SITE_BASE + "/publish")
                .cookie(new Cookie(ACCESS_COOKIE, accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "sitePath": "%s"
                    }
                    """.formatted(sitePath)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.publish.published").value(true))
            .andExpect(jsonPath("$.publish.lifecycleStatus").value("PUBLISHED"))
            .andExpect(jsonPath("$.publish.publishedSlug").value(siteSlug));

        mockMvc.perform(get(SITE_BASE + "/publish")
                .cookie(new Cookie(ACCESS_COOKIE, accessToken))
                .param("sitePath", sitePath))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.publish.published").value(true))
            .andExpect(jsonPath("$.publish.publishedSlug").value(siteSlug));

        mockMvc.perform(get(SITE_BASE + "/public/" + siteSlug))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.publishedSite.sitePath").value(sitePath))
            .andExpect(jsonPath("$.publishedSite.publishedSlug").value(siteSlug));

        mockMvc.perform(delete(SITE_BASE + "/publish")
                .cookie(new Cookie(ACCESS_COOKIE, accessToken))
                .param("sitePath", sitePath))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.publish.published").value(false))
            .andExpect(jsonPath("$.publish.lifecycleStatus").value("DRAFT"));

        mockMvc.perform(get(SITE_BASE + "/public/" + siteSlug))
            .andExpect(status().isNotFound());
    }

    @Test
    void customizationCanBeSavedByOwnerAndReadOnlyAfterPublish() throws Exception {
        MvcResult signupResult = signup("customization-owner@example.com");
        String accessToken = responseCookies(signupResult).get(ACCESS_COOKIE);

        JsonNode site = createSite(accessToken, "nexus-ai-enterprise");
        String sitePath = site.path("sitePath").asText();
        String siteSlug = site.path("siteSlug").asText();
        String siteId = site.path("id").asText();
        assertThat(sitePath).startsWith("/s/nexus-ai-enterprise-");

        mockMvc.perform(post(SITE_BASE + "/customization")
                .cookie(new Cookie(ACCESS_COOKIE, accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "sitePath": "%s",
                      "themeTokens": {
                        "primary": "#123456"
                      },
                      "patches": [
                        {
                          "editId": "t5-title",
                          "patch": {
                            "innerText": "Saved from backend",
                            "styles": {
                              "color": "#123456"
                            }
                          }
                        }
                      ]
                    }
                    """.formatted(sitePath)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.customization.themeTokens.primary").value("#123456"))
            .andExpect(jsonPath("$.customization.elements[0].editId").value("t5-title"));

        mockMvc.perform(get(SITE_BASE + "/customization")
                .cookie(new Cookie(ACCESS_COOKIE, accessToken))
                .param("siteId", siteId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.customization.themeTokens.primary").value("#123456"))
            .andExpect(jsonPath("$.customization.elements[0].innerText").value("Saved from backend"));

        mockMvc.perform(get(SITE_BASE + "/customization")
                .param("sitePath", sitePath))
            .andExpect(status().isUnauthorized());

        mockMvc.perform(get(SITE_BASE + "/public/" + siteSlug + "/customization"))
            .andExpect(status().isNotFound());

        mockMvc.perform(post(SITE_BASE + "/publish")
                .cookie(new Cookie(ACCESS_COOKIE, accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "siteId": "%s"
                    }
                    """.formatted(siteId)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.publish.published").value(true));

        mockMvc.perform(get(SITE_BASE + "/public/" + siteSlug + "/customization"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.customization.themeTokens.primary").value("#123456"))
            .andExpect(jsonPath("$.customization.elements[0].innerText").value("Saved from backend"));
    }

    private JsonNode createSite(String accessToken, String templateId) throws Exception {
        MvcResult createResult = mockMvc.perform(post(SITE_BASE)
                .cookie(new Cookie(ACCESS_COOKIE, accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "templateId": "%s"
                    }
                    """.formatted(templateId)))
            .andExpect(status().isOk())
            .andReturn();

        return objectMapper.readTree(createResult.getResponse().getContentAsString()).path("site");
    }

    private MvcResult signup(String email) throws Exception {
        return mockMvc.perform(post(AUTH_BASE + "/signup")
                .header("Origin", FRONTEND_ORIGIN)
                .header("User-Agent", "JUnit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signupPayload(email)))
            .andExpect(status().isOk())
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
