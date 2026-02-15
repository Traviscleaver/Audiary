// app/shared/components/review/StarRating.jsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { COLORS } from "../../imports";
import { styles } from "./styles/styles";

function normalizeStars(v) {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return 0;
  const clamped = Math.max(0, Math.min(5, n));
  return Math.round(clamped * 2) / 2; // 0.5 steps
}

export default function StarRating({
  value = 0,
  onChange,
  size = 31,
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

  // Easy tap: full -> half -> empty
  const cycleStar = (i) => {
    if (normalized >= i) return set(i - 0.5);
    if (normalized >= i - 0.5) return set(i - 1);
    return set(i);
  };

  const active = COLORS.active || "#22c55e";
  const outline = COLORS.subtext || "rgba(255,255,255,0.55)";
  const touch = Math.max(45, size);

  return (
    <View style={styles.starsRow}>
      {stars.map((fill, idx) => {
        const i = idx + 1;

        return (
          <Pressable
            key={`star-${i}`}
            disabled={disabled}
            onPress={() => cycleStar(i)}
            style={[styles.starPressable, { width: touch, height: touch }]}
            hitSlop={8}
          >
            <View style={{ width: size, height: size }}>
              <FontAwesome
                name="star-o"
                size={size}
                color={outline}
                style={{ position: "absolute", left: 0, top: 0 }}
              />

              {fill > 0 && (
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: size,
                    width: size * fill, // 0.5 = true half fill
                    overflow: "hidden",
                  }}
                >
                  <FontAwesome
                    name="star"
                    size={size}
                    color={active}
                    style={{ position: "absolute", left: 0, top: 0 }}
                  />
                </View>
              )}
            </View>
          </Pressable>
        );
      })}

      {showNumber && <Text style={styles.ratingNumber}>{normalized.toFixed(1)} / 5.0</Text>}
    </View>
  );
}
