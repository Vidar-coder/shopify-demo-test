"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Product } from "@/lib/commerce/types";
import { productTint } from "@/lib/cart-line";
import { ProductArt } from "./ProductArt";

/** Main image with hover-to-zoom (desktop) and swipe carousel (mobile). Falls back to drawn packaging. */
export function ProductGallery({ product, brand }: { product: Product; brand: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const mobileTrack = useRef<HTMLUListElement>(null);
  const images = product.images;
  const slideCount = Math.max(images.length, 1);

  const syncActiveFromScroll = useCallback(() => {
    const el = mobileTrack.current;
    if (!el) return;
    const slide = el.querySelector("li");
    if (!slide) return;
    const w = slide.clientWidth + 12;
    const index = Math.round(el.scrollLeft / w);
    setActive(Math.min(slideCount - 1, Math.max(0, index)));
  }, [slideCount]);

  useEffect(() => {
    const el = mobileTrack.current;
    if (!el) return;
    syncActiveFromScroll();
    el.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    return () => el.removeEventListener("scroll", syncActiveFromScroll);
  }, [syncActiveFromScroll, slideCount]);

  const scrollToSlide = (index: number) => {
    const el = mobileTrack.current;
    if (!el) return;
    const slide = el.querySelector("li");
    el.scrollTo({ left: index * ((slide?.clientWidth ?? 280) + 12), behavior: "smooth" });
    setActive(index);
  };

  const tint = productTint(product);

  const slideContent = (index: number, mobile?: boolean) => {
    const image = images[index];
    return (
      <div className="relative h-full w-full p-[6%] sm:p-[10%]">
        {image ? (
          <Image src={image.url} alt={image.alt} fill priority={index === 0} sizes="(min-width: 768px) 50vw, 100vw" className="object-contain p-[4%]" />
        ) : (
          product.art && (
            <motion.div
              className="h-full w-full"
              initial={mobile && !reduce ? { opacity: 0, scale: 0.94 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 280, damping: 24 }}
            >
              <ProductArt art={product.art} title={product.title} subtitle={product.subtitle} brand={brand} className="h-full w-full" />
            </motion.div>
          )
        )}
      </div>
    );
  };

  return (
    <div className="md:sticky md:top-24">
      {/* Mobile: edge-to-edge swipe gallery */}
      <div className="md:hidden">
        <ul
          ref={mobileTrack}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4"
          aria-label={`${product.title} images`}
        >
          {Array.from({ length: slideCount }, (_, i) => (
            <li
              key={images[i]?.url ?? "art"}
              className="aspect-[5/6] w-[min(calc(100vw-2rem),380px)] shrink-0 snap-center overflow-hidden rounded-lg border-2 border-line shadow-[4px_4px_0_var(--c-line)]"
              style={{ background: tint }}
            >
              {slideContent(i, true)}
            </li>
          ))}
        </ul>
        {slideCount > 1 && (
          <div className="mt-2 flex items-center justify-between gap-3 px-1">
            <p className="text-xs font-semibold text-muted" aria-live="polite">
              {active + 1} / {slideCount}
            </p>
            <div className="flex flex-1 justify-end gap-1.5" aria-label={`Image ${active + 1} of ${slideCount}`}>
              {Array.from({ length: slideCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToSlide(i)}
                  className={`h-2 rounded-full transition-all ${i === active ? "w-5 bg-ink" : "w-2 bg-line"}`}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        )}
        {images.length > 1 && (
          <ul className="mt-3 flex gap-2 overflow-x-auto px-0.5 no-scrollbar">
            {images.map((im, i) => (
              <li key={im.url} className="shrink-0">
                <button
                  type="button"
                  onClick={() => scrollToSlide(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-pressed={i === active}
                  className={`relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-md border-2 transition-transform active:scale-95 ${i === active ? "border-ink ring-2 ring-ink/20" : "border-transparent opacity-75"}`}
                  style={{ background: tint }}
                >
                  <Image src={im.url} alt="" fill sizes="72px" className="object-contain p-1" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop: zoom + fade transition */}
      <div
        className="relative hidden aspect-square cursor-zoom-in overflow-hidden rounded-lg border-2 border-line md:block"
        style={{ background: tint }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => setZoom(null)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 transition-transform duration-200 ease-out"
            style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          >
            {slideContent(active)}
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <ul className="mt-3 hidden gap-2 overflow-x-auto no-scrollbar md:flex">
          {images.map((im, i) => (
            <li key={im.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === active}
                className={`relative h-20 w-20 overflow-hidden rounded-sm border-2 transition-all hover:opacity-100 ${i === active ? "border-ink opacity-100" : "border-transparent opacity-70"}`}
                style={{ background: tint }}
              >
                <Image src={im.url} alt="" fill sizes="80px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
