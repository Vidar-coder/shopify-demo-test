"use client";

import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "@/lib/commerce/types";
import { useCart, useUI } from "@/store/cart";
import { formatMoney, discountPercent } from "@/lib/format";
import { productTint, toCartLine } from "@/lib/cart-line";
import { Stars } from "@/components/ui/Stars";
import { ProductArt } from "./ProductArt";
import Image from "next/image";

export function ProductCard({ product, brand, priority }: { product: Product; brand: string; priority?: boolean }) {
  const add = useCart((s) => s.add);
  const { openCart, quickView, toast } = useUI();
  const variant = product.variants[0];
  const off = discountPercent(variant.price.amount, variant.compareAtPrice?.amount);

  function quickAdd() {
    if (product.variants.length > 1) return quickView(product.handle);
    add(toCartLine(product, variant));
    toast(`Added ${product.title} to your cart`);
    openCart();
  }

  return (
    <motion.article
      layout
      className="group relative flex h-full flex-col"
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
    >
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-md border border-line/80 shadow-[3px_3px_0_var(--c-line)] transition-shadow duration-300 md:group-hover:shadow-[5px_5px_0_var(--c-ink)]"
        style={{ background: productTint(product) }}
      >
        <Link href={`/products/${product.handle}`} className="absolute inset-0 z-0 block p-4 sm:p-8" aria-label={product.title}>
          <motion.div
            className="relative h-full w-full"
            whileHover={{ y: -6, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {product.images[0] ? (
              <Image src={product.images[0].url} alt={product.images[0].alt} fill sizes="(min-width:1024px) 25vw, 50vw" priority={priority} className="object-contain" />
            ) : (
              product.art && <ProductArt art={product.art} title={product.title} subtitle={product.subtitle} brand={brand} className="h-full w-full" />
            )}
          </motion.div>
        </Link>

        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-pop px-2 py-0.5 text-[10px] font-bold text-pop-ink sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
            Save {off}%
          </span>
        )}
        {product.tags.includes("bestseller") && (
          <span className="absolute right-2 top-2 max-w-[45%] truncate rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-ink sm:right-3 sm:top-3 sm:max-w-none sm:px-2.5 sm:py-1 sm:text-xs">
            Bestseller
          </span>
        )}

        <div className="absolute inset-x-2 bottom-2 z-10 flex gap-1.5 sm:inset-x-3 sm:bottom-3 sm:gap-2 md:translate-y-3 md:opacity-0 md:transition-all md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button onClick={quickAdd} disabled={!product.available} className="btn btn-primary min-h-10 flex-1 px-2 text-xs sm:min-h-11 sm:px-3 sm:text-sm">
            <Plus size={16} aria-hidden /> {product.available ? "Add" : "Sold out"}
          </button>
          <button
            onClick={() => quickView(product.handle)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-ink shadow-sm active:scale-95 sm:h-11 sm:w-11 sm:hover:bg-surface-alt"
            aria-label={`Quick view ${product.title}`}
          >
            <Eye size={18} aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-2.5 flex flex-col gap-1 sm:mt-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold leading-tight sm:text-lg">
            <Link href={`/products/${product.handle}`} className="hover:underline underline-offset-4">
              {product.title}
            </Link>
          </h3>
          {product.subtitle && <p className="mt-0.5 line-clamp-1 text-xs text-muted sm:text-sm">{product.subtitle}</p>}
          {product.rating && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted sm:gap-1.5 sm:text-sm">
              <Stars rating={product.rating} size={13} className="text-ink sm:hidden" />
              <Stars rating={product.rating} size={14} className="hidden text-ink sm:inline-flex" />
              <span>{product.rating}</span>
              <span className="hidden sm:inline">({product.reviewCount})</span>
            </p>
          )}
        </div>
        <div className="flex items-baseline gap-2 sm:block sm:shrink-0 sm:text-right">
          <p className="font-bold tabular-nums">{formatMoney(variant.price)}</p>
          {variant.compareAtPrice && off > 0 && (
            <p className="text-xs text-muted line-through sm:text-sm">{formatMoney(variant.compareAtPrice)}</p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
