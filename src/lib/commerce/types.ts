/**
 * Provider-agnostic commerce types. Every data source (Shopify, demo catalog,
 * or anything you add later) maps into these shapes, so UI components never
 * care where products came from.
 */

export type Money = { amount: number; currencyCode: string };

export type ProductImage = { url: string; alt: string; width?: number; height?: number };

/** Used to draw packaging when a product has no photos yet (demo / early stage). */
export type ProductArt = {
  body: string; // container colour
  lid: string; // lid / accent colour
  label: string; // label panel colour
  shape?: "tub" | "pouch" | "bottle";
  bg?: string; // optional panel colour behind the product
};

export type Variant = {
  id: string;
  title: string;
  price: Money;
  compareAtPrice?: Money;
  available: boolean;
};

export type SellingPlan = {
  id: string;
  name: string;
  discountPercent: number;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  description: string;
  descriptionHtml?: string;
  images: ProductImage[];
  art?: ProductArt;
  variants: Variant[];
  priceRange: { min: Money; max: Money };
  compareAtPrice?: Money;
  tags: string[];
  productType?: string;
  available: boolean;
  sellingPlan?: SellingPlan;
  rating?: number;
  reviewCount?: number;
  highlights?: string[];
  howToUse?: string;
  ingredients?: string;
};

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string;
  attributes?: { key: string; value: string }[];
};
