import Link from "next/link";
import type { CtaSection, ProductsSection, StepsSection, TrustSection } from "@/config/types";
import type { Product } from "@/lib/commerce/types";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";

/* Server-rendered, non-interactive sections. */

export function Trust({ section }: { section: TrustSection }) {
  return (
    <section aria-label="Why shop with us" className="border-y border-line bg-surface">
      <ul className="mx-auto grid max-w-[1240px] grid-cols-2 gap-px bg-line lg:grid-cols-4">
        {section.items.map((item) => (
          <li key={item.title} className="flex gap-3 bg-surface px-4 py-6 md:px-8 lg:py-8">
            <Icon name={item.icon} size={26} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">{item.title}</p>
              <p className="text-sm text-muted">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Products({ section, products, brand }: { section: ProductsSection; products: Product[]; brand: string }) {
  return (
    <section className="container-x py-16 md:py-24" id="products">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="display max-w-[16ch] text-4xl md:text-6xl">{section.heading}</h2>
          {section.body && <p className="mt-3 text-lg text-muted">{section.body}</p>}
        </div>
        {section.cta && (
          <Link href={section.cta.href} className="btn btn-ghost">
            {section.cta.label}
          </Link>
        )}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} brand={brand} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}

export function Steps({ section }: { section: StepsSection }) {
  return (
    <section className="container-x py-16 md:py-24">
      <h2 className="display max-w-[18ch] text-4xl md:text-6xl">{section.heading}</h2>
      <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        <span aria-hidden className="absolute left-0 right-0 top-8 hidden border-t-2 border-dashed border-line md:block" />
        {section.steps.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-ink bg-bg text-2xl font-extrabold" style={{ fontFamily: "var(--f-heading)" }}>
              {i + 1}
            </span>
            <h3 className="mt-5 text-2xl">{s.title}</h3>
            <p className="mt-2 max-w-[32ch] text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CtaBanner({ section }: { section: CtaSection }) {
  return (
    <section className="container-x pb-16 md:pb-24">
      <div className="relative overflow-hidden rounded-lg bg-accent px-6 py-14 text-accent-ink md:px-16 md:py-20">
        <svg viewBox="0 0 100 100" className="absolute -right-16 -top-16 h-72 w-72 opacity-60 md:h-96 md:w-96" aria-hidden>
          <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="1.2" />
          <path d="M6 30 C 28 42, 28 58, 6 70" fill="none" stroke="white" strokeWidth="1.2" />
          <path d="M94 30 C 72 42, 72 58, 94 70" fill="none" stroke="white" strokeWidth="1.2" />
        </svg>
        <h2 className="display relative max-w-[14ch] text-5xl md:text-7xl">{section.heading}</h2>
        <p className="relative mt-4 text-lg md:text-xl">{section.body}</p>
        <Link href={section.cta.href} className="btn btn-primary relative mt-8 px-8 text-base">
          {section.cta.label}
        </Link>
      </div>
    </section>
  );
}
