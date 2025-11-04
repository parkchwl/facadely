/**
 * ContactPageContent Component
 *
 * Shared implementation for Contact page across all languages.
 * Now uses ContactPageClient for the new design.
 */

import ContactPageClient from '@/app/components/shared/ContactPageClient';
import type { ContactPageDictionary } from '@/types/dictionary';

interface ContactPageContentProps {
  dictionary: ContactPageDictionary;
}

export default function ContactPageContent({ dictionary }: ContactPageContentProps) {
  return <ContactPageClient dictionary={dictionary} />;
}
