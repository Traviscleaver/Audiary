/**
 * ratingScale.js
 *
 * DB scale: 0.0–5.0 (NUMERIC(2,1))
 * UI scale: 0.0–5.0 stars in 0.5 increments
 *
 * We normalize input to:
 * - clamp [0..5]
 * - snap to 0.5 step
 * - max 1 decimal place (DB is NUMERIC(2,1))
 */

export function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
}

export function roundToOneDecimal(num) {
  return Math.round(num * 10) / 10;
}

export function normalizeStars(stars) {
  const clamped = clamp(Number(stars ?? 0), 0, 5);
  const halfStep = Math.round(clamped * 2) / 2; // 0.5 increments
  return roundToOneDecimal(halfStep);
}
