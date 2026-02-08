// app/shared/components/search/overlays/NestedDetailOverlay.jsx
import React from "react";
import { Animated, COLORS, Dimensions, PanResponder } from "../../../imports";

import DetailContent from "./DetailContent";
import DetailHeader from "./DetailHeader";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function NestedDetailOverlay({
  open,
  setOpen,
  detailType,
  detailItem,

  detailLoading = false,
  albumTracks = [],
  showAllAlbumTracks = false,
  setShowAllAlbumTracks = () => {},

  openSubDetail,
}) {
  const anim = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const scrollRef = React.useRef(null);
  const scrollYRef = React.useRef(0);

  const [isSwiping, setIsSwiping] = React.useState(false);
  const startXRef = React.useRef(0);

  const close = React.useCallback(() => {
    setIsSwiping(false);
    Animated.timing(anim, {
      toValue: SCREEN_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  }, [anim, setOpen]);

  const snapBack = React.useCallback(() => {
    setIsSwiping(false);
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const shouldStartSwipe = (_, g) => {
    const dx = g.dx;
    const dy = g.dy;

    if (dx <= 0) return false;
    if (Math.abs(dx) < 12) return false;
    if (Math.abs(dx) < Math.abs(dy) * 1.8) return false;

    return true;
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: shouldStartSwipe,
      onMoveShouldSetPanResponderCapture: shouldStartSwipe,

      onPanResponderGrant: () => {
        setIsSwiping(true);
        anim.stopAnimation((value) => {
          startXRef.current = typeof value === "number" ? value : 0;
        });
      },

      onPanResponderMove: (_, g) => {
        const next = Math.max(0, Math.min(SCREEN_WIDTH, startXRef.current + g.dx));
        anim.setValue(next);
      },

      onPanResponderTerminationRequest: () => false,

      onPanResponderRelease: (_, g) => {
        const dx = g.dx;
        const vx = g.vx;

        const shouldClose =
          dx > SCREEN_WIDTH * 0.22 || vx > 0.65;

        if (shouldClose) close();
        else snapBack();
      },

      onPanResponderTerminate: () => {
        snapBack();
      },
    })
  ).current;

  React.useEffect(() => {
    if (!open) return;
    setIsSwiping(false);
    anim.setValue(SCREEN_WIDTH);
    Animated.timing(anim, {
      toValue: 0,
      duration: 240,
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
      <DetailHeader title={title} onBack={close} backgroundColor={COLORS.screen} />

      <DetailContent
        type={detailType}
        item={detailItem}
        loading={detailLoading}
        tracks={detailType === "Albums" ? albumTracks : []}
        showAll={showAllAlbumTracks}
        setShowAll={setShowAllAlbumTracks}
        scrollRef={scrollRef}
        scrollYRef={scrollYRef}
        openSubDetail={openSubDetail}
        scrollEnabled={!isSwiping} // ✅ critical
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
