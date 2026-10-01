import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronLeft } from "lucide-react";
import { getSite } from "@/config/site";
import { getProduct, getProducts } from "@/lib/commerce";
import { discountPercent, formatMoney } from "@/lib/format";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductMobileBuyBox } from "@/components/product/ProductMobileBuyBox";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";

export const revalidate = 60;

type Props = { params: Promise<{ handle: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).handle);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: { images: product.images[0] ? [product.images[0].url] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const site = getSite();
  const product = await getProduct((await params).handle);
  if (!product) notFound();

  const all = await getProducts();
  const related = all.filter((p) => p.handle !== product.handle).slice(0, 3);
  const v = product.variants[0];
  const off = discountPercent(v.price.amount, v.compareAtPrice?.amount);

  const details = [
    product.descriptionHtml
      ? { title: "Details", content: <div className="prose prose-sm sm:prose-base" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} /> }
      : { title: "Details", content: <p>{product.description}</p> },
    product.howToUse && { title: "How to use", content: <p>{product.howToUse}</p> },
    product.ingredients && { title: "Ingredients", content: <p>{product.ingredients}</p> },
  ].filter(Boolean) as { title: string; content: React.ReactNode }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: v.price.amount,
      priceCurrency: v.price.currencyCode,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.rating && !site.demoMode
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount } }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x pb-28 pt-3 md:pb-10 md:pt-10">
        <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-3">
          <Link
            href="/shop"
            className="inline-flex min-h-10 items-center gap-0.5 text-sm font-semibold text-muted transition-colors hover:text-ink md:hidden"
          >
            <ChevronLeft size={18} aria-hidden />
            Shop
          </Link>
          <ol className="hidden flex-wrap items-center gap-x-1.5 text-sm text-muted md:flex">
            <li>
              <Link href="/" className="hover:text-ink hover:underline">Home</Link>
              <span aria-hidden className="mx-1">/</span>
            </li>
            <li>
              <Link href="/shop" className="hover:text-ink hover:underline">Shop</Link>
              <span aria-hidden className="mx-1">/</span>
            </li>
            <li aria-current="page" className="font-semibold text-ink">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="mt-3 grid gap-5 md:mt-6 md:grid-cols-2 md:gap-14">
          <div className="min-w-0 md:sticky md:top-24 md:self-start">
            <ProductGallery product={product} brand={site.name} />
          </div>

          <div className="flex min-w-0 flex-col gap-4 md:gap-5">
            <header className="order-1">
              {product.productType && (
                <Link
                  href={`/shop?type=${encodeURIComponent(product.productType)}`}
                  className="inline-block rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold hover:bg-accent hover:text-accent-ink"
                >
                  {product.productType}
                </Link>
              )}
              <h1 className="display mt-2 text-[clamp(1.875rem,8vw,2.75rem)] leading-[0.98] md:mt-3 md:text-7xl md:leading-[0.95]">
                {product.title}
              </h1>
              {product.subtitle && <p className="mt-1.5 text-sm text-muted sm:text-xl">{product.subtitle}</p>}

              {product.rating && (
                <a href="#details" className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md text-sm active:bg-surface-alt md:min-h-11">
                  <Stars rating={product.rating} size={16} className="md:hidden" />
                  <Stars rating={product.rating} size={17} className="hidden md:inline-flex" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted">({product.reviewCount} reviews)</span>
                </a>
              )}

              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 md:mt-4">
                <span className="text-2xl font-extrabold tabular-nums md:text-3xl" style={{ fontFamily: "var(--f-heading)" }}>
                  {formatMoney(v.price)}
                </span>
                {off > 0 && v.compareAtPrice && (
                  <>
                    <span className="text-sm text-muted line-through md:text-lg">{formatMoney(v.compareAtPrice)}</span>
                    <span className="rounded-full bg-pop px-2.5 py-0.5 text-[11px] font-bold text-pop-ink md:text-sm">Save {off}%</span>
                  </>
                )}
              </p>
            </header>

            <div className="order-2 md:order-4">
              <ProductMobileBuyBox>
                <ProductPurchase product={product} stickyBar />
              </ProductMobileBuyBox>
            </div>

            <p className="order-3 text-[0.9375rem] leading-relaxed text-muted md:order-2 md:max-w-prose md:text-lg md:text-ink">
              {product.description}
            </p>

            {product.highlights && (
              <ul className="order-4 space-y-2 md:order-3 md:space-y-2.5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 rounded-md border border-line/80 bg-surface/50 px-3 py-2.5 text-sm md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-base">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
                      <Check size={14} strokeWidth={3} aria-hidden />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <ul className="order-5 no-scrollbar flex gap-2 overflow-x-auto pb-1 md:order-4 md:grid md:overflow-visible md:rounded-md md:bg-surface-alt md:p-4 md:pb-1 sm:grid-cols-3 md:gap-3">
              {site.productPage.guarantees.map((g) => (
                <li
                  key={g.label}
                  className="flex min-w-[9.5rem] shrink-0 items-center gap-2 rounded-md border border-line bg-surface-alt px-3 py-2.5 text-xs font-semibold md:min-w-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-sm"
                >
                  <Icon name={g.icon} size={17} className="shrink-0 md:size-[18px]" />
                  {g.label}
                </li>
              ))}
            </ul>

            <div id="details" className="order-6 scroll-mt-24 md:order-6">
              <Accordion items={details} />
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts products={related} brand={site.name} />
    </>
  );
}
