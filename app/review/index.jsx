// app/review/index.jsx
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  View,
  useSafeAreaInsets,
  COLORS,
} from "../shared/imports";
import { useLocalSearchParams, useRouter } from "expo-router";
import SearchPickerOverlay from "./components/SearchPickerOverlay";
import SelectedTargetCard from "./components/SelectedTargetCard";
import ReviewForm from "./components/ReviewForm";

import useReviewTarget from "./hooks/useReviewTarget";
import useReviewDraft from "./hooks/useReviewDraft";
import useReviewSubmit from "./hooks/useReviewSubmit";

import { styles } from "./styles/styles";

/**
 * ReviewScreen (expo-router)
 *
 * Query params:
 * - spotifyType?: "track" | "album"
 * - targetType?: "song" | "album" (legacy)
 * - spotifyId?: string
 */
export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams?.() || {};

  const spotifyType = params.spotifyType ? params.spotifyType.toString() : null;
  const legacyTargetType = params.targetType ? params.targetType.toString() : null;
  const spotifyId = params.spotifyId ? params.spotifyId.toString() : null;

  const initialTargetType = useMemo(() => {
    if (spotifyType === "track") return "song";
    if (spotifyType === "album") return "album";
    if (legacyTargetType === "song" || legacyTargetType === "album") return legacyTargetType;
    return "song";
  }, [spotifyType, legacyTargetType]);

  const [targetType, setTargetType] = useState(initialTargetType);
  const [searchVisible, setSearchVisible] = useState(!spotifyId);

  const { target, loading, error: targetError, setPickedItem, clearTarget } =
    useReviewTarget({ targetType, spotifyId });

  const { draft, setStars, setContent, errors, isValid, reset } = useReviewDraft({
    stars: 0,
    content: "",
  });

  const { submit, submitting, error: submitError } = useReviewSubmit();

  const title = useMemo(
    () => (targetType === "album" ? "Rate Album" : "Rate Song"),
    [targetType]
  );

  const onPick = (payload) => {
    try {
      const item = payload?.item ? payload.item : payload;

      const pickedSpotifyType = payload?.spotifyType ? payload.spotifyType.toString() : null;
      const pickedTargetType = payload?.targetType ? payload.targetType.toString() : null;

      let nextTargetType = null;
      if (pickedSpotifyType === "track") nextTargetType = "song";
      if (pickedSpotifyType === "album") nextTargetType = "album";
      if (pickedTargetType === "song" || pickedTargetType === "album") nextTargetType = pickedTargetType;

      if (nextTargetType && nextTargetType !== targetType) {
        setTargetType(nextTargetType);
      }

      setPickedItem(item);
      setSearchVisible(false);
      reset({ stars: 0, content: "" });
    } catch (e) {
      Alert.alert("Pick failed", e?.message || "Missing spotify_id in item");
    }
  };

  const onSubmit = async () => {
    if (!target) {
      Alert.alert("Missing selection", "Please pick something to rate.");
      return;
    }
    if (!isValid) {
      Alert.alert("Fix errors", errors.stars || "Please complete the form.");
      return;
    }

    try {
      await submit({ target, draft });
      Alert.alert("Saved", "Your rating was saved.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {}
  };

  return (
    <View style={styles.screen}>
      <SearchPickerOverlay
        visible={searchVisible}
        onClose={(reason) => {
          setSearchVisible(false);
          if (reason !== "pick" && !target && !spotifyId) router.back();
        }}
        onPick={onPick}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 14,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        {/* ✅ Make title readable */}
        <Text style={styles.title}>{title}</Text>

        {!target && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Pick a {targetType === "album" ? "album" : "song"} to rate.
            </Text>

            {/* ✅ Make link readable (lighter grey/white) */}
            <Text onPress={() => setSearchVisible(true)} style={styles.link}>
              Open search
            </Text>
          </View>
        )}

        {!!targetError && <Text style={styles.errorText}>{targetError}</Text>}
        {!!submitError && <Text style={styles.errorText}>{submitError}</Text>}

        {target && (
          <>
            <SelectedTargetCard
              target={target}
              onChangePress={() => setSearchVisible(true)}
              onClosePress={() => {
                clearTarget();
                setSearchVisible(true);
              }}
            />

            <View style={{ marginTop: 10, opacity: loading ? 0.6 : 1 }}>
              <ReviewForm
                targetType={target.targetType}
                stars={draft.stars}
                setStars={setStars}
                content={draft.content}
                setContent={setContent}
                errors={errors}
                submitting={submitting || loading}
                onSubmit={onSubmit}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
