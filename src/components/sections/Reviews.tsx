"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, ChevronLeft, ChevronRight, Quote, Star, X } from "lucide-react";
import type { ReviewItem, ReviewsSection } from "@/config/types";
import { getSite } from "@/config/site";
import { Stars } from "@/components/ui/Stars";
import { loadStoredReviews, saveStoredReview, type StoredReview } from "@/lib/reviews-storage";
import { useUI } from "@/store/cart";

type DisplayReview = ReviewItem & { id: string; submittedByUser?: true };

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatSubmittedDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return "Recently";
  }
}

function StarPicker({ value, onChange, large }: { value: number; onChange: (n: number) => void; large?: boolean }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  const size = large ? 36 : 28;
  return (
    <div className="flex gap-1.5 sm:gap-1" role="group" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          className="rounded-sm p-1 transition-transform active:scale-95 sm:p-0.5 sm:hover:scale-110"
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          aria-pressed={value === n}
        >
          <Star size={size} className={n <= display ? "text-accent" : "text-line"} fill={n <= display ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, tone }: { review: DisplayReview; tone: string }) {
  const isUser = review.submittedByUser;
  const dateLabel = review.date ?? (isUser && "createdAt" in review ? formatSubmittedDate((review as StoredReview).createdAt) : undefined);

  return (
    <li
      className={`group flex w-[calc(100vw-2.5rem)] max-w-[360px] shrink-0 snap-center flex-col rounded-lg border-2 border-line p-5 shadow-[3px_3px_0_var(--c-line)] sm:w-[340px] sm:snap-start sm:p-6 sm:shadow-[4px_4px_0_var(--c-line)] md:w-[360px] md:p-7 md:hover:-translate-y-0.5 md:hover:border-ink md:hover:shadow-[6px_6px_0_var(--c-ink)] ${tone}`}
    >
      <div className="flex items-start justify-between gap-3">
        <Quote className="h-7 w-7 shrink-0 opacity-20 sm:h-8 sm:w-8" aria-hidden />
        {isUser && (
          <span className="rounded-full bg-pop px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pop-ink">Your review</span>
        )}
      </div>
      <Stars rating={review.rating} size={18} className="mt-3" />
      <p className="mt-3 text-lg font-bold leading-snug sm:mt-4 sm:text-xl md:text-2xl" style={{ fontFamily: "var(--f-heading)" }}>
        {review.title}
      </p>
      <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed opacity-85 sm:mt-3 sm:text-[0.975rem] md:text-base">{review.body}</p>
      <div className="mt-5 border-t border-current/10 pt-4 sm:mt-6 sm:pt-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/10 text-xs font-bold sm:h-11 sm:w-11 sm:text-sm" aria-hidden>
            {initials(review.name)}
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-sm">{review.name}</strong>
            <span className="block text-xs opacity-70">{review.pet}</span>
          </div>
          {dateLabel && <time className="shrink-0 text-[11px] opacity-60 sm:hidden">{dateLabel}</time>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {(review.verified || isUser) && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted">
              <BadgeCheck size={14} className="shrink-0 text-accent" aria-hidden />
              {isUser ? "Saved on this device" : "Verified purchase"}
            </span>
          )}
          {review.product && (
            <span className="rounded-full border border-current/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-80">{review.product}</span>
          )}
          {dateLabel && <time className="hidden text-[11px] opacity-60 sm:inline">{dateLabel}</time>}
        </div>
      </div>
    </li>
  );
}

function ReviewFormFields({
  rating,
  setRating,
  name,
  setName,
  pet,
  setPet,
  product,
  setProduct,
  productOptions,
  title,
  setTitle,
  body,
  setBody,
  inputClass,
  onSubmit,
  onCancel,
  largeStars,
}: {
  rating: number;
  setRating: (n: number) => void;
  name: string;
  setName: (v: string) => void;
  pet: string;
  setPet: (v: string) => void;
  product: string;
  setProduct: (v: string) => void;
  productOptions: string[];
  title: string;
  setTitle: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
  inputClass: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  largeStars?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <span className="text-sm font-semibold">Rating</span>
        <StarPicker value={rating} onChange={setRating} large={largeStars} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Your name
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Bea R." autoComplete="name" />
        </label>
        <label className="block text-sm font-semibold">
          Your dog
          <input required value={pet} onChange={(e) => setPet(e.target.value)} className={inputClass} placeholder="Mochi, Shih Tzu" />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Product <span className="font-normal text-muted">(optional)</span>
        <select value={product} onChange={(e) => setProduct(e.target.value)} className={inputClass}>
          <option value="">—</option>
          {productOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Headline
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Finally, normal poops" maxLength={120} />
      </label>
      <label className="block text-sm font-semibold">
        Your experience
        <textarea required value={body} onChange={(e) => setBody(e.target.value)} className={`${inputClass} min-h-[100px] resize-y`} placeholder="What changed for your dog?" maxLength={2000} rows={4} />
      </label>
      <div className="flex flex-col gap-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button type="submit" className="btn btn-primary w-full">
          Submit review
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="min-h-11 text-sm font-semibold text-muted hover:text-ink">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export function Reviews({ section }: { section: ReviewsSection }) {
  const siteId = getSite().id;
  const { toast } = useUI();
  const track = useRef<HTMLUListElement>(null);
  const writePanelRef = useRef<HTMLDivElement>(null);
  const [stored, setStored] = useState<StoredReview[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [pet, setPet] = useState("");
  const [product, setProduct] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    setStored(loadStoredReviews(siteId));
  }, [siteId]);

  useEffect(() => {
    if (!formOpen || submitted) return;
    const mq = window.matchMedia("(max-width: 1023px)");
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [formOpen, submitted]);

  const productOptions = useMemo(() => {
    const fromReviews = section.reviews.map((r) => r.product).filter(Boolean) as string[];
    return [...new Set(fromReviews)].sort();
  }, [section.reviews]);

  const allReviews = useMemo((): DisplayReview[] => {
    const config: DisplayReview[] = section.reviews.map((r, i) => ({
      ...r,
      id: r.id ?? `config-${i}-${r.name}`,
    }));
    const user: DisplayReview[] = stored.map((r) => ({ ...r, submittedByUser: true }));
    return [...user, ...config];
  }, [section.reviews, stored]);

  const stats = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    let sum = 0;
    for (const r of allReviews) {
      const bucket = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
      counts[bucket]++;
      sum += r.rating;
    }
    const total = allReviews.length;
    const average = total ? sum / total : 0;
    return { counts, total, average };
  }, [allReviews]);

  const updateActiveIndex = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    if (!card) return;
    const cardWidth = card.clientWidth + 16;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(allReviews.length - 1, Math.max(0, index)));
  }, [allReviews.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    updateActiveIndex();
    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);
    return () => {
      el.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex, allReviews.length]);

  const scroll = useCallback(
    (dir: number) => {
      const el = track.current;
      if (!el) return;
      const card = el.querySelector("li");
      el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 16), behavior: "smooth" });
    },
    [],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = track.current;
      if (!el) return;
      const card = el.querySelector("li");
      el.scrollTo({ left: index * ((card?.clientWidth ?? 320) + 16), behavior: "smooth" });
    },
    [],
  );

  const openForm = useCallback(() => {
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
  }, []);

  const tones = ["bg-surface", "bg-accent text-accent-ink", "bg-surface-alt", "bg-surface"];

  const resetForm = () => {
    setRating(5);
    setName("");
    setPet("");
    setProduct("");
    setTitle("");
    setBody("");
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pet.trim() || !title.trim() || !body.trim()) {
      toast("Please fill in all required fields");
      return;
    }
    const review: StoredReview = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      pet: pet.trim(),
      rating,
      title: title.trim(),
      body: body.trim(),
      product: product || undefined,
      createdAt: new Date().toISOString(),
      submittedByUser: true,
      verified: false,
    };
    saveStoredReview(siteId, review);
    setStored((prev) => [review, ...prev]);
    setSubmitted(true);
    setFormOpen(false);
    toast("Thanks — your review was saved");
    track.current?.scrollTo({ left: 0, behavior: "smooth" });
    setActiveIndex(0);
  };

  const inputClass =
    "mt-1.5 w-full rounded-sm border-2 border-line bg-bg px-3 py-3 text-base transition-colors placeholder:text-muted/70 focus:border-ink focus:outline-none sm:py-2.5 sm:text-sm";

  const thanksBlock = (
    <div className="text-center">
      <p className="text-lg font-bold">Thank you!</p>
      <p className="mt-2 text-sm text-muted">Your review appears first in the carousel. On this demo, it&apos;s saved in your browser only — wire up a backend before launch.</p>
      <button
        type="button"
        onClick={() => {
          resetForm();
          setFormOpen(false);
        }}
        className="btn btn-ghost mt-6 w-full"
      >
        Write another
      </button>
    </div>
  );

  return (
    <section id="reviews" className="scroll-mt-24 py-12 md:py-24">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:items-start lg:gap-14">
          <div className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h2 className="display text-[clamp(2rem,8vw,3.75rem)] leading-none md:text-6xl">{section.heading}</h2>
                {section.sample && (
                  <p className="mt-3 block rounded-md bg-surface-alt px-3 py-2 text-[11px] font-semibold leading-snug text-muted sm:inline-block sm:rounded-full sm:py-1 sm:text-xs">
                    Sample reviews — replace with real customer reviews before launch
                  </p>
                )}
              </div>
              <div className="hidden gap-2 sm:flex">
                <button type="button" onClick={() => scroll(-1)} className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink transition-colors hover:bg-ink hover:text-bg" aria-label="Previous reviews">
                  <ChevronLeft size={20} aria-hidden />
                </button>
                <button type="button" onClick={() => scroll(1)} className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink transition-colors hover:bg-ink hover:text-bg" aria-label="Next reviews">
                  <ChevronRight size={20} aria-hidden />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-5 rounded-lg border-2 border-line bg-surface-alt p-4 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 sm:p-6 md:gap-12">
              <div className="flex items-center gap-4 sm:items-baseline sm:gap-2">
                <span className="display text-4xl sm:text-5xl md:text-6xl">{stats.average.toFixed(1)}</span>
                <div>
                  <Stars rating={stats.average} size={18} className="sm:hidden" />
                  <Stars rating={stats.average} size={20} className="hidden sm:inline-flex" />
                  <p className="mt-1 text-sm text-muted">{stats.total} reviews</p>
                </div>
              </div>
              <ul className="w-full space-y-1.5 sm:min-w-[200px] sm:flex-1" aria-label="Rating breakdown">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = stats.counts[stars - 1];
                  const pct = stats.total ? (count / stats.total) * 100 : 0;
                  return (
                    <li key={stars} className="flex items-center gap-2 text-xs font-semibold">
                      <span className="w-3 tabular-nums">{stars}</span>
                      <Star size={12} className="shrink-0 opacity-60" fill="currentColor" aria-hidden />
                      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-line sm:h-2">
                        <span className="block h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="w-8 text-right tabular-nums text-muted">{count}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <button
              type="button"
              onClick={openForm}
              className="btn btn-accent mt-5 w-full lg:hidden"
            >
              Share your story
            </button>

            <div className="relative mt-6 sm:mt-8">
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-bg to-transparent sm:w-12 lg:hidden"
                aria-hidden
              />
              <ul
                ref={track}
                className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[max(1rem,calc((100vw-1240px)/2+1rem))] px-4 pb-1 sm:mx-0 sm:scroll-px-0 sm:px-0 lg:-mr-4 lg:pr-4"
              >
                {allReviews.map((r, i) => (
                  <ReviewCard key={r.id} review={r} tone={tones[i % tones.length]} />
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 sm:hidden">
              <div className="flex flex-1 justify-center gap-1.5" aria-label={`Review ${activeIndex + 1} of ${allReviews.length}`}>
                {allReviews.length <= 8 ? (
                  allReviews.map((r, i) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => scrollToIndex(i)}
                      className={`h-2 rounded-full transition-all ${i === activeIndex ? "w-6 bg-ink" : "w-2 bg-line"}`}
                      aria-label={`Go to review ${i + 1}`}
                      aria-current={i === activeIndex ? "true" : undefined}
                    />
                  ))
                ) : (
                  <span className="text-xs font-semibold text-muted">
                    {activeIndex + 1} / {allReviews.length}
                  </span>
                )}
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button type="button" onClick={() => scroll(-1)} className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink active:bg-ink active:text-bg" aria-label="Previous review">
                  <ChevronLeft size={18} aria-hidden />
                </button>
                <button type="button" onClick={() => scroll(1)} className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink active:bg-ink active:text-bg" aria-label="Next review">
                  <ChevronRight size={18} aria-hidden />
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] font-medium text-muted sm:hidden">Swipe to read more reviews</p>
          </div>

          <div ref={writePanelRef} id="write-review" className="hidden scroll-mt-28 lg:block lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-lg border-2 border-ink bg-surface shadow-[6px_6px_0_var(--c-ink)]">
              <div className="border-b border-line bg-accent px-6 py-4 text-accent-ink">
                <h3 className="text-xl font-bold" style={{ fontFamily: "var(--f-heading)" }}>
                  Write a review
                </h3>
                <p className="mt-1 text-sm opacity-90">Share how our supplements worked for your dog.</p>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="thanks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-6">
                    {thanksBlock}
                  </motion.div>
                ) : formOpen ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                    <ReviewFormFields
                      rating={rating}
                      setRating={setRating}
                      name={name}
                      setName={setName}
                      pet={pet}
                      setPet={setPet}
                      product={product}
                      setProduct={setProduct}
                      productOptions={productOptions}
                      title={title}
                      setTitle={setTitle}
                      body={body}
                      setBody={setBody}
                      inputClass={inputClass}
                      onSubmit={handleSubmit}
                      onCancel={closeForm}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                    <p className="text-sm text-muted">Help other dog parents choose — takes about a minute.</p>
                    <button type="button" onClick={openForm} className="btn btn-accent mt-5 w-full">
                      Share your story
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {formOpen && !submitted && (
          <motion.div
            key="mobile-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-sheet-title"
          >
            <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close review form" onClick={closeForm} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
              className="absolute inset-x-0 bottom-0 flex max-h-[min(92dvh,720px)] flex-col rounded-t-xl border-2 border-b-0 border-ink bg-surface shadow-[0_-8px_40px_rgba(0,0,0,0.15)]"
            >
              <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line bg-accent px-4 py-4 text-accent-ink">
                <div className="min-w-0 pr-2">
                  <h3 id="review-sheet-title" className="text-lg font-bold" style={{ fontFamily: "var(--f-heading)" }}>
                    Write a review
                  </h3>
                  <p className="mt-0.5 text-sm opacity-90">Share how our supplements worked for your dog.</p>
                </div>
                <button type="button" onClick={closeForm} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-accent-ink/30 active:bg-accent-ink/10" aria-label="Close">
                  <X size={20} aria-hidden />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
                <ReviewFormFields
                  rating={rating}
                  setRating={setRating}
                  name={name}
                  setName={setName}
                  pet={pet}
                  setPet={setPet}
                  product={product}
                  setProduct={setProduct}
                  productOptions={productOptions}
                  title={title}
                  setTitle={setTitle}
                  body={body}
                  setBody={setBody}
                  inputClass={inputClass}
                  onSubmit={handleSubmit}
                  onCancel={closeForm}
                  largeStars
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {submitted && (
          <motion.div
            key="mobile-thanks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close" onClick={() => { resetForm(); }} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
              className="relative w-full rounded-t-xl border-2 border-b-0 border-ink bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_40px_rgba(0,0,0,0.15)]"
            >
              {thanksBlock}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
