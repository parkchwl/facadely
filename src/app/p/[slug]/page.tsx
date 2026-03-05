import { notFound, redirect } from "next/navigation";
import { getPublishRecordBySlug } from "@/lib/publish-store";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublishedSitePage({ params }: PageProps) {
  const { slug } = await params;
  const publish = await getPublishRecordBySlug(slug);

  if (!publish) {
    notFound();
  }

  redirect(publish.sitePath);
}
