import { notFound } from "next/navigation";
import NexusTemplatePage from "@/app/nexus-ai-enterprise/TemplateView";
import VelocityTemplatePage from "@/app/velocity-saas-landing/TemplateView";
import OneProTemplatePage from "@/app/onepro-dashboard-white/TemplateView";

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
  const TemplateComponent = TEMPLATE_COMPONENTS[slug];

  if (!TemplateComponent) {
    notFound();
  }

  return <TemplateComponent />;
}
