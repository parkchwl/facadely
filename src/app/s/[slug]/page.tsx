import { notFound } from "next/navigation";
import NexusTemplatePage from "@/app/nexus-ai-enterprise/TemplateView";
import VelocityTemplatePage from "@/app/velocity-saas-landing/TemplateView";
import OneProTemplatePage from "@/app/onepro-dashboard-white/TemplateView";
import IonTemplatePage from "@/app/ion-modern-product/TemplateView";
import NocturneTemplatePage from "@/app/nocturne-typography-agency/TemplateView";
import VerdantTemplatePage from "@/app/verdant-ecommerce-editorial/TemplateView";
import SejourTemplatePage from "@/app/sejour-luxury-wellness-resort/TemplateView";
import VaultTemplatePage from "@/app/vault-fintech-dashboard/TemplateView";
import SerenicaTemplatePage from "@/app/serenica-wellness-retreat/TemplateView";
import RekoletTemplatePage from "@/app/rekolet-brutalism/TemplateView";
import NordhavenTemplatePage from "@/app/nordhaven-architecture/TemplateView";
import DeColoradoTemplatePage from "@/app/de-colorado-real-estate/TemplateView";
import FlatoTemplatePage from "@/app/flato-minimalist-cabin/TemplateView";
import FormarkTemplatePage from "@/app/formark-architect-agency/TemplateView";
import { resolveTemplateSlugFromSiteSlug } from "@/lib/user-site-store";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const TEMPLATE_COMPONENTS: Record<string, React.ComponentType> = {
  "nexus-ai-enterprise": NexusTemplatePage,
  "velocity-saas-landing": VelocityTemplatePage,
  "onepro-dashboard-white": OneProTemplatePage,
  "ion-modern-product": IonTemplatePage,
  "nocturne-typography-agency": NocturneTemplatePage,
  "verdant-ecommerce-editorial": VerdantTemplatePage,
  "sejour-luxury-wellness-resort": SejourTemplatePage,
  "vault-fintech-dashboard": VaultTemplatePage,
  "serenica-wellness-retreat": SerenicaTemplatePage,
  "rekolet-brutalism": RekoletTemplatePage,
  "nordhaven-architecture": NordhavenTemplatePage,
  "de-colorado-real-estate": DeColoradoTemplatePage,
  "flato-minimalist-cabin": FlatoTemplatePage,
  "formark-architect-agency": FormarkTemplatePage,
};

export default async function CanonicalTemplatePage({ params }: PageProps) {
  const { slug } = await params;
  const resolvedTemplateSlug = resolveTemplateSlugFromSiteSlug(slug) ?? slug;
  const TemplateComponent = TEMPLATE_COMPONENTS[resolvedTemplateSlug];

  if (!TemplateComponent) {
    notFound();
  }

  return <TemplateComponent />;
}
