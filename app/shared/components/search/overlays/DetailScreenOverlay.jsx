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

  const closeDetail = React.useCallback(() => {
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
        if (g.dx > SCREEN_WIDTH / 3) closeDetail();
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
        styles.fullOverlay,
        { transform: [{ translateX: anim }], backgroundColor: COLORS.screen },
      ]}
    >
      <DetailHeader title={title} onBack={closeDetail} />

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
