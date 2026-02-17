/**
 * Complete TypeScript Type Definitions for i18n Dictionary
 *
 * Generated from: src/i18n/messages/en.json
 * Purpose: Eliminate 'any' types and provide full type safety
 */

// ==================== Navigation & Layout ====================

export interface NavigationDictionary {
  templates: string;
  generate: string;
  service: string;
  pricing: string;
  signup: string;
  signupFree: string;
}

export interface MobileNavDictionary {
  templates: string;
  generate: string;
  service: string;
  pricing: string;
  signup: string;
  signupFree: string;
}

export interface LanguageSelectorDictionary {
  title: string;
}

export interface FooterBrandDictionary {
  name: string;
  tagline: string;
  copyright: string;
}

export interface FooterSectionDictionary {
  title: string;
  generator?: string;
  template?: string;
  domain?: string;
  customerService?: string;
  qa?: string;
  serverStatus?: string;
  blog?: string;
  about?: string;
  contact?: string;
}

export interface FooterLegalDictionary {
  poweredBy: string;
  terms: string;
  privacy: string;
  cookie: string;
}

export interface FooterDictionary {
  brand: FooterBrandDictionary;
  platform: FooterSectionDictionary;
  support: FooterSectionDictionary;
  company: FooterSectionDictionary;
  legal: FooterLegalDictionary;
  headline: string;
}

// ==================== Home Page ====================

export interface HeroDictionary {
  title: string;
  subtitle: string;
  templatesLink: string;
  signupButton: string;
  signupFreeText: string;
}

export interface StatItemDictionary {
  stat: string;
  highlight: string;
  text: string;
  source: string;
}

export interface WhyMattersDictionary {
  title: string;
  description: string;
  ctaButton: string;
  stats: StatItemDictionary[];
}

export interface SolutionItemDictionary {
  icon?: string;
  title: string;
  desc: string;
}

export interface SolutionDictionary {
  title: string;
  items: SolutionItemDictionary[];
  cta_text: string;
  cta_button: string;
}

export interface FAQQuestionDictionary {
  question: string;
  answer: string;
}

export interface FAQDictionary {
  title: string;
  subtitle: string;
  questionLabel: string;
  questions: FAQQuestionDictionary[];
}

export interface FinalCTADictionary {
  title: string;
  subtitle: string;
  browseButton: string;
  startButton: string;
}

export interface LoadingScreenDictionary {
  brandName: string;
}

export interface HomePageDictionary {
  hero: HeroDictionary;
  whyMatters: WhyMattersDictionary;
  solution: SolutionDictionary;
  faq: FAQDictionary;
  finalCta: FinalCTADictionary;
  loadingScreen: LoadingScreenDictionary;
}

// ==================== Pricing Page ====================

export interface PricingToggleDictionary {
  monthly: string;
  yearly: string;
  save: string;
}

export interface PricingTierDictionary {
  name: string;
  price?: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  perMonth: string;
  description: string;
  features: string[];
  buttonText: string;
  badge?: string;
}

export interface PricingTiersDictionary {
  free: PricingTierDictionary;
  pro: PricingTierDictionary;
  business: PricingTierDictionary;
}

export interface ComparisonFeatureDictionary {
  name: string;
  free: string | boolean;
  pro: string | boolean;
  business: string | boolean;
}

export interface ComparisonCategoryDictionary {
  name: string;
  features: {
    [key: string]: ComparisonFeatureDictionary;
  };
}

export interface FeatureComparisonDictionary {
  title: string;
  subtitle: string;
  categories: {
    [key: string]: ComparisonCategoryDictionary;
  };
}

export interface PricingCTADictionary {
  title: string;
  startTrial: string;
  contactSales: string;
}

export interface PricingPageDictionary {
  title: string;
  subtitle: string;
  toggle: PricingToggleDictionary;
  tiers: PricingTiersDictionary;
  featureComparison: FeatureComparisonDictionary;
  cta: PricingCTADictionary;
}

// ==================== Templates Page ====================

export interface SortOptionsDictionary {
  latest: string;
  popular: string;
  nameAZ: string;
}

export interface CategoriesDictionary {
  all: string;
  business: string;
  portfolio: string;
  ecommerce: string;
  blog: string;
  landingPage: string;
}

export interface EmptyStateDictionary {
  title: string;
  subtitle: string;
}

export interface TemplatesPageDictionary {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  sortOptions: SortOptionsDictionary;
  categories: CategoriesDictionary;
  results: string;
  useTemplate: string;
  preview: string;
  emptyState: EmptyStateDictionary;
}

// ==================== Login Page ====================

export interface LoginPageDictionary {
  back: string;
  title: string;
  subtitle: string;
  google: string;
  apple: string;
  facebook: string;
  terms: string;
  termsLinkText: string;
  privacyLinkText: string;
  captcha: string;
}

export interface TermsModalDictionary {
  title: string;
  subtitle: string;
  agreement: string;
  termsLinkText: string;
  privacyLinkText: string;
  agreeButton: string;
  footerNote: string;
}

// ==================== Service Page ====================

export interface ServiceHeroDictionary {
  title: string;
  subtitle: string;
  startBuildingFree: string;
  browseTemplates: string;
  noCreditCard: string;
  templates: string;
  launchTime: string;
}

export interface ServiceHeroFeatureDictionary {
  title: string;
  description: string;
}

export interface ServiceFeatureItemDictionary {
  title: string;
  description: string;
  highlights: string[];
}

export interface ServiceFeaturesDictionary {
  title: string;
  subtitle: string;
  items: ServiceFeatureItemDictionary[];
}

export interface HowItWorksStepDictionary {
  number: string;
  title: string;
  description: string;
}

export interface HowItWorksDictionary {
  title: string;
  steps: HowItWorksStepDictionary[];
}

export interface ServiceFAQQuestionDictionary {
  question: string;
  answer: string;
}

export interface ServiceFAQDictionary {
  title: string;
  subtitle: string;
  items: ServiceFAQQuestionDictionary[];
}

export interface ServiceCTADictionary {
  title: string;
  subtitle: string;
  startBuilding: string;
  browseTemplates: string;
  sslSecured: string;
  noCreditCardRequired: string;
  users: string;
  awardWinning: string;
}

export interface ServicePageDictionary {
  hero: ServiceHeroDictionary;
  heroFeatures: ServiceHeroFeatureDictionary[];
  features: ServiceFeaturesDictionary;
  howItWorks: HowItWorksDictionary;
  faq: ServiceFAQDictionary;
  cta: ServiceCTADictionary;
}

// ==================== Q&A Page ====================

export interface QAQuestionDictionary {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export interface QAHeroDictionary {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}

export interface QAStillHaveQuestionsDictionary {
  title: string;
  subtitle: string;
  emailSupport: string;
  contactUs: string;
}

export interface QAPageDictionary {
  hero: QAHeroDictionary;
  filterLabel: string;
  allCategories: string;
  results: string;
  noResults: string;
  clearFilters: string;
  categories: Record<string, string>;
  questions: QAQuestionDictionary[];
  stillHaveQuestions: QAStillHaveQuestionsDictionary;
}

// ==================== Policy Pages ====================

export interface PolicyPageDictionary {
  title: string;
  lastUpdated: string;
  [key: string]: unknown;
}

export type PrivacyPageDictionary = PolicyPageDictionary;
export type TermsPageDictionary = PolicyPageDictionary;
export type CookiePageDictionary = PolicyPageDictionary;

// ==================== Other Pages ====================

export interface GeneratePageDictionary {
  title: string;
  subtitle: string;
  placeholder?: string;
  generateButton?: string;
  examplesTitle?: string;
  examples?: string[];
}

export interface StatusPageDictionary {
  title: string;
  subtitle: string;
}

export interface CustomerServicePageDictionary {
  title: string;
  subtitle: string;
}

export interface AboutMissionDictionary {
  heading: string;
  content: string;
}

export interface AboutVisionDictionary {
  heading: string;
  content: string;
}

export interface AboutValueItem {
  title: string;
  description: string;
}

export interface AboutValuesDictionary {
  heading: string;
  items: AboutValueItem[];
}

export interface AboutBrandStoryDictionary {
  heading: string;
  intro: string;
  description: string;
}

export interface AboutImpactStatDictionary {
  number: string;
  label: string;
}

export interface AboutImpactDictionary {
  heading: string;
  stats: AboutImpactStatDictionary[];
}

export interface AboutTeamDictionary {
  heading: string;
  subtitle: string;
}

export interface AboutCtaDictionary {
  heading: string;
  subtitle: string;
  button: string;
}

export interface AboutPageDictionary {
  title: string;
  subtitle: string;
  brandStory: AboutBrandStoryDictionary;
  mission: AboutMissionDictionary;
  vision: AboutVisionDictionary;
  values: AboutValuesDictionary;
  team: AboutTeamDictionary;
  impact: AboutImpactDictionary;
  cta: AboutCtaDictionary;
}

export interface ContactPageFAQItemDictionary {
  question: string;
  answer: string;
}

export interface ContactPageInquiryOptionsDictionary {
  general: string;
  support: string;
  partnership: string;
  feedback: string;
  other: string;
}

export interface ContactPageDictionary {
  title: string;
  subtitle: string;
  description: string;
  emailLabel: string;
  emailAddress: string;
  emailHint: string;
  inquiryLabel: string;
  inquiryOptions: ContactPageInquiryOptionsDictionary;
  messageLabel: string;
  messagePlaceholder: string;
  sendButton: string;
  successTitle: string;
  successMessage: string;
  sendAnother: string;
  faqTitle: string;
  faqItems: ContactPageFAQItemDictionary[];
}

// ==================== Blog ====================

export interface BlogPostDictionary {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export interface BlogPageDictionary {
  hero: {
    title: string;
    subtitle: string;
  };
  categories: Record<string, string> & { all: string };
  posts: BlogPostDictionary[];
  filters: {
    searchPlaceholder: string;
    noResults: string;
  };
  readMore: string;
  backToArticles: string;
  relatedPosts: string;
  shareArticle: string;
  author: string;
  published: string;
}

// ==================== Root Dictionary ====================

export interface Dictionary {
  navigation: NavigationDictionary;
  mobileNav: MobileNavDictionary;
  languageSelector: LanguageSelectorDictionary;
  footer: FooterDictionary;
  homePage: HomePageDictionary;
  pricingPage: PricingPageDictionary;
  templatesPage: TemplatesPageDictionary;
  loginPage: LoginPageDictionary;
  termsModal: TermsModalDictionary;
  servicePage: ServicePageDictionary;
  qaPage: QAPageDictionary;
  privacyPage: PrivacyPageDictionary;
  termsPage: TermsPageDictionary;
  cookiePage: CookiePageDictionary;
  generatePage: GeneratePageDictionary;
  statusPage: StatusPageDictionary;
  customerServicePage: CustomerServicePageDictionary;
  aboutPage: AboutPageDictionary;
  contactPage: ContactPageDictionary;
  blogPage: BlogPageDictionary;
}
