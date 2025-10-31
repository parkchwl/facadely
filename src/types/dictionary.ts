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
  watchVideo: string;
}

export interface ServiceFeatureItemDictionary {
  title: string;
  description: string;
}

export interface ServiceFeaturesDictionary {
  title: string;
  subtitle: string;
  items: ServiceFeatureItemDictionary[];
}

export interface HowItWorksStepDictionary {
  step: string;
  title: string;
  description: string;
}

export interface HowItWorksDictionary {
  title: string;
  subtitle: string;
  steps: HowItWorksStepDictionary[];
}

export interface ServiceFAQQuestionDictionary {
  question: string;
  answer: string;
}

export interface ServiceFAQDictionary {
  title: string;
  subtitle: string;
  questions: ServiceFAQQuestionDictionary[];
}

export interface ServiceCTADictionary {
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
}

export interface ServicePageDictionary {
  hero: ServiceHeroDictionary;
  features: ServiceFeaturesDictionary;
  howItWorks: HowItWorksDictionary;
  faq: ServiceFAQDictionary;
  cta: ServiceCTADictionary;
}

// ==================== Q&A Page ====================

export interface QASearchDictionary {
  placeholder: string;
  button: string;
}

export interface QACategoryDictionary {
  title: string;
  icon: string;
}

export interface QAItemDictionary {
  question: string;
  answer: string;
}

export interface QASectionDictionary {
  title: string;
  items: QAItemDictionary[];
}

export interface QAPageDictionary {
  title: string;
  subtitle: string;
  search: QASearchDictionary;
  categories: {
    [key: string]: QACategoryDictionary;
  };
  sections: {
    [key: string]: QASectionDictionary;
  };
}

// ==================== Policy Pages ====================

export interface PolicySectionDictionary {
  title: string;
  content: string;
  subsections?: PolicySubsectionDictionary[];
  items?: string[];
}

export interface PolicySubsectionDictionary {
  title: string;
  content: string;
  items?: string[];
}

export interface PrivacyPageDictionary {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: PolicySectionDictionary[];
}

export interface TermsPageDictionary {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: PolicySectionDictionary[];
}

export interface CookiePageDictionary {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: PolicySectionDictionary[];
}

// ==================== Other Pages ====================

export interface GeneratePageDictionary {
  title: string;
  subtitle: string;
  placeholder: string;
  generateButton: string;
  examplesTitle: string;
  examples: string[];
}

export interface StatusPageDictionary {
  title: string;
  subtitle: string;
  operational: string;
  degraded: string;
  down: string;
  services: {
    [key: string]: {
      name: string;
      status: string;
    };
  };
}

export interface CustomerServicePageDictionary {
  title: string;
  subtitle: string;
  channels: {
    email: {
      title: string;
      description: string;
      link: string;
    };
    chat: {
      title: string;
      description: string;
      link: string;
    };
    help: {
      title: string;
      description: string;
      link: string;
    };
  };
  contactForm: {
    title: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    submit: string;
  };
}

export interface AboutMissionDictionary {
  heading: string;
  content: string;
}

export interface AboutVisionDictionary {
  heading: string;
  content: string;
}

export interface AboutValuesDictionary {
  heading: string;
  items: string[];
}

export interface AboutPageDictionary {
  title: string;
  subtitle: string;
  mission: AboutMissionDictionary;
  vision: AboutVisionDictionary;
  values: AboutValuesDictionary;
}

export interface ContactPageDictionary {
  title: string;
  subtitle: string;
  form: {
    name: string;
    email: string;
    subject: string;
    message: string;
    submit?: string;
    send?: string;
  };
  info?: {
    email: string;
    phone: string;
    address: string;
  };
}

// ==================== Blog ====================

export interface BlogPostDictionary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export interface BlogPageDictionary {
  title: string;
  subtitle: string;
  categories: {
    all: string;
    tutorials: string;
    news: string;
    guides: string;
    updates: string;
  };
  searchPlaceholder: string;
  readMore: string;
  backToArticles: string;
  relatedArticles: string;
  shareArticle: string;
  posts: BlogPostDictionary[];
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
