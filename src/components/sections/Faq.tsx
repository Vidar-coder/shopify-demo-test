"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import type { FaqSection } from "@/config/types";

export function Faq({ section }: { section: FaqSection }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="container-x scroll-mt-24 py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <h2 className="display text-4xl md:sticky md:top-28 md:self-start md:text-6xl">{section.heading}</h2>
        <ul className="border-t-2 border-ink">
          {section.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-line">
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-bold md:text-xl"
                    style={{ fontFamily: "var(--f-body)", letterSpacing: 0 }}
                  >
                    {item.q}
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${isOpen ? "bg-accent text-accent-ink" : "bg-surface-alt"}`}>
                      <Plus size={18} aria-hidden />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="max-w-[60ch] pb-6 text-muted">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
