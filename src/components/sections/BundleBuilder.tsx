"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";
import type { BundleSection } from "@/config/types";
import type { Product } from "@/lib/commerce/types";
import { useCart, useUI } from "@/store/cart";
import { formatMoney } from "@/lib/format";
import { toCartLine } from "@/lib/cart-line";
import { ProductArt } from "@/components/product/ProductArt";

export function BundleBuilder({ section, products, brand, currency }: { section: BundleSection; products: Product[]; brand: string; currency: string }) {
  const [tierIdx, setTierIdx] = useState(1);
  const [picked, setPicked] = useState<Product[]>([]);
  const add = useCart((s) => s.add);
  const { openCart, toast } = useUI();

  const tier = section.tiers[tierIdx];
  const full = picked.length >= tier.quantity;
  const original = picked.reduce((n, p) => n + p.variants[0].price.amount, 0);
  const discounted = original * (1 - tier.discountPercent / 100);

  function changeTier(i: number) {
    setTierIdx(i);
    setPicked((p) => p.slice(0, section.tiers[i].quantity));
  }

  function pick(p: Product) {
    if (full) return;
    setPicked((list) => [...list, p]);
  }

  function addBundle() {
    picked.forEach((p) => add(toCartLine(p, p.variants[0], { bundleDiscount: tier.discountPercent })));
    toast(`Bundle added, ${tier.discountPercent}% off`);
    setPicked([]);
    openCart();
  }

  const art = (p: Product, cls: string) =>
    p.images[0] ? (
      <Image src={p.images[0].url} alt={p.images[0].alt} fill sizes="120px" className="object-contain" />
    ) : (
      p.art && <ProductArt art={p.art} title={p.title} brand={brand} className={cls} />
    );

  const picker = (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:row-span-2">
      {products.map((p) => (
        <li key={p.id}>
          <button
            onClick={() => pick(p)}
            disabled={full}
            className="group flex h-full w-full flex-col rounded-md bg-bg p-3 text-left text-ink transition-shadow hover:shadow-[0_0_0_3px_var(--c-accent)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Add ${p.title} to bundle`}
          >
            <span className="relative block aspect-square w-full">
              <span className="absolute inset-0 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">{art(p, "h-full w-full")}</span>
            </span>
            <span className="mt-2 flex items-end justify-between gap-2">
              <span className="min-w-0">
                <span className="block truncate font-bold">{p.title}</span>
                <span className="block text-sm text-muted">{formatMoney(p.variants[0].price)}</span>
              </span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-ink">
                <Plus size={16} strokeWidth={3} aria-hidden />
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <section id="bundle" className="scroll-mt-20 bg-primary text-primary-ink">
      <div className="container-x grid gap-8 py-16 md:py-24 lg:grid-cols-[1fr_1.15fr] lg:gap-x-16">
        <div className="lg:col-start-1">
          <h2 className="display text-4xl md:text-6xl">{section.heading}</h2>
          <p className="mt-4 max-w-md text-lg opacity-80">{section.body}</p>

          <div className="mt-8 grid grid-cols-3 gap-1 rounded-md bg-primary-ink/10 p-1 sm:inline-grid" role="radiogroup" aria-label="Bundle size">
            {section.tiers.map((t, i) => (
              <button
                key={t.quantity}
                role="radio"
                aria-checked={i === tierIdx}
                onClick={() => changeTier(i)}
                className="relative rounded-sm px-4 py-2.5 text-center md:px-6"
              >
                {i === tierIdx && (
                  <motion.span layoutId="tier-pill" className="absolute inset-0 rounded-sm bg-accent" transition={{ type: "spring", stiffness: 500, damping: 36 }} />
                )}
                <span className={`relative block ${i === tierIdx ? "text-accent-ink" : ""}`}>
                  <span className="block font-bold">{t.label}</span>
                  <span className="block text-xs font-semibold opacity-80">Save {t.discountPercent}%</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">{picker}</div>

        <div className="sticky bottom-0 z-10 -mx-4 border-t border-primary-ink/15 bg-primary px-4 pb-4 pt-4 lg:static lg:col-start-1 lg:row-start-2 lg:mx-0 lg:border-0 lg:p-0">
          <ul className="flex gap-2 lg:gap-3" aria-label="Your bundle">
            {Array.from({ length: tier.quantity }).map((_, i) => {
              const p = picked[i];
              return (
                <li key={i} className="relative h-20 w-16 lg:h-36 lg:w-28">
                  <AnimatePresence mode="popLayout">
                    {p ? (
                      <motion.div
                        key={p.id + i}
                        initial={{ scale: 0.4, y: -30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 420, damping: 20 }}
                        className="relative h-full w-full rounded-sm bg-bg p-1.5 lg:p-2"
                      >
                        {art(p, "h-full w-full")}
                        <button
                          onClick={() => setPicked((list) => list.filter((_, j) => j !== i))}
                          className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-pop text-pop-ink"
                          aria-label={`Remove ${p.title} from bundle`}
                        >
                          <X size={14} strokeWidth={3} aria-hidden />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key={`empty-${i}`} className="grid h-full w-full place-items-center rounded-sm border-2 border-dashed border-primary-ink/35 text-sm opacity-70">
                        {i + 1}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 lg:mt-8 lg:justify-start lg:gap-5">
            <div aria-live="polite">
              {picked.length > 0 ? (
                <p className="flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold lg:text-3xl" style={{ fontFamily: "var(--f-heading)" }}>{formatMoney(discounted, currency)}</span>
                  <span className="line-through opacity-60">{formatMoney(original, currency)}</span>
                </p>
              ) : (
                <p className="text-sm opacity-70 lg:text-base">Choose {tier.quantity} products to see your price.</p>
              )}
            </div>
            <button onClick={addBundle} disabled={!full} className="btn btn-accent px-7 text-base">
              {full ? "Add bundle to cart" : `Pick ${tier.quantity - picked.length} more`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
