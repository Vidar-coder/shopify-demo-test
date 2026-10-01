import type { Metadata } from "next";
import { getSite } from "@/config/site";
import { getProducts } from "@/lib/commerce";
import { ShopGrid } from "./ShopGrid";

export const metadata: Metadata = { title: "Shop all" };
export const revalidate = 60;

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const site = getSite();
  const { type } = await searchParams;
  const products = await getProducts();
  const types = Array.from(new Set(products.map((p) => p.productType).filter(Boolean))) as string[];

  return (
    <div className="container-x py-8 md:py-16">
      <h1 className="display text-[clamp(2.5rem,10vw,4.5rem)] leading-none md:text-7xl">Shop all</h1>
      <p className="mt-3 max-w-xl text-base text-muted sm:text-lg">{site.tagline}. Mix any two or more and save with a bundle.</p>
      <ShopGrid products={products} types={types} initialType={type} brand={site.name} />
    </div>
  );
}
