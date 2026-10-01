import "server-only";
import { getSite } from "@/config/site";
import type { CartLineInput, Product } from "./types";
import { shopifyCreateCheckout, shopifyEnabled, shopifyGetProduct, shopifyGetProducts } from "./shopify";

/**
 * One entry point for product data. Uses Shopify when credentials exist,
 * otherwise the demo catalog from the active site config.
 */

export const commerceMode: "shopify" | "demo" = shopifyEnabled ? "shopify" : "demo";

function demo(): Product[] {
  return getSite().commerce.demoCatalog;
}

export async function getProducts(): Promise<Product[]> {
  return shopifyEnabled ? shopifyGetProducts() : demo();
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return shopifyEnabled ? shopifyGetProduct(handle) : demo().find((p) => p.handle === handle);
}

export async function getProductsByHandles(handles: string[]): Promise<Product[]> {
  const all = await getProducts();
  return handles.map((h) => all.find((p) => p.handle === h)).filter((p): p is Product => Boolean(p));
}

export async function searchProducts(q: string): Promise<Product[]> {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  if (shopifyEnabled) return (await shopifyGetProducts(term)).slice(0, 8);
  return demo()
    .filter((p) =>
      [p.title, p.subtitle, p.description, p.productType, ...p.tags].join(" ").toLowerCase().includes(term),
    )
    .slice(0, 8);
}

export async function createCheckout(lines: CartLineInput[]): Promise<{ url?: string; demo?: boolean }> {
  if (!shopifyEnabled) return { demo: true };
  return { url: await shopifyCreateCheckout(lines) };
}
