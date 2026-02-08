// app/shared/components/search/overlays/DetailScreenOverlay.jsx
import React from "react";
import { Animated, COLORS, Dimensions, PanResponder } from "../../../imports";

import DetailContent from "./DetailContent";
import DetailHeader from "./DetailHeader";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function DetailScreenOverlay({
  open,
  setOpen,

  detailType,
  detailItem,

  detailLoading,
  albumTracks,
  showAllAlbumTracks,
  setShowAllAlbumTracks,

  openSubDetail,
}) {
  const anim = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const scrollRef = React.useRef(null);
  const scrollYRef = React.useRef(0);

  // ✅ track if we're actively swiping back so we can disable ScrollView
  const [isSwiping, setIsSwiping] = React.useState(false);

  // keep current translateX so drag starts from the right place
  const startXRef = React.useRef(0);

  const closeDetail = React.useCallback(() => {
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
    // ✅ stronger intent checks
    const dx = g.dx;
    const dy = g.dy;

    // must be moving right
    if (dx <= 0) return false;

    // require clear horizontal intent
    if (Math.abs(dx) < 12) return false;
    if (Math.abs(dx) < Math.abs(dy) * 1.8) return false;

    // If user is mostly scrolling vertically, don't hijack it
    return true;
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: shouldStartSwipe,
      onMoveShouldSetPanResponderCapture: shouldStartSwipe,

      onPanResponderGrant: () => {
        // lock scroll as soon as swipe begins
        setIsSwiping(true);

        // stop any ongoing animation and record where we start
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

        // ✅ more sensitive close: distance OR velocity
        const shouldClose =
          dx > SCREEN_WIDTH * 0.22 || vx > 0.65;

        if (shouldClose) closeDetail();
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
        styles.fullOverlay,
        { transform: [{ translateX: anim }], backgroundColor: COLORS.screen },
      ]}
    >
      <DetailHeader title={title} onBack={closeDetail} backgroundColor={COLORS.screen} />

      <DetailContent
        type={detailType}
        item={detailItem}
        loading={detailLoading}
        tracks={albumTracks}
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
  fullOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
};
