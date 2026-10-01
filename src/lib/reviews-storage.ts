import type { ReviewItem } from "@/config/types";

export type StoredReview = ReviewItem & { id: string; createdAt: string; submittedByUser?: true };

const storageKey = (siteId: string) => `storefront:reviews:${siteId}`;

export function loadStoredReviews(siteId: string): StoredReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(siteId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredReview(siteId: string, review: StoredReview) {
  const existing = loadStoredReviews(siteId);
  localStorage.setItem(storageKey(siteId), JSON.stringify([review, ...existing]));
}
