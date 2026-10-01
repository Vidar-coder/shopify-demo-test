"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "motion/react";
import type { HeroSection } from "@/config/types";
import type { Product } from "@/lib/commerce/types";
import { Stars } from "@/components/ui/Stars";
import { ProductArt } from "@/components/product/ProductArt";

const easeOut = [0.22, 1, 0.36, 1] as const;

const copyContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const copyItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: easeOut } },
};

const wordPop: Variants = {
  hidden: { opacity: 0, y: "0.35em", rotate: 3 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 380, damping: 28, delay: i * 0.045 },
  }),
};

/**
 * Featured product drops onto a ball backdrop, stickers pop in, then pointer tilt.
 */
export function Hero({ section, product, brand }: { section: HeroSection; product?: Product; brand: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), { stiffness: 180, damping: 18 });
  const parallaxX = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 20 });
  const parallaxY = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });

  function onMove(e: React.PointerEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  const headingWords = section.heading.split(" ");

  const stickerConfig = [
    { className: "left-0 top-[14%] -rotate-6", pop: -14, delay: 0.95 },
    { className: "right-0 top-[58%] rotate-[5deg] md:top-[38%]", pop: 12, delay: 1.1 },
    { className: "left-[6%] bottom-[10%] rotate-[-3deg]", pop: -8, delay: 1.25 },
  ];

  return (
    <section className="overflow-hidden">
      <div className="container-x grid items-center gap-6 pb-14 pt-6 md:grid-cols-[1.25fr_1fr] md:gap-10 md:pb-24 md:pt-10">
        <motion.div className="relative z-10 order-2 md:order-1" variants={copyContainer} initial={reduce ? false : "hidden"} animate="show">
          <h1 className="display text-[clamp(3.2rem,7.4vw,6.6rem)] font-extrabold leading-[0.9]">
            {headingWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                custom={i}
                variants={reduce ? undefined : wordPop}
                initial={reduce ? false : "hidden"}
                animate="show"
                className="mr-[0.28em] inline-block last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p variants={copyItem} className="mt-6 max-w-[34ch] text-lg text-muted md:text-xl">
            {section.body}
          </motion.p>

          <motion.div variants={copyItem} className="mt-8 flex flex-wrap gap-3">
            <motion.div whileHover={reduce ? undefined : { y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link href={section.primaryCta.href} className="btn btn-primary px-7 text-base">
                {section.primaryCta.label}
              </Link>
            </motion.div>
            {section.secondaryCta && (
              <motion.div whileHover={reduce ? undefined : { y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href={section.secondaryCta.href} className="btn btn-ghost px-6 text-base">
                  {section.secondaryCta.label}
                </Link>
              </motion.div>
            )}
          </motion.div>

          {section.proof && (
            <motion.p variants={copyItem} className="mt-8 flex items-center gap-3 text-sm">
              <Stars rating={section.proof.rating} size={18} />
              <span>
                <strong className="text-base">{section.proof.rating}</strong>{" "}
                <span className="text-muted">{section.proof.label}</span>
              </span>
            </motion.p>
          )}
        </motion.div>

        <div
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          className="relative order-1 mx-auto aspect-square w-full max-w-[560px] md:order-2"
          style={{ perspective: 900 }}
        >
          {!reduce && (
            <>
              <span className="pointer-events-none absolute left-[18%] top-[22%] h-2 w-2 rounded-full bg-pop opacity-80" aria-hidden />
              <span className="pointer-events-none absolute right-[20%] top-[18%] h-1.5 w-1.5 rounded-full bg-accent-ink/40" aria-hidden />
              <span className="pointer-events-none absolute bottom-[24%] right-[14%] h-2.5 w-2.5 rounded-full border-2 border-ink/20 opacity-50" aria-hidden />
            </>
          )}

          <motion.div className="absolute inset-[6%]" style={{ x: parallaxX, y: parallaxY }}>
            <motion.div
              className="relative h-full w-full rounded-full bg-accent"
              initial={reduce ? false : { scale: 0.45, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 130, damping: 15 }}
            >
              <motion.svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.5 }}>
                <motion.path
                  d="M8 30 C 30 42, 30 58, 8 70"
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.85"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.45, ease: easeOut }}
                />
                <motion.path
                  d="M92 30 C 70 42, 70 58, 92 70"
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.85"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.55, ease: easeOut }}
                />
              </motion.svg>

              {!reduce && <span className="absolute inset-[8%] rounded-full border-2 border-dashed border-white/30" aria-hidden />}
            </motion.div>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute bottom-[11%] left-1/2 h-5 w-[42%] -translate-x-1/2 rounded-[100%] bg-ink/20 blur-lg"
            initial={reduce ? false : { scaleX: 0.2, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.32 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            aria-hidden
          />

          <div className="absolute inset-[16%]">
            <motion.div
              className="relative h-full w-full"
              style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
              initial={reduce ? false : { y: -280, opacity: 0, rotate: -16, scale: 0.88 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
            >
              {product?.images[0] ? (
                <Image src={product.images[0].url} alt={product.images[0].alt} fill priority sizes="(min-width: 768px) 40vw, 80vw" className="object-contain drop-shadow-2xl" />
              ) : (
                product?.art && <ProductArt art={product.art} title={product.title} subtitle={product.subtitle} brand={brand} className="h-full w-full drop-shadow-2xl" />
              )}
            </motion.div>
          </div>

          {section.stickers.slice(0, 3).map((s, i) => {
            const cfg = stickerConfig[i];
            return (
              <motion.span
                key={s}
                className={`absolute ${cfg.className} z-10 rounded-full border-2 border-ink bg-surface px-3 py-1.5 text-xs font-bold shadow-[3px_3px_0_var(--c-ink)] sm:text-sm md:px-4 md:py-2 md:text-base`}
                initial={reduce ? false : { scale: 0, opacity: 0, rotate: cfg.pop, y: 16 }}
                animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
                transition={
                  reduce
                    ? undefined
                    : {
                        scale: { type: "spring", stiffness: 520, damping: 18, delay: cfg.delay },
                        opacity: { duration: 0.25, delay: cfg.delay },
                        rotate: { type: "spring", stiffness: 420, damping: 20, delay: cfg.delay },
                        y: { type: "spring", stiffness: 400, damping: 22, delay: cfg.delay },
                      }
                }
              >
                {s}
              </motion.span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
