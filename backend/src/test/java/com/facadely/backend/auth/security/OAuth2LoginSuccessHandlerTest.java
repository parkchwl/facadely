package com.facadely.backend.auth.security;

import com.facadely.backend.auth.config.AuthProperties;
import com.facadely.backend.auth.config.CookieFactory;
import com.facadely.backend.auth.domain.UserRole;
import com.facadely.backend.auth.dto.MeResponse;
import com.facadely.backend.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class OAuth2LoginSuccessHandlerTest {

    @Test
    void redirectsDirectlyToNextPathAfterGoogleLogin() throws Exception {
        AuthProperties properties = new AuthProperties();
        properties.setFrontendOrigin("https://facadely.com");
        properties.setDefaultLocale("en");
        properties.getCookie().setSecure(true);
        properties.getCookie().setSameSite("Lax");

        AuthService authService = mock(AuthService.class);
        CookieFactory cookieFactory = new CookieFactory(properties);
        OAuth2LoginSuccessHandler handler = new OAuth2LoginSuccessHandler(authService, cookieFactory, properties);

        AuthService.AuthBundle bundle = new AuthService.AuthBundle(
            "access-token",
            "refresh-token",
            900,
            1209600,
            new MeResponse(UUID.randomUUID(), "owner@example.com", "Owner", UserRole.USER, true)
        );
        when(authService.handleGoogleLogin(eq("google-sub"), eq("owner@example.com"), eq("Owner"), any(), any()))
            .thenReturn(bundle);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(
            new Cookie("facadely_lang", "en"),
            new Cookie("facadely_next", "%2Feditor%3FsitePath%3D%252Fs%252Fdemo")
        );

        MockHttpServletResponse response = new MockHttpServletResponse();
        OAuth2User principal = new DefaultOAuth2User(
            java.util.List.of(new SimpleGrantedAuthority("ROLE_USER")),
            Map.of("sub", "google-sub", "email", "owner@example.com", "name", "Owner"),
            "sub"
        );

        handler.onAuthenticationSuccess(
            request,
            response,
            new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities())
        );

        assertThat(response.getRedirectedUrl()).isEqualTo("https://facadely.com/editor?sitePath=%2Fs%2Fdemo");
        assertThat(response.getHeaders("Set-Cookie")).anyMatch(header -> header.contains("facadely_at="));
    }
}
