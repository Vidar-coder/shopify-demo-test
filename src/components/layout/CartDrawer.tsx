"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Repeat, Trash2, Truck, X } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { cartTotals, useCart, useUI, type CartLine } from "@/store/cart";
import { formatMoney } from "@/lib/format";
import { productTint, toCartLine } from "@/lib/cart-line";
import { ProductArt } from "@/components/product/ProductArt";
import { Stepper } from "@/components/product/ProductPurchase";
import { useEscape, useLockBody } from "./Header";

type Props = {
  brand: string;
  currency: string;
  freeShippingThreshold?: number;
  upsells: Product[];
  demo: boolean;
};

export function CartDrawer({ brand, currency, freeShippingThreshold, upsells, demo }: Props) {
  const { lines, setQuantity, remove, add } = useCart();
  const { cartOpen, closeCart, toast } = useUI();
  const [checkingOut, setCheckingOut] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const close = useCallback(() => closeCart(), [closeCart]);
  useLockBody(cartOpen);
  useEscape(cartOpen, close);

  const { count, subtotal, bundleSavings, total } = cartTotals(lines);
  const remaining = freeShippingThreshold ? Math.max(0, freeShippingThreshold - total) : 0;
  const progress = freeShippingThreshold ? Math.min(1, total / freeShippingThreshold) : 0;
  const suggestions = upsells.filter((p) => !lines.some((l) => l.handle === p.handle)).slice(0, 3);

  async function checkout() {
    setMessage(null);
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            merchandiseId: l.variantId,
            quantity: l.quantity,
            sellingPlanId: l.sellingPlanId,
            attributes: l.bundleDiscount ? [{ key: "_bundle", value: `${l.bundleDiscount}%` }] : undefined,
          })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setMessage(data.demo ? "This is the demo catalog. Add your Shopify keys to .env to turn on real checkout." : data.error);
    } catch {
      setMessage("Couldn't reach checkout. Check your connection and try again.");
    }
    setCheckingOut(false);
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-bg shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <div className="flex items-center justify-between px-5 pb-3 pt-5">
              <h2 className="text-2xl">Your cart {count > 0 && <span className="text-muted">({count})</span>}</h2>
              <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-alt" aria-label="Close cart">
                <X size={22} aria-hidden />
              </button>
            </div>

            {freeShippingThreshold && count > 0 && (
              <div className="mx-5 rounded-sm bg-surface-alt p-3.5">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Truck size={16} aria-hidden />
                  {remaining > 0 ? <>You&apos;re {formatMoney(remaining, currency)} away from free delivery</> : <>Free delivery unlocked</>}
                </p>
                <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                  <motion.div className="h-full rounded-full bg-primary" initial={false} animate={{ width: `${progress * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {count === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-xl font-bold" style={{ fontFamily: "var(--f-heading)" }}>Your cart is empty</p>
                  <p className="mt-1 text-muted">Find the right formula for your dog and it&apos;ll show up here.</p>
                  <Link href="/shop" onClick={close} className="btn btn-primary mt-6">Browse products</Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li key={l.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }} transition={{ duration: 0.25 }}>
                        <LineItem line={l} brand={brand} onQty={(q) => setQuantity(l.key, q)} onRemove={() => remove(l.key)} onNavigate={close} />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {count > 0 && suggestions.length > 0 && (
                <section className="mt-8">
                  <h3 className="text-lg">Pairs well with</h3>
                  <ul className="no-scrollbar -mx-5 mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
                    {suggestions.map((p) => (
                      <li key={p.id} className="w-40 shrink-0 snap-start rounded-sm border border-line bg-surface p-3">
                        <div className="relative mx-auto h-24 w-20">
                          {p.images[0] ? (
                            <Image src={p.images[0].url} alt={p.images[0].alt} fill sizes="80px" className="object-contain" />
                          ) : (
                            p.art && <ProductArt art={p.art} title={p.title} brand={brand} className="h-full w-full" />
                          )}
                        </div>
                        <p className="mt-2 truncate text-sm font-bold">{p.title}</p>
                        <p className="text-sm text-muted">{formatMoney(p.variants[0].price)}</p>
                        <button
                          onClick={() => {
                            add(toCartLine(p, p.variants[0]));
                            toast(`Added ${p.title}`);
                          }}
                          className="mt-2 flex w-full items-center justify-center gap-1 rounded-full border-2 border-ink py-1.5 text-sm font-semibold hover:bg-ink hover:text-bg"
                        >
                          <Plus size={14} aria-hidden /> Add
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {count > 0 && (
              <div className="border-t border-line px-5 pb-5 pt-4">
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Subtotal</dt>
                    <dd className="tabular-nums">{formatMoney(subtotal, currency)}</dd>
                  </div>
                  {bundleSavings > 0 && (
                    <div className="flex justify-between font-semibold">
                      <dt>Bundle savings</dt>
                      <dd className="tabular-nums">−{formatMoney(bundleSavings, currency)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 text-lg font-bold text-ink">
                    <dt>Estimated total</dt>
                    <dd className="tabular-nums">{formatMoney(total, currency)}</dd>
                  </div>
                </dl>
                <p className="mt-1 text-xs text-muted">Delivery and final discounts are calculated at checkout.</p>
                <button onClick={checkout} disabled={checkingOut} className="btn btn-primary mt-4 w-full text-base">
                  {checkingOut ? "Opening checkout…" : "Check out"}
                </button>
                {message && (
                  <p role="status" className="mt-3 rounded-sm bg-surface-alt p-3 text-sm">
                    {message}
                  </p>
                )}
                {demo && !message && <p className="mt-3 text-center text-xs text-muted">Demo catalog — checkout turns on when Shopify is connected.</p>}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function LineItem({ line, brand, onQty, onRemove, onNavigate }: { line: CartLine; brand: string; onQty: (n: number) => void; onRemove: () => void; onNavigate: () => void }) {
  return (
    <div className="flex gap-3 rounded-sm bg-surface p-3 shadow-[0_0_0_1px_var(--c-line)]">
      <Link href={`/products/${line.handle}`} onClick={onNavigate} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm p-1.5" style={{ background: productTint(line) }}>
        {line.image ? (
          <Image src={line.image.url} alt={line.image.alt} fill sizes="80px" className="object-contain" />
        ) : (
          line.art && <ProductArt art={line.art} title={line.title} brand={brand} className="h-full w-full" />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-bold">{line.title}</p>
            {line.variantTitle && <p className="text-sm text-muted">{line.variantTitle}</p>}
            {line.sellingPlanName && (
              <p className="flex items-center gap-1 text-xs font-semibold text-muted">
                <Repeat size={12} aria-hidden /> {line.sellingPlanName}
              </p>
            )}
            {line.bundleDiscount ? <p className="text-xs font-semibold text-muted">Bundle, {line.bundleDiscount}% off</p> : null}
          </div>
          <button onClick={onRemove} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-alt hover:text-ink" aria-label={`Remove ${line.title}`}>
            <Trash2 size={16} aria-hidden />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <Stepper value={line.quantity} onChange={onQty} min={0} small />
          <div className="text-right">
            <p className="font-bold tabular-nums">{formatMoney(line.unitPrice * line.quantity, line.currencyCode)}</p>
            {line.compareAtPrice && line.compareAtPrice > line.unitPrice && (
              <p className="text-xs text-muted line-through tabular-nums">{formatMoney(line.compareAtPrice * line.quantity, line.currencyCode)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
