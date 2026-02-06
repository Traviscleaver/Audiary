// app/review/components/ReviewForm.jsx
import React from "react";
import { Text, TextInput, TouchableOpacity, View, COLORS } from "../../shared/imports";
import StarRating from "./StarRating";

/**
 * ReviewForm
 *
 * UI-only component.
 * - Content is optional.
 * - Rating is required.
 */
export default function ReviewForm({
  stars,
  setStars,
  content,
  setContent,
  errors = {},
  submitting = false,
  onSubmit,
  targetType = "song",
}) {
  const placeholder =
    targetType === "album"
      ? "Write your thoughts about this album (optional)…"
      : "Write your thoughts about this song (optional)…";

  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ fontSize: 14, marginBottom: 8, color: COLORS.subtext }}>
        Your rating
      </Text>

      <StarRating value={stars} onChange={setStars} disabled={submitting} />

      {!!errors.stars && (
        <Text style={{ marginTop: 6, color: COLORS.danger || "#ff6b6b" }}>
          {errors.stars}
        </Text>
      )}

      <Text style={{ fontSize: 14, marginTop: 16, marginBottom: 8, color: COLORS.subtext }}>
        Review (optional)
      </Text>

      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder={placeholder}
        placeholderTextColor={COLORS.subtext}
        multiline
        style={{
          minHeight: 120,
          borderRadius: 14,
          padding: 12,
          backgroundColor: COLORS.card || "rgba(255,255,255,0.06)",
          color: COLORS.text,
          textAlignVertical: "top",
        }}
        editable={!submitting}
      />

      <TouchableOpacity
        onPress={onSubmit}
        disabled={submitting}
        style={{
          marginTop: 16,
          borderRadius: 14,
          paddingVertical: 12,
          alignItems: "center",
          backgroundColor: submitting ? "rgba(255,255,255,0.12)" : COLORS.primary,
        }}
      >
        <Text style={{ fontWeight: "700", color: COLORS.text }}>
          {submitting ? "Saving…" : "Save"}
        </Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 10, color: COLORS.subtext, fontSize: 12 }}>
        Leaving the review blank still saves your rating.
      </Text>
    </View>
  );
}
