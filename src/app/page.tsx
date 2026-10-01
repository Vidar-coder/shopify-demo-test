import { getSite } from "@/config/site";
import { getProducts } from "@/lib/commerce";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

export const revalidate = 60;

export default async function HomePage() {
  const site = getSite();
  const products = await getProducts();
  return <SectionRenderer sections={site.sections} products={products} brand={site.name} currency={site.currency} />;
}
