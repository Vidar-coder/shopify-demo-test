"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { StorySection } from "@/config/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function Story({ section }: { section: StorySection }) {
  const reduce = useReducedMotion();

  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.5, delay, ease },
        };

  return (
    <section id="story" className="scroll-mt-24 bg-surface-alt">
      <div className="container-x py-12 md:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_1fr] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,440px)_1fr] xl:gap-20">
          {section.stat && (
            <motion.div
              {...fade(0)}
              className="relative overflow-hidden rounded-lg border-2 border-ink bg-pop text-pop-ink shadow-[5px_5px_0_var(--c-ink)] lg:sticky lg:top-28"
            >
              <svg viewBox="0 0 100 100" className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 opacity-25 md:h-48 md:w-48" aria-hidden>
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 32 C 32 44, 32 56, 8 68" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>

              <div className="relative flex items-end gap-4 p-5 sm:gap-6 sm:p-7 md:min-h-[280px] md:flex-col md:items-start md:justify-between md:p-10 lg:aspect-square lg:min-h-0">
                <p
                  className="display shrink-0 text-[clamp(3.25rem,14vw,5.5rem)] font-extrabold leading-[0.85] md:text-[clamp(4.5rem,10vw,7.5rem)] lg:text-[clamp(5rem,9vw,8.5rem)]"
                  style={{ fontFamily: "var(--f-heading)" }}
                >
                  {section.stat.value}
                </p>
                <p
                  className="max-w-[14ch] pb-0.5 text-base font-bold leading-snug sm:text-lg md:max-w-[16ch] md:text-xl lg:text-2xl"
                  style={{ fontFamily: "var(--f-heading)" }}
                >
                  {section.stat.label}
                </p>
              </div>
            </motion.div>
          )}

          <div className="min-w-0">
            <motion.h2 {...fade(0.05)} className="display text-[clamp(1.875rem,6.5vw,3.75rem)] leading-[1.02] lg:max-w-[14ch]">
              {section.heading}
            </motion.h2>

            <div className="mt-4 space-y-4 sm:mt-5">
              {section.body.map((p, i) => (
                <motion.p key={i} {...fade(0.1 + i * 0.06)} className="max-w-prose text-base leading-relaxed text-muted sm:text-lg">
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3 md:gap-5">
          {section.points.map((pt, i) => (
            <motion.li
              key={pt.title}
              {...fade(0.12 + i * 0.07)}
              className="h-full rounded-md border-2 border-line bg-bg p-4 shadow-[3px_3px_0_var(--c-line)] sm:p-5"
            >
              <div className="flex h-full gap-3 md:flex-col md:gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-ink sm:h-9 sm:w-9">
                  <Check size={16} strokeWidth={3} aria-hidden />
                </span>
                <div className="min-w-0">
                  <strong className="block text-base leading-snug sm:text-lg">{pt.title}</strong>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">{pt.body}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
