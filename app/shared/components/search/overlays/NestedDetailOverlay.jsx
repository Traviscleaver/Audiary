// app/shared/components/search/overlays/NestedDetailOverlay.jsx
import React from "react";
import { Animated, COLORS, Dimensions, PanResponder } from "../../../imports";

import DetailContent from "./DetailContent";
import DetailHeader from "./DetailHeader";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function NestedDetailOverlay({ open, setOpen, detailType, detailItem }) {
  const anim = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const scrollRef = React.useRef(null);

  const close = React.useCallback(() => {
    Animated.timing(anim, {
      toValue: SCREEN_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  }, [anim, setOpen]);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) anim.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) close();
        else {
          Animated.timing(anim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  React.useEffect(() => {
    if (!open) return;
    anim.setValue(SCREEN_WIDTH);
    Animated.timing(anim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [open, anim]);

  if (!open) return null;

  const title =
    detailType === "Tracks"
      ? "Track"
      : detailType === "Albums"
      ? "Album"
      : "Artist";

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.overlay,
        { transform: [{ translateX: anim }], backgroundColor: COLORS.screen },
      ]}
    >
      <DetailHeader title={title} onBack={close} />

      <DetailContent
        type={detailType}
        item={detailItem}
        loading={false}
        tracks={[]}
        showAll={false}
        setShowAll={() => {}}
        scrollRef={scrollRef}
        scrollYRef={{ current: 0 }}
      />
    </Animated.View>
  );
}

const styles = {
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1100,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
};
