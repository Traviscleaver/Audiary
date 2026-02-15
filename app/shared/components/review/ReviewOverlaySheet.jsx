// app/shared/components/review/ReviewOverlaySheet.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
  findNodeHandle,
} from "react-native";
import { useSafeAreaInsets } from "../../imports";

import ReviewForm from "./ReviewForm";
import SearchPickerSheet from "./SearchPickerSheet";
import SelectedTargetCard from "./SelectedTargetCard";

import useReviewDraft from "../../hooks/review/useReviewDraft";
import useReviewSubmit from "../../hooks/review/useReviewSubmit";

import { styles } from "./styles/styles";

export default function ReviewOverlaySheet({
  params,
  onRequestClose,
  onForceClose,
  setDirty,
}) {
  const insets = useSafeAreaInsets();

  const scrollRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [searchVisible, setSearchVisible] = useState(false);
  const [target, setTarget] = useState(null);
  const [albumWarning, setAlbumWarning] = useState(false);

  const {
    draft,
    setRatingnumber,
    setTitle,
    setContent,
    errors,
    validate,
    reset,
  } = useReviewDraft({
    ratingNumber: 5.0,
    title: "",
    content: "",
  });

  const { submit, submitting, error: submitError } = useReviewSubmit();

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e?.endCoordinates?.height || 0);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /**
   * ✅ FIX:
   * measureLayout must be called with native handles.
   * Using UIManager.measureLayout + findNodeHandle is the most reliable across RN versions/Fabric.
   */
  const scrollToInput = (inputRef) => {
    const sv = scrollRef.current;
    const node = inputRef?.current;
    if (!sv || !node) return;

    const scrollTag = findNodeHandle(sv);
    const inputTag = findNodeHandle(node);

    if (!scrollTag || !inputTag) return;

    // iOS needs a tick after focus before measuring is accurate
    requestAnimationFrame(() => {
      UIManager.measureLayout(
        inputTag,
        scrollTag,
        () => {},
        (x, y, w, h) => {
          const footerApprox = 92;
          const padding = 14;

          const targetY = Math.max(
            0,
            y + h - (keyboardHeight - padding) + footerApprox
          );

          sv.scrollTo?.({ y: targetY, animated: true });
        }
      );
    });
  };

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

    setAlbumWarning(false);
    reset({ ratingNumber: 5.0, title: "", content: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.spotifyType, params?.spotifyId, params?.item]);

  useEffect(() => {
    const dirty =
      draft.ratingNumber !== 5.0 ||
      (draft.title || "").trim().length > 0 ||
      (draft.content || "").trim().length > 0 ||
      !!target;

    setDirty?.(dirty);
  }, [draft, target, setDirty]);

  const onPick = (payload) => {
    const t = normalizePickedTarget(payload);
    if (!t) return;

    setTarget(t);
    setSearchVisible(false);
    setAlbumWarning(false);
    reset({ ratingNumber: 5.0, title: "", content: "" });
  };

  const onSubmit = async () => {
    if (!target) return;

    // server still song-only
    if (target.targetType === "album") {
      setAlbumWarning(true);
      return;
    }

    const ok = validate();
    if (!ok) return;

    try {
      await submit({ target, draft });
      setDirty?.(false);
      onForceClose?.();
    } catch (e) {
      console.log("submit error", e);
    }
  };

  const keyboardOffset = Platform.OS === "ios" ? 10 : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardOffset}
    >
      <View style={styles.screen}>
        <SearchPickerSheet
          visible={searchVisible}
          onClose={(reason) => {
            setSearchVisible(false);
            if (reason !== "pick" && !target) onRequestClose?.();
          }}
          onPick={onPick}
        />

        <View style={{ flex: 1 }}>
          {target ? (
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              stickyHeaderIndices={[0]}
              keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
              keyboardShouldPersistTaps="handled"
              contentInsetAdjustmentBehavior="always"
              contentContainerStyle={[styles.content, { paddingBottom: 18 }]}
            >
              {/* Sticky navbar target card */}
              <View style={styles.stickyTargetNav}>
                <SelectedTargetCard
                  target={target}
                  onClosePress={() => {
                    setTarget(null);
                    setSearchVisible(true);
                  }}
                />
              </View>

              {!!submitError && <Text style={styles.errorText}>{submitError}</Text>}

              {albumWarning && (
                <Text style={styles.inlineErrorUnderInput}>
                  Album reviews are not supported yet
                </Text>
              )}

              <ReviewForm
                ratingnumber={draft.ratingNumber}
                setRatingnumber={setRatingnumber}
                title={draft.title}
                setTitle={setTitle}
                content={draft.content}
                setContent={setContent}
                errors={errors}
                submitting={submitting}
                targetType={target.targetType}
                scrollToInput={scrollToInput} // ✅ uses UIManager.measureLayout now
              />
            </ScrollView>
          ) : (
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
              keyboardShouldPersistTaps="handled"
              contentInsetAdjustmentBehavior="always"
              contentContainerStyle={[styles.content, { paddingBottom: 18 }]}
            >
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Pick a song to review.</Text>
                <Text style={styles.link} onPress={() => setSearchVisible(true)}>
                  Open search
                </Text>
              </View>
            </ScrollView>
          )}

          {/* Footer in-layout (keyboard-friendly) */}
          <View style={[styles.stickyActionBar, { paddingBottom: insets.bottom + 16 }]}>
            <Pressable
              onPress={onRequestClose}
              style={({ pressed }) => [styles.stickyExitBtn, pressed && { opacity: 0.7 }]}
              hitSlop={12}
            >
              <Text style={styles.stickyExitText}>Exit</Text>
            </Pressable>

            <Pressable
              onPress={onSubmit}
              disabled={submitting}
              style={({ pressed }) => [
                styles.stickyReviewBtn,
                submitting && styles.stickyReviewBtnDisabled,
                pressed && !submitting && { opacity: 0.85 },
              ]}
              hitSlop={12}
            >
              <Text style={styles.stickyReviewText}>
                {submitting ? "Meow..." : "Review"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  const subtitle =
    item.artist || item.artist_name || item.subtitle || item.album || "";

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
