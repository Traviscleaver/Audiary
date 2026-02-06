// app/review/hooks/useReviewSubmit.js
import { useCallback, useState } from "react";
import { normalizeStars } from "../lib/ratingScale";
import { buildUpsertReviewPayload } from "../lib/reviewPayload";
import { upsertReview } from "../../../lib/api";

/**
 * useReviewSubmit
 *
 * Since review == rating, we always upsert a single row in `reviews`.
 * - content may be blank ("") to represent rating-only
 *
 * Expected server behavior:
 * - If a review already exists for (user_id, target), update it.
 * - Else insert.
 */
export default function useReviewSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(async ({ target, draft }) => {
    setSubmitting(true);
    setError(null);

    try {
      const rating = normalizeStars(draft?.stars ?? 0);
      const content = draft?.content ?? "";

      if (!target) throw new Error("Missing target");
      if (!rating || rating <= 0) throw new Error("Missing rating");

      const payload = buildUpsertReviewPayload({ target, rating, content });
      const res = await upsertReview(payload);
      return res;
    } catch (e) {
      setError(e?.message || "Submit failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting, error };
}
