"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductArt, ProductImage } from "@/lib/commerce/types";

export type CartLine = {
  key: string;
  handle: string;
  variantId: string;
  title: string;
  variantTitle?: string;
  unitPrice: number; // after subscription discount
  compareAtPrice?: number;
  currencyCode: string;
  quantity: number;
  sellingPlanId?: string;
  sellingPlanName?: string;
  bundleDiscount?: number; // percent, applied at checkout
  image?: ProductImage;
  art?: ProductArt;
};

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "key">) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const lineKey = (l: Omit<CartLine, "key">) =>
  [l.variantId, l.sellingPlanId ?? "once", l.bundleDiscount ?? 0].join("|");

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line) =>
        set((s) => {
          const key = lineKey(line);
          const existing = s.lines.find((l) => l.key === key);
          if (existing) {
            return { lines: s.lines.map((l) => (l.key === key ? { ...l, quantity: l.quantity + line.quantity } : l)) };
          }
          return { lines: [...s.lines, { ...line, key }] };
        }),
      setQuantity: (key, quantity) =>
        set((s) => ({
          lines: quantity <= 0 ? s.lines.filter((l) => l.key !== key) : s.lines.map((l) => (l.key === key ? { ...l, quantity } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    // Rehydrated in <Providers> after mount to avoid SSR hydration mismatches.
    { name: "storefront-cart", version: 1, skipHydration: true },
  ),
);

export function cartTotals(lines: CartLine[]) {
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
  const bundleSavings = lines.reduce((n, l) => n + (l.unitPrice * l.quantity * (l.bundleDiscount ?? 0)) / 100, 0);
  return { count, subtotal, bundleSavings, total: subtotal - bundleSavings };
}

/* ---------- UI state (not persisted) ---------- */

type Toast = { id: number; message: string };

type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  quickViewHandle: string | null;
  toasts: Toast[];
  openCart: () => void;
  closeCart: () => void;
  setSearch: (open: boolean) => void;
  setMenu: (open: boolean) => void;
  quickView: (handle: string | null) => void;
  toast: (message: string) => void;
};

export const useUI = create<UIState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  quickViewHandle: null,
  toasts: [],
  openCart: () => set({ cartOpen: true, searchOpen: false, menuOpen: false, quickViewHandle: null }),
  closeCart: () => set({ cartOpen: false }),
  setSearch: (open) => set({ searchOpen: open, menuOpen: false }),
  setMenu: (open) => set({ menuOpen: open }),
  quickView: (handle) => set({ quickViewHandle: handle }),
  toast: (message) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2800);
  },
}));
