package com.facadely.backend.auth.security;

import com.facadely.backend.auth.config.AuthProperties;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {

    private final AuthProperties authProperties;

    public OAuth2LoginFailureHandler(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
        throws IOException, ServletException {

        String redirectUrl = UriComponentsBuilder
            .fromUriString(authProperties.getFrontendOrigin())
            .pathSegment(authProperties.getDefaultLocale(), "login")
            .queryParam("oauth", "error")
            .queryParam("error", "google_login_failed")
            .build(true)
            .toUriString();

        response.sendRedirect(redirectUrl);
    }
}
