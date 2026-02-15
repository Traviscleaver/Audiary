export function normalizeStars(x) {
  const n = Number(x || 0);
  const clamped = Math.max(0, Math.min(5, n));
  return Math.round(clamped * 2) / 2; // half steps
}
