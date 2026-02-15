// app/shared/hooks/review/useReviewDraft.js
import { useMemo, useState } from "react";
import { normalizeStars } from "../../lib/review/ratingScale";

export default function useReviewDraft(initial = { stars: 0, title: "", content: "" }) {
  const [draft, setDraft] = useState({
    stars: normalizeStars(initial?.stars || 0),
    title: initial?.title || "",     // ✅ add title
    content: initial?.content || "",
  });

  const [errors, setErrors] = useState({});

  const setStars = (v) => {
    const next = normalizeStars(v);
    setDraft((d) => ({ ...d, stars: next }));
    setErrors((e) => ({ ...e, stars: next > 0 ? null : "Rating is required." }));
  };

  // ✅ add setTitle
  const setTitle = (v) => setDraft((d) => ({ ...d, title: v }));

  const setContent = (v) => setDraft((d) => ({ ...d, content: v }));

  const validate = () => {
    const nextErrors = {};
    if (!draft.stars || draft.stars <= 0) nextErrors.stars = "Rating is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isValid = useMemo(() => {
    return !!draft.stars && draft.stars > 0;
  }, [draft.stars]);

  const reset = (next = { stars: 0, title: "", content: "" }) => {
    setDraft({
      stars: normalizeStars(next.stars || 0),
      title: next.title || "",        // ✅ reset title
      content: next.content || "",
    });
    setErrors({});
  };

  // ✅ return setTitle too
  return { draft, setStars, setTitle, setContent, errors, isValid, validate, reset };
}
