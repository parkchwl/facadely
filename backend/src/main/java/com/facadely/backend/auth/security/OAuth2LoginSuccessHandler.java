package com.facadely.backend.auth.security;

import com.facadely.backend.auth.config.AuthProperties;
import com.facadely.backend.auth.config.CookieFactory;
import com.facadely.backend.auth.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;
    private final CookieFactory cookieFactory;
    private final AuthProperties authProperties;

    public OAuth2LoginSuccessHandler(AuthService authService, CookieFactory cookieFactory, AuthProperties authProperties) {
        this.authService = authService;
        this.cookieFactory = cookieFactory;
        this.authProperties = authProperties;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
        throws IOException, ServletException {

        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String sub = principal.getAttribute("sub");
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");

        if (sub == null || email == null) {
            response.sendRedirect(buildFrontendUrl(resolveLocale(request), "error", "google_profile_invalid"));
            return;
        }

        AuthService.AuthBundle bundle = authService.handleGoogleLogin(
            sub,
            email,
            name,
            request.getHeader("User-Agent"),
            request.getRemoteAddr()
        );

        response.addHeader("Set-Cookie", cookieFactory.accessCookie(bundle.accessToken(), bundle.accessMaxAgeSeconds()).toString());
        response.addHeader("Set-Cookie", cookieFactory.refreshCookie(bundle.refreshToken(), bundle.refreshMaxAgeSeconds()).toString());
        response.addHeader("Set-Cookie", "facadely_lang=; Path=/; Max-Age=0; SameSite=Lax");

        response.sendRedirect(buildFrontendUrl(resolveLocale(request), "success", null));
    }

    private String resolveLocale(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("facadely_lang".equals(cookie.getName())) {
                    String value = cookie.getValue();
                    if (value != null && value.matches("^[a-zA-Z-]{2,10}$")) {
                        return value;
                    }
                }
            }
        }
        return authProperties.getDefaultLocale();
    }

    private String buildFrontendUrl(String locale, String result, String errorCode) {
        UriComponentsBuilder builder = UriComponentsBuilder
            .fromUriString(authProperties.getFrontendOrigin())
            .pathSegment(locale, "login")
            .queryParam("oauth", result);

        if (errorCode != null) {
            builder.queryParam("error", errorCode);
        }

        return builder.build(true).toUriString();
    }
}
