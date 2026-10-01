"use client";

import { motion } from "motion/react";
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "./ProductCard";

export function RelatedProducts({ products, brand }: { products: Product[]; brand: string }) {
  if (!products.length) return null;

  return (
    <section className="py-12 md:py-24">
      <div className="container-x">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="display text-[clamp(1.75rem,6vw,3rem)]"
        >
          Pairs well with
        </motion.h2>
      </div>

      <ul className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 md:hidden">
        {products.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="w-[min(78vw,300px)] shrink-0 snap-center"
          >
            <ProductCard product={p} brand={brand} />
          </motion.li>
        ))}
      </ul>

      <div className="container-x mt-8 hidden grid-cols-2 gap-x-4 gap-y-10 md:grid md:gap-x-6 lg:grid-cols-3">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <ProductCard product={p} brand={brand} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
