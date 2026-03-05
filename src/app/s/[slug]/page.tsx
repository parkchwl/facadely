import { notFound } from "next/navigation";
import NexusTemplatePage from "@/app/5/TemplateView";
import VelocityTemplatePage from "@/app/6/TemplateView";
import OneProTemplatePage from "@/app/7/TemplateView";

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
