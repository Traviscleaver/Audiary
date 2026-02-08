// app/shared/components/review/ReviewOverlaySheet.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "../../imports";

import ReviewForm from "./ReviewForm";
import SearchPickerSheet from "./SearchPickerSheet";
import SelectedTargetCard from "./SelectedTargetCard";

import useReviewDraft from "../../hooks/review/useReviewDraft";
import useReviewSubmit from "../../hooks/review/useReviewSubmit";

import { styles } from "./styles/styles";

export default function ReviewOverlaySheet({ params, onRequestClose, onForceClose, setDirty }) {
  const insets = useSafeAreaInsets();

  const [searchVisible, setSearchVisible] = useState(false);
  const [target, setTarget] = useState(null);

  // ✅ Draft now includes title
  const { draft, setStars, setTitle, setContent, errors, isValid, reset } = useReviewDraft({
    stars: 0,
    title: "",
    content: "",
  });

  const { submit, submitting, error: submitError } = useReviewSubmit();

  useEffect(() => {
    if (params?.item && (params?.spotifyType || params?.item?.spotifyType)) {
      const t = normalizePickedTarget({
        spotifyType: params.spotifyType,
        spotifyId: params.spotifyId,
        item: params.item,
      });
      setTarget(t);
      setSearchVisible(false);
    } else {
      setTarget(null);
      setSearchVisible(true);
    }

    // ✅ reset includes title
    reset({ stars: 0, title: "", content: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.spotifyType, params?.spotifyId, params?.item]);

  useEffect(() => {
    const dirty =
      (draft?.stars || 0) > 0 ||
      (draft?.title || "").trim().length > 0 ||
      (draft?.content || "").trim().length > 0 ||
      !!target;

    setDirty?.(dirty);
  }, [draft?.stars, draft?.title, draft?.content, target, setDirty]);

  const headerTitle = useMemo(() => {
    if (!target) return "Add Review";
    return target.targetType === "album" ? "Rate Album" : "Rate Song";
  }, [target]);

  const onPick = (payload) => {
    const t = normalizePickedTarget(payload);
    if (!t) {
      Alert.alert("Pick failed", "Missing spotify id/type.");
      return;
    }
    setTarget(t);
    setSearchVisible(false);
    reset({ stars: 0, title: "", content: "" });
  };

  const onSubmit = async () => {
    if (!target) {
      Alert.alert("Missing selection", "Pick something to rate.");
      return;
    }
    if (!isValid) {
      Alert.alert("Fix errors", errors.stars || "Please complete the form.");
      return;
    }

    // Helpful debug (remove later)
    console.log("🚀 Review draft being submitted:", draft);

    await submit({ target, draft }); // ✅ draft now contains title
    setDirty?.(false);
    onForceClose?.();
  };

  return (
    <View style={styles.screen}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onRequestClose} activeOpacity={0.8} style={styles.headerExitBtn}>
          <Text style={styles.headerExitText}>Exit</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <SearchPickerSheet
        visible={searchVisible}
        onClose={(reason) => {
          setSearchVisible(false);
          if (reason !== "pick" && !target) onRequestClose?.();
        }}
        onPick={onPick}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: 14,
            paddingBottom: insets.bottom + 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{headerTitle}</Text>

        {!target && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Pick a song or album to rate.</Text>
            <Text onPress={() => setSearchVisible(true)} style={styles.link}>
              Open search
            </Text>
          </View>
        )}

        {!!submitError && <Text style={styles.errorText}>{submitError}</Text>}

        {target && (
          <>
            <SelectedTargetCard
              target={target}
              onChangePress={() => setSearchVisible(true)}
              onClosePress={() => {
                setTarget(null);
                setSearchVisible(true);
              }}
            />

            <View style={{ marginTop: 10, opacity: submitting ? 0.75 : 1 }}>
              <ReviewForm
                targetType={target.targetType}
                stars={draft.stars}
                setStars={setStars}
                title={draft.title}       // ✅ wired
                setTitle={setTitle}       // ✅ wired
                content={draft.content}
                setContent={setContent}
                errors={errors}
                submitting={submitting}
                onSubmit={onSubmit}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function normalizePickedTarget(payload) {
  if (!payload) return null;

  const spotifyType =
    payload.spotifyType ||
    payload?.item?.spotifyType ||
    payload?.item?.type ||
    null;

  const item = payload.item ? payload.item : payload;

  const spotifyId =
    payload.spotifyId ||
    item.spotifyId ||
    item.spotify_id ||
    item.id ||
    null;

  if (!spotifyId) return null;

  const st = spotifyType === "album" ? "album" : "track";
  const targetType = st === "album" ? "album" : "song";

  const title = item.title || item.name || "Untitled";
  const subtitle = item.artist || item.artist_name || item.subtitle || item.album || "";
  const imageUrl =
    item.imageUrl ||
    item.coverUrl ||
    item.album_cover_url ||
    item.cover_url ||
    item.image_url ||
    null;

  return {
    targetType,
    spotifyType: st,
    spotifyId,
    title,
    subtitle,
    imageUrl,
    raw: item,
  };
}
