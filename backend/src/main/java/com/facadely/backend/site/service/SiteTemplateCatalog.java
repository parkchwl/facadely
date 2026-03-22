package com.facadely.backend.site.service;

import com.facadely.backend.common.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class SiteTemplateCatalog {

    private final Map<String, SiteTemplateDefinition> byTemplateId;

    public SiteTemplateCatalog() {
        List<SiteTemplateDefinition> templates = List.of(
            new SiteTemplateDefinition(
                "velocity-saas-landing",
                "velocity-saas-landing",
                "/s/velocity-saas-landing",
                "Velocity SaaS Landing",
                "Dark SaaS landing template with hero, feature grid, and social proof"
            ),
            new SiteTemplateDefinition(
                "nexus-ai-enterprise",
                "nexus-ai-enterprise",
                "/s/nexus-ai-enterprise",
                "Nexus AI Enterprise",
                "Dark enterprise AI consulting landing template"
            ),
            new SiteTemplateDefinition(
                "onepro-dashboard-white",
                "onepro-dashboard-white",
                "/s/onepro-dashboard-white",
                "OnePro Dashboard",
                "SaaS dashboard hero template"
            ),
            new SiteTemplateDefinition(
                "ion-modern-product",
                "ion-modern-product",
                "/s/ion-modern-product",
                "Modern Product Landing",
                "Dark premium product landing page with performance storytelling and technical feature panels"
            ),
            new SiteTemplateDefinition(
                "nocturne-typography-agency",
                "nocturne-typography-agency",
                "/s/nocturne-typography-agency",
                "Typography Agency",
                "Cinematic dark portfolio template with editorial typography and luxury creative studio layouts"
            ),
            new SiteTemplateDefinition(
                "verdant-ecommerce-editorial",
                "verdant-ecommerce-editorial",
                "/s/verdant-ecommerce-editorial",
                "E-Commerce Editorial",
                "Organic wellness e-commerce template with soft editorial product storytelling"
            ),
            new SiteTemplateDefinition(
                "sejour-luxury-wellness-resort",
                "sejour-luxury-wellness-resort",
                "/s/sejour-luxury-wellness-resort",
                "Luxury Wellness Resort",
                "High-end hospitality landing page with serene hero imagery and curated resort sections"
            ),
            new SiteTemplateDefinition(
                "vault-fintech-dashboard",
                "vault-fintech-dashboard",
                "/s/vault-fintech-dashboard",
                "Fintech Dashboard Landing",
                "Modern fintech landing page with dashboard preview, pricing tiers, and finance-focused feature sections"
            ),
            new SiteTemplateDefinition(
                "serenica-wellness-retreat",
                "serenica-wellness-retreat",
                "/s/serenica-wellness-retreat",
                "Serenica Wellness Retreat",
                "Calm wellness landing page with cinematic hero imagery and restorative sections"
            ),
            new SiteTemplateDefinition(
                "rekolet-brutalism",
                "rekolet-brutalism",
                "/s/rekolet-brutalism",
                "Rekolet Brutalism",
                "Dark brutalist studio template with oversized typography, glass card hero, and recognition wall"
            ),
            new SiteTemplateDefinition(
                "nordhaven-architecture",
                "nordhaven-architecture",
                "/s/nordhaven-architecture",
                "Nordhaven Architecture",
                "Scandinavian architecture showcase with masked hero lettering and editorial sections"
            ),
            new SiteTemplateDefinition(
                "de-colorado-real-estate",
                "de-colorado-real-estate",
                "/s/de-colorado-real-estate",
                "De Colorado Real Estate",
                "Luxury real estate landing page with split-tone storytelling and editorial imagery"
            ),
            new SiteTemplateDefinition(
                "flato-minimalist-cabin",
                "flato-minimalist-cabin",
                "/s/flato-minimalist-cabin",
                "Flato Minimalist Cabin",
                "Minimal real estate and architecture template with overlapped hero typography and asymmetrical gallery layout"
            ),
            new SiteTemplateDefinition(
                "formark-architect-agency",
                "formark-architect-agency",
                "/s/formark-architect-agency",
                "Formark Architect Agency",
                "Brutalist architecture agency landing page with neon marquee and gallery storytelling"
            )
        );

        this.byTemplateId = templates.stream().collect(Collectors.toUnmodifiableMap(
            SiteTemplateDefinition::templateId,
            Function.identity()
        ));
    }

    public SiteTemplateDefinition requireByTemplateId(String templateId) {
        SiteTemplateDefinition template = byTemplateId.get(templateId);
        if (template == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "TEMPLATE_NOT_FOUND", "템플릿을 찾을 수 없습니다.");
        }
        return template;
    }

    public record SiteTemplateDefinition(
        String templateId,
        String slug,
        String templatePath,
        String name,
        String description
    ) {
    }
}
