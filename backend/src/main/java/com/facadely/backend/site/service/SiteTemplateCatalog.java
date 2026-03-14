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
