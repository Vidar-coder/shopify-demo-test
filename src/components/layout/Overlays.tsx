"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import type { Product, ProductArt as Art, Money, ProductImage } from "@/lib/commerce/types";
import { useCart, useUI } from "@/store/cart";
import { discountPercent, formatMoney } from "@/lib/format";
import { productTint } from "@/lib/cart-line";
import { ProductArt } from "@/components/product/ProductArt";
import { ProductMobileBuyBox } from "@/components/product/ProductMobileBuyBox";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { Stars } from "@/components/ui/Stars";
import { useEscape, useLockBody } from "./Header";

/* ---------------- Providers ---------------- */

export function Providers() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return null;
}

/* ---------------- Search ---------------- */

type Hit = { handle: string; title: string; subtitle?: string; price: Money; image?: ProductImage; art?: Art };

export function SearchOverlay({ brand, suggestions }: { brand: string; suggestions: string[] }) {
  const { searchOpen, setSearch } = useUI();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setSearch(false), [setSearch]);
  useLockBody(searchOpen);
  useEscape(searchOpen, close);

  useEffect(() => {
    if (searchOpen) setTimeout(() => input.current?.focus(), 50);
    else setQ("");
  }, [searchOpen]);

  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        setHits((await res.json()).results);
      } catch {}
      setLoading(false);
    }, 160);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed inset-x-0 top-0 z-50 bg-bg shadow-xl"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <div className="container-x py-5">
              <div className="flex items-center gap-3 border-b-2 border-ink pb-2">
                <Search size={24} aria-hidden />
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search for digestion, itching, joints…"
                  className="h-12 flex-1 bg-transparent text-xl font-semibold outline-none placeholder:text-muted/70 md:text-2xl"
                  aria-label="Search products"
                />
                <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-alt" aria-label="Close search">
                  <X size={22} aria-hidden />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto py-5">
                {!q.trim() && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted">Popular:</span>
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => setQ(s)} className="rounded-full bg-surface-alt px-3.5 py-1.5 text-sm font-semibold hover:bg-accent hover:text-accent-ink">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {q.trim() && !loading && hits.length === 0 && (
                  <p className="text-muted">No products match &ldquo;{q}&rdquo;. Try a concern like &ldquo;skin&rdquo; or &ldquo;calm&rdquo;.</p>
                )}
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {hits.map((h, i) => (
                    <motion.li key={h.handle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link href={`/products/${h.handle}`} onClick={close} className="flex items-center gap-3 rounded-sm p-2 hover:bg-surface-alt">
                        <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm p-1" style={{ background: productTint(h) }}>
                          {h.image ? (
                            <Image src={h.image.url} alt={h.image.alt} fill sizes="56px" className="object-contain" />
                          ) : (
                            h.art && <ProductArt art={h.art} title={h.title} brand={brand} className="h-full w-full" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-bold">{h.title}</span>
                          <span className="block text-sm text-muted">{formatMoney(h.price)}</span>
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Quick view ---------------- */

export function QuickView({ brand }: { brand: string }) {
  const { quickViewHandle, quickView } = useUI();
  const [product, setProduct] = useState<Product | null>(null);
  const close = useCallback(() => quickView(null), [quickView]);
  useLockBody(Boolean(quickViewHandle));
  useEscape(Boolean(quickViewHandle), close);

  useEffect(() => {
    if (!quickViewHandle) return setProduct(null);
    fetch(`/api/products/${quickViewHandle}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product));
  }, [quickViewHandle]);

  const variant = product?.variants.find((v) => v.available) ?? product?.variants[0];
  const off = variant ? discountPercent(variant.price.amount, variant.compareAtPrice?.amount) : 0;

  return (
    <AnimatePresence>
      {quickViewHandle && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col justify-end bg-ink/60 sm:justify-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={product?.title ?? "Quick view"}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[min(92dvh,780px)] w-full flex-col overflow-hidden rounded-t-2xl border-2 border-b-0 border-ink bg-bg shadow-[0_-16px_48px_rgba(0,0,0,0.2)] sm:mx-auto sm:max-w-lg sm:rounded-2xl sm:border md:max-h-[92vh] md:max-w-4xl md:grid md:grid-cols-2 md:overflow-hidden md:rounded-lg"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", opacity: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-end p-3 sm:p-4">
              <button
                type="button"
                onClick={close}
                className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-bg text-ink shadow-[2px_2px_0_var(--c-ink)] transition-transform active:scale-95 sm:hover:bg-surface-alt"
                aria-label="Close quick view"
              >
                <X size={20} strokeWidth={2.25} aria-hidden />
              </button>
            </div>

            <div className="flex shrink-0 justify-center pt-2.5 pb-1 md:hidden" aria-hidden>
              <span className="h-1 w-12 rounded-full bg-line" />
            </div>

            {!product ? (
              <div className="grid min-h-[40vh] flex-1 place-items-center px-6 py-12 text-muted md:col-span-2 md:min-h-80">Loading…</div>
            ) : (
              <>
                <div
                  className="relative h-[min(32vh,240px)] min-h-[168px] shrink-0 md:aspect-auto md:h-auto md:min-h-[320px]"
                  style={{ background: productTint(product) }}
                >
                  <div className="relative flex h-full items-center justify-center px-6 pb-4 pt-8 md:p-10 md:pt-10">
                    {product.images[0] ? (
                      <div className="relative h-full w-full max-w-[220px] md:max-w-none">
                        <Image src={product.images[0].url} alt={product.images[0].alt} fill sizes="(max-width:768px) 280px, 450px" className="object-contain" />
                      </div>
                    ) : (
                      product.art && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.94 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="relative h-full w-full max-h-[200px] max-w-[200px] md:max-h-80 md:max-w-none"
                        >
                          <ProductArt art={product.art} title={product.title} subtitle={product.subtitle} brand={brand} className="h-full w-full" />
                        </motion.div>
                      )
                    )}
                  </div>
                  <span className="pointer-events-none absolute bottom-3 left-1/2 h-3 w-[45%] -translate-x-1/2 rounded-[100%] bg-ink/15 blur-md md:bottom-6" aria-hidden />
                </div>

                <div className="flex min-h-0 flex-1 flex-col border-t border-line md:border-t-0 md:overflow-y-auto">
                  <div
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 md:px-8 md:pb-8 md:pt-14 md:pr-16"
                    style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
                  >
                    <h2 className="pt-1 text-xl font-bold leading-tight sm:text-2xl md:pt-0 md:text-3xl" style={{ fontFamily: "var(--f-heading)" }}>
                      {product.title}
                    </h2>
                    {product.subtitle && <p className="mt-1 text-sm text-muted">{product.subtitle}</p>}

                    {variant && (
                      <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-xl font-extrabold tabular-nums" style={{ fontFamily: "var(--f-heading)" }}>
                          {formatMoney(variant.price)}
                        </span>
                        {off > 0 && variant.compareAtPrice && (
                          <>
                            <span className="text-sm text-muted line-through">{formatMoney(variant.compareAtPrice)}</span>
                            <span className="rounded-full bg-pop px-2 py-0.5 text-[10px] font-bold text-pop-ink">Save {off}%</span>
                          </>
                        )}
                      </p>
                    )}

                    {product.rating && (
                      <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <Stars rating={product.rating} size={15} />
                        <span className="font-semibold">{product.rating}</span>
                        <span className="text-muted">({product.reviewCount} reviews)</span>
                      </p>
                    )}

                    <p className="mt-3 text-sm leading-relaxed text-muted md:mt-4 md:text-[0.95rem]">{product.description}</p>

                    <div className="mt-4 md:mt-6">
                      <ProductMobileBuyBox>
                        <ProductPurchase product={product} />
                      </ProductMobileBuyBox>
                    </div>

                    <Link
                      href={`/products/${product.handle}`}
                      onClick={close}
                      className="btn btn-ghost mt-4 w-full text-sm md:mt-5 md:w-auto"
                    >
                      See full details
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Toasts ---------------- */

export function Toasts() {
  const toasts = useUI((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg shadow-lg"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
