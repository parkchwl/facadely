'use client';
import type { TemplatesPageDictionary } from '@/types/dictionary';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Grid3x3, Grid2x2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { i18n } from '@/i18n/config';
import OptimizedImage, { ImageType } from '@/app/components/OptimizedImage';

type CategoryKey = 'business' | 'portfolio' | 'ecommerce' | 'blog' | 'landingPage';

export type TemplateListItem = {
  id: string;
  name: string;
  categoryKey: CategoryKey;
  path: string;
  description: string;
  image: string;
};

export default function TemplatesPageClient({
  dictionary,
  templates,
}: {
  dictionary: TemplatesPageDictionary;
  templates: TemplateListItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<'all' | CategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(dictionary.sortOptions.latest);
  const [gridCols, setGridCols] = useState(3);
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);

  const categories = useMemo(() => Object.entries(dictionary.categories), [dictionary]);
  const sortOptions = useMemo(() => Object.values(dictionary.sortOptions), [dictionary]);

  const filteredTemplates = useMemo(() => {
    const searchedTemplates = templates.filter((template) => {
      const matchesCategory =
        selectedCategoryKey === 'all' || template.categoryKey === selectedCategoryKey;
      const searchText = `${template.name} ${template.description}`.toLowerCase();
      const matchesSearch = searchText.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === dictionary.sortOptions.nameAZ) {
      return [...searchedTemplates].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === dictionary.sortOptions.popular) {
      // Popularity is not tracked yet; keep deterministic fallback order.
      return [...searchedTemplates].sort((a, b) => a.name.localeCompare(b.name));
    }

    return searchedTemplates;
  }, [selectedCategoryKey, searchQuery, sortBy, dictionary.sortOptions.nameAZ, dictionary.sortOptions.popular, templates]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleUseTemplate = async (templateId: string) => {
    if (creatingTemplateId) return;

    setCreatingTemplateId(templateId);

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });
      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        const pathSegments = (pathname ?? '').split('/').filter(Boolean);
        const localePrefix =
          pathSegments.length > 0 && i18n.locales.includes(pathSegments[0] as (typeof i18n.locales)[number])
            ? `/${pathSegments[0]}`
            : '';
        const nextTarget = pathname || `${localePrefix}/templates`;
        window.location.href = `${localePrefix}/login?next=${encodeURIComponent(nextTarget)}`;
        return;
      }

      if (!response.ok || !payload?.site?.sitePath) {
        throw new Error(payload?.error ?? 'Failed to create site from template');
      }

      router.push(`/editor?sitePath=${encodeURIComponent(payload.site.sitePath)}`);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create site from template';
      window.alert(message);
    } finally {
      setCreatingTemplateId(null);
    }
  };

  return (
    <div className="min-h-app-vh relative">
      <div className="max-w-7xl mx-auto bg-white min-h-app-vh px-4 sm:px-6 lg:px-12 xl:px-16 pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-20 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-14 lg:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
            {dictionary.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl leading-relaxed"
             dangerouslySetInnerHTML={{ __html: dictionary.subtitle }}
          />
        </motion.div>

        <div className="mb-8 sm:mb-10 lg:mb-12 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-md">
              <label htmlFor="template-search" className="sr-only">
                {dictionary.searchPlaceholder}
              </label>
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <input
                id="template-search"
                type="search"
                placeholder={dictionary.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                aria-label={dictionary.searchPlaceholder}
              />
            </div>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <label htmlFor="sort-templates" className="sr-only">
                  {dictionary.searchPlaceholder}
                </label>
                <select
                  id="sort-templates"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors cursor-pointer bg-white"
                  aria-label="Sort templates by"
                >
                  {sortOptions.map((option, idx) => (
                    <option key={idx} value={String(option)}>
                      {String(option)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" aria-hidden="true" />
              </div>

              <div className="flex gap-1 sm:gap-2 border-2 border-gray-200 rounded-lg p-0.5 sm:p-1" role="group" aria-label="Grid view options">
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-1.5 sm:p-2 rounded transition-colors ${
                    gridCols === 2 ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="2 column grid view"
                  aria-pressed={gridCols === 2}
                >
                  <Grid2x2 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 sm:p-2 rounded transition-colors ${
                    gridCols === 3 ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="3 column grid view"
                  aria-pressed={gridCols === 3}
                >
                  <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-3 flex-1">
              {categories.map(([categoryKey, categoryLabel], idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategoryKey(categoryKey as 'all' | CategoryKey)}
                  className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    selectedCategoryKey === categoryKey
                      ? 'bg-black text-white shadow-lg shadow-black/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {String(categoryLabel)}
                  {categoryKey !== 'all' && (
                    <span className="ml-1 sm:ml-2 text-xs opacity-70">
                      ({templates.filter((template) => template.categoryKey === categoryKey).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm sm:text-base text-gray-600 font-medium">
            {dictionary.results.replace('{count}', filteredTemplates.length.toString())}
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={`grid grid-cols-1 ${gridCols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6 lg:gap-8`}
        >
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              variants={item}
              className="group"
            >
              <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="aspect-[3/4] bg-black relative overflow-hidden">
                  <OptimizedImage
                    src={template.image}
                    alt={`${template.name} preview`}
                    type={ImageType.TEMPLATE_THUMBNAIL}
                    fill
                    sizes={gridCols === 2 ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                    <div className="inline-flex items-center rounded-full bg-white/14 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                      {dictionary.preview}
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 px-4">
                      <button
                        type="button"
                        onClick={() => void handleUseTemplate(template.id)}
                        disabled={creatingTemplateId !== null}
                        className="bg-white text-black px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors transform scale-90 group-hover:scale-100 duration-300 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {creatingTemplateId === template.id ? 'Creating site...' : dictionary.useTemplate}
                      </button>

                      <Link
                        href={template.path}
                        className="text-sm font-medium text-white/90 transition hover:text-white"
                      >
                        {dictionary.preview}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {template.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    {dictionary.categories[template.categoryKey] ?? template.categoryKey}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{dictionary.emptyState.title}</h3>
            <p className="text-sm sm:text-base text-gray-600">{dictionary.emptyState.subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}
