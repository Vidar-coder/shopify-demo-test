"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import type { IconName, NavLink } from "@/config/types";
import { cartTotals, useCart, useUI } from "@/store/cart";
import { Icon } from "@/components/ui/Icon";

export function AnnouncementBar({ messages }: { messages: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (messages.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, [messages.length]);
  if (!messages.length) return null;
  return (
    <div className="bg-primary text-primary-ink">
      <div className="container-x relative flex h-9 items-center justify-center overflow-hidden text-sm font-medium" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={i}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {messages[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Header({ name, mark, nav }: { name: string; mark?: IconName; nav: NavLink[] }) {
  const lines = useCart((s) => s.lines);
  const { count } = cartTotals(lines);
  const { openCart, setSearch, setMenu, menuOpen } = useUI();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? "bg-bg/85 shadow-[0_1px_0_var(--c-line)] backdrop-blur-md" : "bg-bg"
      }`}
    >
      <div className={`container-x flex items-center gap-4 transition-[height] duration-300 ${scrolled ? "h-16" : "h-20"}`}>
        <button className="-ml-2 grid h-10 w-10 place-items-center rounded-full hover:bg-surface-alt lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
          <Menu size={22} aria-hidden />
        </button>

        <Link href="/" className="group flex items-center gap-2 text-xl font-extrabold tracking-tight" style={{ fontFamily: "var(--f-heading)" }}>
          {mark && (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-300 group-hover:rotate-[-18deg]">
              <Icon name={mark} size={20} />
            </span>
          )}
          {name}
        </Link>

        <nav className="ml-6 hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-1">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-full px-3.5 py-2 text-[0.95rem] font-semibold hover:bg-surface-alt">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setSearch(true)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-alt" aria-label="Search products">
            <Search size={21} aria-hidden />
          </button>
          <button onClick={openCart} className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-surface-alt" aria-label={`Open cart, ${count} items`}>
            <ShoppingBag size={21} aria-hidden />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 600, damping: 14 }}
                  className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-pop px-1 text-[11px] font-bold text-pop-ink"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenu(false)} nav={nav} name={name} />
    </header>
  );
}

function MobileMenu({ open, onClose, nav, name }: { open: boolean; onClose: () => void; nav: NavLink[]; name: string }) {
  useLockBody(open);
  useEscape(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-bg p-5"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-extrabold" style={{ fontFamily: "var(--f-heading)" }}>{name}</span>
              <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-alt" aria-label="Close menu">
                <X size={22} aria-hidden />
              </button>
            </div>
            <ul className="mt-8 space-y-1">
              {nav.map((l, i) => (
                <motion.li key={l.href} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * i + 0.1 }}>
                  <Link href={l.href} onClick={onClose} className="block rounded-sm px-3 py-3 text-2xl font-bold hover:bg-surface-alt" style={{ fontFamily: "var(--f-heading)" }}>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export function useEscape(active: boolean, fn: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && fn();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, fn]);
}
