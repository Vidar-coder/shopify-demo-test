"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, RotateCcw } from "lucide-react";
import type { QuizSection } from "@/config/types";
import type { Product } from "@/lib/commerce/types";
import { useCart, useUI } from "@/store/cart";
import { formatMoney } from "@/lib/format";
import { productTint, toCartLine } from "@/lib/cart-line";
import { ProductArt } from "@/components/product/ProductArt";

/** Config-driven product finder: each answer adds points to product handles. */
export function Quiz({ section, products, brand }: { section: QuizSection; products: Product[]; brand: string }) {
  const [answers, setAnswers] = useState<number[]>([]);
  const add = useCart((s) => s.add);
  const { openCart, toast } = useUI();
  const step = answers.length;
  const done = step >= section.questions.length;

  let winner: Product | undefined;
  if (done) {
    const scores: Record<string, number> = {};
    answers.forEach((a, qi) => {
      Object.entries(section.questions[qi].options[a].scores).forEach(([h, n]) => (scores[h] = (scores[h] ?? 0) + n));
    });
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
    winner = products.find((p) => p.handle === best) ?? products[0];
  }
  const result = winner ? section.results[winner.handle] : undefined;

  return (
    <section id="quiz" className="container-x scroll-mt-24 py-16 md:py-24">
      <div className="overflow-hidden rounded-lg bg-pop text-pop-ink">
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="p-7 md:p-12">
            <h2 className="display text-4xl md:text-6xl">{section.heading}</h2>
            <p className="mt-4 max-w-sm text-lg">{section.body}</p>
            <div className="mt-8 flex gap-1.5" aria-label={`Step ${Math.min(step + 1, section.questions.length)} of ${section.questions.length}`}>
              {section.questions.map((_, i) => (
                <span key={i} className="h-2 flex-1 overflow-hidden rounded-full bg-pop-ink/15">
                  <motion.span className="block h-full rounded-full bg-pop-ink" initial={false} animate={{ width: i < step ? "100%" : "0%" }} />
                </span>
              ))}
            </div>
          </div>

          <div className="min-h-[420px] bg-surface p-7 text-ink md:p-12">
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div key={step} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <p className="text-sm font-semibold text-muted">
                    Question {step + 1} of {section.questions.length}
                  </p>
                  <h3 className="mt-2 text-2xl md:text-3xl">{section.questions[step].question}</h3>
                  <ul className="mt-6 space-y-2.5">
                    {section.questions[step].options.map((o, i) => (
                      <li key={o.label}>
                        <button
                          onClick={() => setAnswers((a) => [...a, i])}
                          className="w-full rounded-sm border-2 border-line px-5 py-4 text-left font-semibold transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-[3px_3px_0_var(--c-ink)] active:translate-y-0 active:shadow-none"
                        >
                          {o.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {step > 0 && (
                    <button onClick={() => setAnswers((a) => a.slice(0, -1))} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
                      <ChevronLeft size={16} aria-hidden /> Back
                    </button>
                  )}
                </motion.div>
              ) : (
                winner && (
                  <motion.div key="result" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                    <p className="text-sm font-semibold text-muted">Our suggestion</p>
                    <h3 className="mt-1 text-3xl md:text-4xl">{result?.headline ?? winner.title}</h3>
                    <div className="mt-6 flex gap-5 rounded-md p-4" style={{ background: productTint(winner) }}>
                      <div className="relative h-36 w-28 shrink-0">
                        {winner.images[0] ? (
                          <Image src={winner.images[0].url} alt={winner.images[0].alt} fill sizes="112px" className="object-contain" />
                        ) : (
                          winner.art && <ProductArt art={winner.art} title={winner.title} brand={brand} className="h-full w-full" />
                        )}
                      </div>
                      <div className="self-center">
                        <p className="text-xl font-bold">{winner.title}</p>
                        <p className="text-sm text-muted">{winner.subtitle}</p>
                        <p className="mt-2 font-bold">{formatMoney(winner.variants[0].price)}</p>
                      </div>
                    </div>
                    {result && <p className="mt-4 text-muted">{result.reason}</p>}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          add(toCartLine(winner!, winner!.variants[0]));
                          toast(`Added ${winner!.title} to your cart`);
                          openCart();
                        }}
                        className="btn btn-primary"
                      >
                        Add to cart
                      </button>
                      <Link href={`/products/${winner.handle}`} className="btn btn-ghost">
                        View product
                      </Link>
                    </div>
                    <button onClick={() => setAnswers([])} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
                      <RotateCcw size={14} aria-hidden /> Start over
                    </button>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
