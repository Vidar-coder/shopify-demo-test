import "server-only";
import type { CartLineInput, Money, Product } from "./types";

/**
 * Minimal Shopify Storefront API client.
 * Docs: https://shopify.dev/docs/api/storefront
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || "2025-07";

export const shopifyEnabled = Boolean(domain && token);

async function storefront<T>(query: string, variables: Record<string, unknown> = {}, revalidate = 60): Promise<T> {
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token!,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate, tags: ["shopify"] },
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(`Shopify Storefront API error: ${JSON.stringify(json.errors ?? res.statusText)}`);
  }
  return json.data as T;
}

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    tags
    availableForSale
    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    compareAtPriceRange { maxVariantPrice { amount currencyCode } }
    images(first: 8) { nodes { url altText width height } }
    variants(first: 25) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
    sellingPlanGroups(first: 1) {
      nodes {
        sellingPlans(first: 1) {
          nodes {
            id
            name
            priceAdjustments {
              adjustmentValue {
                ... on SellingPlanPercentagePriceAdjustment { adjustmentPercentage }
              }
            }
          }
        }
      }
    }
    subtitle: metafield(namespace: "custom", key: "subtitle") { value }
    highlights: metafield(namespace: "custom", key: "highlights") { value }
    howToUse: metafield(namespace: "custom", key: "how_to_use") { value }
    ingredients: metafield(namespace: "custom", key: "ingredients") { value }
    rating: metafield(namespace: "reviews", key: "rating") { value }
    ratingCount: metafield(namespace: "reviews", key: "rating_count") { value }
  }
`;

type ShopifyMoney = { amount: string; currencyCode: string };
type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney };
  compareAtPriceRange: { maxVariantPrice: ShopifyMoney };
  images: { nodes: { url: string; altText: string | null; width: number; height: number }[] };
  variants: {
    nodes: { id: string; title: string; availableForSale: boolean; price: ShopifyMoney; compareAtPrice: ShopifyMoney | null }[];
  };
  sellingPlanGroups: {
    nodes: {
      sellingPlans: {
        nodes: { id: string; name: string; priceAdjustments: { adjustmentValue: { adjustmentPercentage?: number } }[] }[];
      };
    }[];
  };
  subtitle: { value: string } | null;
  highlights: { value: string } | null;
  howToUse: { value: string } | null;
  ingredients: { value: string } | null;
  rating: { value: string } | null;
  ratingCount: { value: string } | null;
};

const money = (m: ShopifyMoney): Money => ({ amount: Number(m.amount), currencyCode: m.currencyCode });

function parseList(value?: string): string[] | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {}
  return value.split("\n").map((s) => s.trim()).filter(Boolean);
}

function parseRating(value?: string): number | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    return Number(parsed.value ?? parsed);
  } catch {
    return Number(value) || undefined;
  }
}

function mapProduct(p: ShopifyProduct): Product {
  const plan = p.sellingPlanGroups.nodes[0]?.sellingPlans.nodes[0];
  const compareMax = Number(p.compareAtPriceRange.maxVariantPrice.amount);
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    subtitle: p.subtitle?.value,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    productType: p.productType || undefined,
    tags: p.tags,
    available: p.availableForSale,
    images: p.images.nodes.map((i) => ({ url: i.url, alt: i.altText || p.title, width: i.width, height: i.height })),
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      available: v.availableForSale,
      price: money(v.price),
      compareAtPrice: v.compareAtPrice ? money(v.compareAtPrice) : undefined,
    })),
    priceRange: { min: money(p.priceRange.minVariantPrice), max: money(p.priceRange.maxVariantPrice) },
    compareAtPrice: compareMax > 0 ? money(p.compareAtPriceRange.maxVariantPrice) : undefined,
    sellingPlan: plan
      ? { id: plan.id, name: plan.name, discountPercent: plan.priceAdjustments[0]?.adjustmentValue.adjustmentPercentage ?? 0 }
      : undefined,
    highlights: parseList(p.highlights?.value),
    howToUse: p.howToUse?.value,
    ingredients: p.ingredients?.value,
    rating: parseRating(p.rating?.value),
    reviewCount: p.ratingCount ? Number(p.ratingCount.value) : undefined,
  };
}

export async function shopifyGetProducts(query?: string): Promise<Product[]> {
  const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(
    `${PRODUCT_FIELDS}
     query Products($query: String) {
       products(first: 100, query: $query, sortKey: BEST_SELLING) { nodes { ...ProductFields } }
     }`,
    { query: query || null },
  );
  return data.products.nodes.map(mapProduct);
}

export async function shopifyGetProduct(handle: string): Promise<Product | undefined> {
  const data = await storefront<{ product: ShopifyProduct | null }>(
    `${PRODUCT_FIELDS}
     query Product($handle: String!) { product(handle: $handle) { ...ProductFields } }`,
    { handle },
  );
  return data.product ? mapProduct(data.product) : undefined;
}

/** Creates a Shopify cart from local cart lines and returns the hosted checkout URL. */
export async function shopifyCreateCheckout(lines: CartLineInput[]): Promise<string> {
  const data = await storefront<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(
    `mutation CartCreate($lines: [CartLineInput!]!) {
       cartCreate(input: { lines: $lines }) {
         cart { checkoutUrl }
         userErrors { message }
       }
     }`,
    { lines },
    0,
  );
  const { cart, userErrors } = data.cartCreate;
  if (!cart) throw new Error(userErrors.map((e) => e.message).join(", ") || "Could not create checkout");
  return cart.checkoutUrl;
}
