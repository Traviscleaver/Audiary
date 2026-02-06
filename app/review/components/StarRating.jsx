// app/review/components/RatingStars.jsx
import React, { useMemo } from "react";
import { Feather, TouchableOpacity, View, Text, COLORS } from "../../shared/imports";
import { normalizeStars } from "../lib/ratingScale";

/**
 * StarRating
 *
 * Controlled rating selector:
 * - value: 0..5
 * - onChange(next: number)
 *
 * Supports half-star increments with two tap zones per star.
 *
 * Note: Feather doesn't have a true half-star icon.
 * We represent half-stars using reduced opacity.
 */
export default function StarRating({
  value = 0,
  onChange,
  size = 22,
  disabled = false,
  showNumber = true,
}) {
  const normalized = useMemo(() => normalizeStars(value), [value]);

  const stars = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      if (normalized >= i) arr.push(1);
      else if (normalized >= i - 0.5) arr.push(0.5);
      else arr.push(0);
    }
    return arr;
  }, [normalized]);

  const set = (next) => {
    if (disabled) return;
    onChange?.(normalizeStars(next));
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {stars.map((s, idx) => {
        const i = idx + 1;
        const opacity = s === 0 ? 0.25 : s === 0.5 ? 0.55 : 1;

        return (
          <View key={`star-${i}`} style={{ flexDirection: "row" }}>
            <TouchableOpacity
              disabled={disabled}
              onPress={() => set(i - 0.5)}
              style={{ padding: 6 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 0 }}
            >
              <Feather name="star" size={size} color={COLORS.text} style={{ opacity }} />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={disabled}
              onPress={() => set(i)}
              style={{ padding: 6, marginLeft: -12 }}
              hitSlop={{ top: 8, bottom: 8, left: 0, right: 8 }}
            >
              <Feather name="star" size={size} color={COLORS.text} style={{ opacity }} />
            </TouchableOpacity>
          </View>
        );
      })}

      {showNumber && (
        <Text style={{ marginLeft: 10, color: COLORS.subtext }}>
          {normalized.toFixed(1)} / 5.0
        </Text>
      )}
    </View>
  );
}
