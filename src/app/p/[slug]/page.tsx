import { notFound, redirect } from "next/navigation";
import { getPublishedSiteBySlugFromBackend } from "@/lib/server/site-backend";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublishedSitePage({ params }: PageProps) {
  const { slug } = await params;
  const publish = await getPublishedSiteBySlugFromBackend(slug);

  if (!publish) {
    notFound();
  }

  redirect(publish.sitePath);
}
