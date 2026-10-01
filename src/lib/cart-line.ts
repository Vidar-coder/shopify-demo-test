import type { Product, Variant } from "./commerce/types";
import type { CartLine } from "@/store/cart";

export function toCartLine(
  product: Product,
  variant: Variant,
  opts: { quantity?: number; subscribe?: boolean; bundleDiscount?: number } = {},
): Omit<CartLine, "key"> {
  const plan = opts.subscribe ? product.sellingPlan : undefined;
  const unitPrice = plan ? round(variant.price.amount * (1 - plan.discountPercent / 100)) : variant.price.amount;
  return {
    handle: product.handle,
    variantId: variant.id,
    title: product.title,
    variantTitle: product.variants.length > 1 || variant.title !== "Default Title" ? variant.title : undefined,
    unitPrice,
    compareAtPrice: plan ? variant.price.amount : variant.compareAtPrice?.amount,
    currencyCode: variant.price.currencyCode,
    quantity: opts.quantity ?? 1,
    sellingPlanId: plan?.id,
    sellingPlanName: plan?.name,
    bundleDiscount: opts.bundleDiscount,
    image: product.images[0],
    art: product.art,
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Background tint for a product panel, from its packaging colour. */
export function productTint(product: { art?: { body: string; bg?: string } }, fallback = "var(--c-surface-alt)") {
  if (product.art?.bg) return product.art.bg;
  return product.art ? `color-mix(in srgb, ${product.art.body} 22%, var(--c-surface))` : fallback;
}
