// app/shared/components/review/StaticStarRating.jsx
import { FontAwesome } from "@expo/vector-icons";
import { useMemo } from "react";
import { COLORS, Text, View } from "../../imports";

function normalizeStars(v) {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return 0;
  const clamped = Math.max(0, Math.min(5, n));
  return Math.round(clamped * 2) / 2; // 0.5 steps
}

export default function StaticStarRating({
  value = 0,
  size = 24,
  showNumber = false,
  numberText = "",
  activeColor,
  outlineColor,
  style,
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

  const active = activeColor || COLORS.active || "#22c55e";
  const outline = outlineColor || COLORS.subtext || "rgba(255,255,255,0.55)";

  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      {stars.map((fill, idx) => (
        <View key={`star-${idx}`} style={{ width: size, height: size, marginRight: 4 }}>
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
                width: size * fill, // 0.5 = half
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
      ))}

      {showNumber ? (
        <Text style={{ marginLeft: 6, color: COLORS.subtext, fontWeight: "800" }}>
          {numberText || normalized.toFixed(1)}
        </Text>
      ) : null}
    </View>
  );
}
