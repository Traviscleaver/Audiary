// app/shared/components/review/ReviewOverlayProvider.jsx
import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { Alert, Animated, Easing, Modal, Pressable, View } from "react-native";
import ReviewOverlaySheet from "./ReviewOverlaySheet";
import { styles } from "./styles/styles";

const ReviewOverlayContext = createContext(null);

export function ReviewOverlayProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState({ spotifyType: null, spotifyId: null, item: null });

  const dirtyRef = useRef(false);
  const setDirty = (v) => (dirtyRef.current = !!v);

  const anim = useRef(new Animated.Value(0)).current;

  const openReview = (next = {}) => {
    setParams({
      spotifyType: next.spotifyType ?? null,
      spotifyId: next.spotifyId ?? null,
      item: next.item ?? null,
    });

    setDirty(false);
    setVisible(true);

    requestAnimationFrame(() => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  };

  const forceClose = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      setVisible(false);
      setParams({ spotifyType: null, spotifyId: null, item: null });
      setDirty(false);
    });
  };

  const closeReview = () => {
    if (!dirtyRef.current) return forceClose();

    Alert.alert("Discard review?", "Your changes will be lost.", [
      { text: "Cancel", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: forceClose },
    ]);
  };

  const ctx = useMemo(() => ({ openReview, closeReview }), []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [900, 0],
    extrapolate: "clamp",
  });

  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <ReviewOverlayContext.Provider value={ctx}>
      {children}

      <Modal visible={visible} transparent animationType="none" onRequestClose={closeReview}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: backdropOpacity,
          }}
        >
          <Pressable style={styles.backdrop} onPress={closeReview} />
        </Animated.View>

        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "85%",
            transform: [{ translateY }],
          }}
        >
          <View style={styles.sheetOuter}>
            <View style={styles.handleWrap}>
              <View style={styles.handle} />
            </View>

            <ReviewOverlaySheet
              params={params}
              onRequestClose={closeReview}
              onForceClose={forceClose}
              setDirty={setDirty}
            />
          </View>
        </Animated.View>
      </Modal>
    </ReviewOverlayContext.Provider>
  );
}

export function useReviewOverlay() {
  const ctx = useContext(ReviewOverlayContext);
  if (!ctx) throw new Error("useReviewOverlay must be used inside ReviewOverlayProvider");
  return ctx;
}
