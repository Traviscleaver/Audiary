// app/review/hooks/useReviewDraft.js
import { useMemo, useState } from "react";
import { normalizeStars } from "../lib/ratingScale";

/**
 * useReviewDraft
 *
 * Holds local form state:
 * - stars: 0..5 in 0.5 increments
 * - content: optional string (blank means rating-only)
 *
 * Validation:
 * - rating required (stars > 0)
 * - content optional
 */
export default function useReviewDraft(initial = {}) {
  const [stars, setStarsRaw] = useState(
    typeof initial.stars === "number" ? normalizeStars(initial.stars) : 0
  );
  const [content, setContent] = useState(initial.content || "");

  const setStars = (val) => setStarsRaw(normalizeStars(val));

  const errors = useMemo(() => {
    const e = {};
    if (!stars || stars <= 0) e.stars = "Please choose a rating.";
    return e;
  }, [stars]);

  const isValid = Object.keys(errors).length === 0;

  const reset = (next = {}) => {
    setStarsRaw(typeof next.stars === "number" ? normalizeStars(next.stars) : 0);
    setContent(next.content || "");
  };

  return {
    draft: { stars, content },
    setStars,
    setContent,
    reset,
    errors,
    isValid,
  };
}
