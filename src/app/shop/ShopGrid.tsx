"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/product/ProductCard";

const sorts = {
  featured: { label: "Featured", fn: () => 0 },
  "price-asc": { label: "Price, low to high", fn: (a: Product, b: Product) => a.priceRange.min.amount - b.priceRange.min.amount },
  "price-desc": { label: "Price, high to low", fn: (a: Product, b: Product) => b.priceRange.min.amount - a.priceRange.min.amount },
  rating: { label: "Top rated", fn: (a: Product, b: Product) => (b.rating ?? 0) - (a.rating ?? 0) },
} as const;

export function ShopGrid({ products, types, initialType, brand }: { products: Product[]; types: string[]; initialType?: string; brand: string }) {
  const [type, setType] = useState<string | null>(initialType && types.includes(initialType) ? initialType : null);
  const [sort, setSort] = useState<keyof typeof sorts>("featured");

  const list = useMemo(() => {
    const filtered = type ? products.filter((p) => p.productType === type) : products;
    return [...filtered].sort(sorts[sort].fn);
  }, [products, type, sort]);

  function choose(t: string | null) {
    setType(t);
    const url = new URL(window.location.href);
    if (t) url.searchParams.set("type", t);
    else url.searchParams.delete("type");
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      <div className="sticky top-16 z-20 -mx-4 mt-6 flex flex-col gap-3 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur-md sm:mt-8 md:-mx-8 md:flex-row md:flex-wrap md:items-center md:px-8">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5" role="group" aria-label="Filter by category">
          {[null, ...types].map((t) => {
            const active = t === type;
            return (
              <button
                key={t ?? "all"}
                onClick={() => choose(t)}
                aria-pressed={active}
                className="relative shrink-0 rounded-full border-2 border-ink px-3.5 py-2 text-xs font-semibold active:scale-95 sm:px-4 sm:text-sm"
              >
                {active && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                <span className={`relative ${active ? "text-bg" : ""}`}>{t ?? "All"}</span>
              </button>
            );
          })}
        </div>
        <label className="flex w-full items-center justify-between gap-2 text-sm sm:ml-auto sm:w-auto sm:justify-start">
          <span className="text-muted">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof sorts)} className="min-h-11 max-w-[55%] flex-1 rounded-full border-2 border-line bg-surface px-3 py-2 text-sm font-semibold sm:max-w-none sm:flex-none">
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <motion.p
        key={`${type}-${sort}-${list.length}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-sm text-muted"
        aria-live="polite"
      >
        {list.length} {list.length === 1 ? "product" : "products"}
      </motion.p>

      <motion.ul layout className="mt-5 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-6 sm:gap-x-4 sm:gap-y-10 md:gap-x-6 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, delay: Math.min(i * 0.04, 0.24), ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} brand={brand} priority={i < 2} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
