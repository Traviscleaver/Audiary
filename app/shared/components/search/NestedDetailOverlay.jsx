// NestedDetailOverlay.jsx
// Slide-in overlay used when a track is tapped from inside an album detail screen.
// Reuses the same header + detail content components, but disables album tracklist behavior.

import React from "react";
import { Animated, COLORS, PanResponder } from "../../imports";

import DetailContent from "./DetailContent";
import DetailHeader from "./DetailHeader";

export default function NestedDetailOverlay({
  open,
  setOpen,
  detailType,
  detailItem,
}) {
  const SCREEN_WIDTH = 1000; // overwritten in Home.jsx at runtime
  const anim = new Animated.Value(SCREEN_WIDTH);

  const scrollRef = React.useRef(null);

  // ===== SWIPE-TO-CLOSE =====
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

  // ===== OPEN ANIMATION =====
  React.useEffect(() => {
    if (open) {
      anim.setValue(SCREEN_WIDTH);
      Animated.timing(anim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [open]);

  // ===== CLOSE =====
  const close = () => {
    Animated.timing(anim, {
      toValue: SCREEN_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setOpen(false);
    });
  };

  if (!open) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.overlay,
        {
          transform: [{ translateX: anim }],
          backgroundColor: COLORS.screen,
        },
      ]}
    >
      <DetailHeader
        title={
          detailType === "Tracks"
            ? "Track"
            : detailType === "Albums"
            ? "Album"
            : "Artist"
        }
        onBack={close}
      />

      <DetailContent
        type={detailType}
        item={detailItem}
        loading={false}
        tracks={[]} // no tracks inside nested detail
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
