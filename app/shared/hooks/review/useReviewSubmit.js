// app/shared/hooks/review/useReviewSubmit.js
import { useState } from "react";
import { submitReview as submitReviewImpl } from "../../imports";

export default function useReviewSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async ({ target, draft }) => {
    if (!submitReviewImpl) {
      throw new Error(
        'Missing submitReview export. Add `export async function submitReview({ target, draft }) { ... }` to app/shared/imports.js'
      );
    }

    setSubmitting(true);
    setError(null);

    try {
      // ✅ ensure title exists in the draft object (even if empty)
      const safeDraft = {
        stars: draft?.stars ?? 0,
        title: typeof draft?.title === "string" ? draft.title : "", // ✅ added
        content: typeof draft?.content === "string" ? draft.content : "",
      };

      // Helpful debug (remove later)
      console.log("📤 useReviewSubmit sending:", { target, draft: safeDraft });

      await submitReviewImpl({ target, draft: safeDraft });
    } catch (e) {
      setError(e?.message || "Save failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting, error };
}
