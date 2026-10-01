"use client";

import type { ReactNode } from "react";

/** Wraps purchase controls in a clear mobile card; hidden on md+. */
export function ProductMobileBuyBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border-2 border-line bg-surface-alt p-4 shadow-[4px_4px_0_var(--c-line)] md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
      {children}
    </div>
  );
}
