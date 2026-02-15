// app/shared/hooks/review/useReviewDraft.js
import { useMemo, useState } from "react";

// ratingnumber is now 0.1–10.0 in 0.1 steps
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function round1(n) {
  return Math.round(n * 10) / 10;
}
function normalizeRating(v, min = 0.1, max = 10.0) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 5.0;
  return clamp(round1(n), min, max);
}

export default function useReviewDraft(
  initial = { ratingNumber: 5.0, title: "", content: "" }
) {
  const [draft, setDraft] = useState({
    ratingNumber: normalizeRating(initial?.ratingNumber ?? 5.0),
    title: initial?.title || "",
    content: initial?.content || "",
  });

  const [errors, setErrors] = useState({});

  // ✅ ratingnumber setter
  const setRatingnumber = (v) => {
    const next = normalizeRating(v);
    setDraft((d) => ({ ...d, ratingNumber: next }));
    setErrors((e) => ({
      ...e,
      ratingnumber: next >= 0.1 ? null : "Rating is required.",
    }));
  };

  // ✅ title required setter
  const setTitle = (v) => {
    const next = String(v ?? "");
    setDraft((d) => ({ ...d, title: next }));
    setErrors((e) => ({
      ...e,
      title: next.trim().length > 0 ? null : "Title is required",
    }));
  };

  const setContent = (v) => setDraft((d) => ({ ...d, content: v }));

  const validate = () => {
    const nextErrors = {};

    const r = normalizeRating(draft.ratingNumber);
    if (!Number.isFinite(r) || r < 0.1) nextErrors.ratingnumber = "Rating is required.";

    if (!String(draft.title || "").trim()) nextErrors.title = "Title is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isValid = useMemo(() => {
    const ratingOk =
      Number.isFinite(draft.ratingNumber) && draft.ratingNumber >= 0.1;
    const titleOk = String(draft.title || "").trim().length > 0;
    return ratingOk && titleOk;
  }, [draft.ratingNumber, draft.title]);

  const reset = (next = { ratingNumber: 5.0, title: "", content: "" }) => {
    setDraft({
      ratingNumber: normalizeRating(next?.ratingNumber ?? 5.0),
      title: next?.title || "",
      content: next?.content || "",
    });
    setErrors({});
  };

  return {
    draft,
    errors,
    isValid,
    validate,
    reset,

    // setters
    setRatingnumber,
    setTitle,
    setContent,
  };
}
