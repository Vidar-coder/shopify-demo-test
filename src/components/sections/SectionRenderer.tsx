import type { Section } from "@/config/types";
import type { Product } from "@/lib/commerce/types";
import { Hero } from "./Hero";
import { CtaBanner, Products, Steps, Trust } from "./Simple";
import { Story } from "./Story";
import { BundleBuilder } from "./BundleBuilder";
import { Quiz } from "./Quiz";
import { Reviews } from "./Reviews";
import { Faq } from "./Faq";

/**
 * Renders the homepage from the site config's `sections` array.
 * Add a section type: define it in config/types.ts, build the component,
 * and add one case below.
 */
export function SectionRenderer({ sections, products, brand, currency }: { sections: Section[]; products: Product[]; brand: string; currency: string }) {
  const byHandle = (handles?: string[]) =>
    handles ? handles.map((h) => products.find((p) => p.handle === h)).filter((p): p is Product => Boolean(p)) : products;

  return (
    <>
      {sections.map((s, i) => {
        switch (s.type) {
          case "hero":
            return <Hero key={i} section={s} product={products.find((p) => p.handle === s.featuredHandle) ?? products[0]} brand={brand} />;
          case "trust":
            return <Trust key={i} section={s} />;
          case "products":
            return <Products key={i} section={s} products={byHandle(s.handles)} brand={brand} />;
          case "story":
            return <Story key={i} section={s} />;
          case "steps":
            return <Steps key={i} section={s} />;
          case "bundle":
            return <BundleBuilder key={i} section={s} products={byHandle(s.handles)} brand={brand} currency={currency} />;
          case "quiz":
            return <Quiz key={i} section={s} products={products} brand={brand} />;
          case "reviews":
            return <Reviews key={i} section={s} />;
          case "faq":
            return <Faq key={i} section={s} />;
          case "cta":
            return <CtaBanner key={i} section={s} />;
        }
      })}
    </>
  );
}
