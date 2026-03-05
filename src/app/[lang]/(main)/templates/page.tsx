import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import TemplatesPageClient from '@/app/components/shared/TemplatesPageClient';
import { listCanonicalTemplateEntries } from '@/lib/template-registry';

type TemplateItem = {
  id: string;
  name: string;
  categoryKey: 'business' | 'portfolio' | 'ecommerce' | 'blog' | 'landingPage';
  path: string;
  description: string;
};

function inferCategoryKey(input: string): TemplateItem['categoryKey'] {
  const lower = input.toLowerCase();
  if (lower.includes('portfolio') || lower.includes('photography') || lower.includes('designer')) {
    return 'portfolio';
  }
  if (lower.includes('ecommerce') || lower.includes('store') || lower.includes('shop')) {
    return 'ecommerce';
  }
  if (lower.includes('blog')) {
    return 'blog';
  }
  if (lower.includes('landing')) {
    return 'landingPage';
  }
  return 'business';
}

export default async function TemplatesPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  const templates: TemplateItem[] = listCanonicalTemplateEntries()
    .map((entry) => ({
      id: entry.templateId,
      name: entry.name,
      categoryKey: inferCategoryKey(`${entry.templateId} ${entry.name} ${entry.description}`),
      path: entry.canonicalPath,
      description: entry.description,
    }));

  return <TemplatesPageClient dictionary={dictionary.templatesPage} templates={templates} />;
}
