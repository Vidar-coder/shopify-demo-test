import type { Product } from "@/lib/commerce/types";

/**
 * SiteConfig is the single contract between a business and the storefront.
 * To launch a new business: copy src/config/sites/wagwellness.ts, change the
 * values, register it in src/config/sites/index.ts and set NEXT_PUBLIC_SITE_ID.
 */

export type ThemeColors = {
  bg: string; // page background
  surface: string; // panels / cards
  surfaceAlt: string; // secondary panels
  ink: string; // main text
  muted: string; // secondary text
  line: string; // borders
  primary: string; // main buttons, dark blocks
  primaryInk: string; // text on primary
  accent: string; // playful highlight
  accentInk: string;
  pop: string; // second highlight
  popInk: string;
};

export type FontSpec = {
  family: string; // CSS family name
  /** Google Fonts css2 query, e.g. "Bricolage+Grotesque:opsz,wght@12..96,400..800" */
  google?: string;
  fallback: string;
};

export type NavLink = { label: string; href: string };

export type Cta = { label: string; href: string };

/* ---------- Homepage sections (rendered in the order listed) ---------- */

export type HeroSection = {
  type: "hero";
  heading: string;
  body: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  featuredHandle: string; // product shown in the hero
  stickers: string[]; // short facts that float around the product
  proof?: { rating: number; label: string };
};

export type TrustSection = {
  type: "trust";
  items: { icon: IconName; title: string; body: string }[];
};

export type ProductsSection = {
  type: "products";
  heading: string;
  body?: string;
  handles?: string[]; // omit to show everything
  cta?: Cta;
};

export type StepsSection = {
  type: "steps";
  heading: string;
  steps: { title: string; body: string }[];
};

export type StorySection = {
  type: "story";
  heading: string;
  body: string[];
  stat?: { value: string; label: string };
  points: { title: string; body: string }[];
};

export type BundleSection = {
  type: "bundle";
  heading: string;
  body: string;
  handles: string[]; // products customers can mix
  tiers: { quantity: number; discountPercent: number; label: string }[];
};

export type QuizSection = {
  type: "quiz";
  heading: string;
  body: string;
  questions: {
    id: string;
    question: string;
    options: { label: string; scores: Record<string, number> }[];
  }[];
  results: Record<string, { headline: string; reason: string }>;
};

export type ReviewItem = {
  id?: string;
  name: string;
  pet: string;
  rating: number;
  title: string;
  body: string;
  product?: string;
  /** Display string, e.g. "Sep 2025". */
  date?: string;
  verified?: boolean;
};

export type ReviewsSection = {
  type: "reviews";
  heading: string;
  /** Set true while reviews are placeholders — shows a visible "sample" tag. */
  sample?: boolean;
  reviews: ReviewItem[];
};

export type FaqSection = {
  type: "faq";
  heading: string;
  items: { q: string; a: string }[];
};

export type CtaSection = {
  type: "cta";
  heading: string;
  body: string;
  cta: Cta;
};

export type Section =
  | HeroSection
  | TrustSection
  | ProductsSection
  | StepsSection
  | StorySection
  | BundleSection
  | QuizSection
  | ReviewsSection
  | FaqSection
  | CtaSection;

export type IconName =
  | "truck"
  | "shield"
  | "leaf"
  | "flask"
  | "heart"
  | "chat"
  | "refund"
  | "paw"
  | "star"
  | "spark";

export type SiteConfig = {
  id: string;
  name: string;
  tagline: string;
  description: string; // SEO
  locale: string; // e.g. "en-PH"
  currency: string; // e.g. "PHP"
  /** Shows a banner saying products and reviews are placeholders. */
  demoMode?: boolean;

  theme: {
    colors: ThemeColors;
    fonts: { heading: FontSpec; body: FontSpec };
    radius: { sm: string; md: string; lg: string };
  };

  logo: { text: string; mark?: IconName };

  announcements: string[];
  nav: NavLink[];
  searchSuggestions?: string[];

  commerce: {
    freeShippingThreshold?: number; // in store currency
    /** Products used when no Shopify credentials are set. */
    demoCatalog: Product[];
    /** Shown in the cart as "You might also like". */
    upsellHandles?: string[];
  };

  productPage: {
    guarantees: { icon: IconName; label: string }[];
  };

  sections: Section[];

  /** Simple text pages at /pages/[slug] — policies, about, etc. */
  pages?: Record<string, { title: string; body: string[] }>;

  footer: {
    about: string;
    columns: { title: string; links: NavLink[] }[];
    contact: { email?: string; phone?: string };
    social: { label: string; href: string }[];
    payments: string[];
  };
};
