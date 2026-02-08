// app/shared/components/review/ReviewForm.jsx
import React, { useMemo } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import StarRating from "./StarRating";
import { styles } from "./styles/styles";

export default function ReviewForm({
  stars,
  setStars,

  title,
  setTitle,

  content,
  setContent,

  errors = {},
  submitting = false,
  onSubmit,
  targetType = "song",
}) {
  const placeholder = useMemo(() => {
    return targetType === "album"
      ? "Write your thoughts about this album (optional)…"
      : "Write your thoughts about this song (optional)…";
  }, [targetType]);

  const titlePlaceholder = useMemo(() => {
    return "Title";
  }, []);

  return (
    <View style={{ marginTop: 14 }}>
      <Text style={[styles.label, styles.labelSpacingBottom]}>Your rating</Text>

      <StarRating value={stars} onChange={setStars} disabled={submitting} />

      {!!errors.stars && <Text style={styles.errorText}>{errors.stars}</Text>}

      <Text style={[styles.label, styles.labelSpacingTop]}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder={titlePlaceholder}
        placeholderTextColor={styles.label.color}
        style={styles.titleInput}
        editable={!submitting}
      />

      <Text style={[styles.label, styles.labelSpacingTop]}>Review (optional)</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder={placeholder}
        placeholderTextColor={styles.label.color}
        multiline
        style={styles.textInput}
        editable={!submitting}
      />

      <TouchableOpacity
        onPress={onSubmit}
        disabled={submitting}
        style={[
          styles.saveBtn,
          submitting ? styles.saveBtnDisabled : styles.saveBtnEnabled,
        ]}
        activeOpacity={0.85}
      >
        <Text style={styles.saveBtnText}>
          {submitting ? "Meow..." : "Review"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
