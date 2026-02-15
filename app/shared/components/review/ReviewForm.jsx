// app/shared/components/review/ReviewForm.jsx
import React, { useMemo, useRef } from "react";
import { Text, TextInput, View } from "react-native";
import RatingBar from "./RatingBar";
import { styles } from "./styles/styles";

export default function ReviewForm({
  ratingnumber,
  setRatingnumber,

  title,
  setTitle,

  content,
  setContent,

  errors = {},
  submitting = false,
  targetType = "song",

  scrollToInput, // ✅ provided by ReviewOverlaySheet
}) {
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const placeholder = useMemo(() => {
    return targetType === "album"
      ? "Write your thoughts about this album (optional)…"
      : "Write your thoughts about this song (optional)…";
  }, [targetType]);

  return (
    <View style={{ marginTop: 14 }}>
      {/* Rating bar */}
      <RatingBar
        value={ratingnumber}
        onChange={setRatingnumber}
        disabled={submitting}
      />

      {!!errors.ratingNumber && (
        <Text style={styles.errorText}>{errors.ratingNumber}</Text>
      )}

      {/* Title input */}
      <TextInput
        ref={titleRef}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={"rgba(255,255,255,0.45)"}
        style={styles.titleInput}
        editable={!submitting}
        onFocus={() => scrollToInput?.(titleRef)}
        returnKeyType="next"
      />

      {!!errors.title && (
        <Text style={styles.inlineErrorUnderInput}>{errors.title}</Text>
      )}

      {/* Review input */}
      <TextInput
        ref={contentRef}
        value={content}
        onChangeText={setContent}
        placeholder={placeholder}
        placeholderTextColor={"rgba(255,255,255,0.45)"}
        multiline
        style={styles.textInput}
        editable={!submitting}
        onFocus={() => scrollToInput?.(contentRef)}
      />
    </View>
  );
}
