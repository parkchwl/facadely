import { notFound } from "next/navigation";
import NexusTemplatePage from "@/app/nexus-ai-enterprise/TemplateView";
import VelocityTemplatePage from "@/app/velocity-saas-landing/TemplateView";
import OneProTemplatePage from "@/app/onepro-dashboard-white/TemplateView";
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
