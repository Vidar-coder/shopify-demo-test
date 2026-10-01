"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, Repeat } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { useCart, useUI } from "@/store/cart";
import { formatMoney } from "@/lib/format";
import { toCartLine } from "@/lib/cart-line";

export function ProductPurchase({ product, stickyBar = false }: { product: Product; stickyBar?: boolean }) {
  const add = useCart((s) => s.add);
  const { openCart, toast } = useUI();
  const [variantId, setVariantId] = useState(product.variants.find((v) => v.available)?.id ?? product.variants[0].id);
  const [subscribe, setSubscribe] = useState(Boolean(product.sellingPlan));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const variant = product.variants.find((v) => v.id === variantId)!;
  const plan = product.sellingPlan;
  const subPrice = plan ? variant.price.amount * (1 - plan.discountPercent / 100) : variant.price.amount;
  const unit = subscribe && plan ? subPrice : variant.price.amount;
  const showVariants = product.variants.length > 1;

  useEffect(() => {
    if (!stickyBar || !buttonRef.current) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0, rootMargin: "0px 0px -80px 0px" });
    io.observe(buttonRef.current);
    return () => io.disconnect();
  }, [stickyBar]);

  function addToCart() {
    add(toCartLine(product, variant, { quantity: qty, subscribe }));
    setAdded(true);
    toast(`Added ${product.title} to your cart`);
    setTimeout(() => setAdded(false), 1600);
    setTimeout(openCart, 350);
  }

  const option = (active: boolean) =>
    `relative flex w-full cursor-pointer items-start gap-3 rounded-md border-2 p-3.5 text-left transition-all active:scale-[0.99] sm:p-4 sm:transition-colors ${
      active ? "border-ink bg-bg shadow-[3px_3px_0_var(--c-ink)] md:bg-surface" : "border-line bg-bg/80 sm:hover:border-muted md:bg-surface/60"
    }`;

  return (
    <div className="space-y-5">
      {showVariants && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Size</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={!v.available}
                onClick={() => setVariantId(v.id)}
                aria-pressed={v.id === variantId}
                className={`min-h-11 rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-40 ${
                  v.id === variantId ? "border-ink bg-ink text-bg" : "border-line sm:hover:border-ink"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {plan && (
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-semibold">Purchase option</legend>
          <button type="button" className={option(subscribe)} onClick={() => setSubscribe(true)} aria-pressed={subscribe}>
            <Radio on={subscribe} />
            <span className="flex-1">
              <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-semibold">
                <span className="flex items-center gap-2 text-[0.9375rem] sm:text-base">
                  Subscribe & save {plan.discountPercent}%
                </span>
                <span className="tabular-nums">{formatMoney(subPrice, variant.price.currencyCode)}</span>
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <Repeat size={14} aria-hidden /> {plan.name}. Skip or cancel anytime.
              </span>
            </span>
          </button>
          <button type="button" className={option(!subscribe)} onClick={() => setSubscribe(false)} aria-pressed={!subscribe}>
            <Radio on={!subscribe} />
            <span className="flex flex-1 flex-wrap items-center justify-between gap-2 font-semibold">
              <span className="text-[0.9375rem] sm:text-base">One-time purchase</span>
              <span className="tabular-nums">{formatMoney(variant.price)}</span>
            </span>
          </button>
        </fieldset>
      )}

      <div className="flex flex-col gap-3 md:min-[400px]:flex-row md:min-[400px]:items-stretch">
        <Stepper value={qty} onChange={setQty} className="w-full justify-between md:w-auto md:justify-center" />
        <motion.button
          ref={buttonRef}
          onClick={addToCart}
          disabled={!variant.available}
          className="btn btn-primary min-h-[3.35rem] w-full flex-1 text-base md:min-h-[3.25rem]"
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="ok" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="flex items-center justify-center gap-2">
                <Check size={18} aria-hidden /> Added
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {variant.available ? (
                  <>
                    Add to cart
                    <motion.span
                      key={`${unit}-${qty}`}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-full bg-primary-ink/15 px-2.5 py-0.5 text-sm tabular-nums"
                    >
                      {formatMoney(unit * qty, variant.price.currencyCode)}
                    </motion.span>
                  </>
                ) : (
                  "Sold out"
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {stickyBar && (
        <AnimatePresence>
          {showSticky && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
              className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-bg/95 px-4 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
              style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
            >
              <div className="flex items-center gap-2.5">
                <Stepper value={qty} onChange={setQty} small className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold sm:text-sm">{product.title}</p>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={`${unit}-${subscribe}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-xs text-muted tabular-nums sm:text-sm"
                    >
                      {formatMoney(unit * qty, variant.price.currencyCode)}
                      {subscribe && plan ? " · sub" : ""}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <motion.button
                  onClick={addToCart}
                  disabled={!variant.available}
                  className="btn btn-primary min-h-11 shrink-0 px-4 text-sm sm:px-5"
                  whileTap={{ scale: 0.96 }}
                >
                  {added ? "Added" : "Add"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-ink" : "border-muted"}`} aria-hidden>
      {on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 28 }} className="h-2.5 w-2.5 rounded-full bg-ink" />}
    </span>
  );
}

export function Stepper({ value, onChange, min = 1, small, className = "" }: { value: number; onChange: (n: number) => void; min?: number; small?: boolean; className?: string }) {
  const h = small ? "h-9" : "h-12";
  return (
    <div className={`inline-flex ${h} items-center rounded-full border-2 border-line bg-surface ${className}`}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className={`grid ${h} w-11 place-items-center rounded-full active:bg-surface-alt sm:w-10 sm:hover:bg-surface-alt`} aria-label="Decrease quantity">
        <Minus size={16} aria-hidden />
      </button>
      <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} className={`grid ${h} w-11 place-items-center rounded-full active:bg-surface-alt sm:w-10 sm:hover:bg-surface-alt`} aria-label="Increase quantity">
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}
