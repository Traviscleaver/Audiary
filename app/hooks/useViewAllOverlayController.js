// app/hooks/useOverlay.js
import { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";

import {
    searchAlbumsSpotify,
    searchArtistsSpotify,
    searchTracksSpotify,
} from "../../api/spotify";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function useOverlay() {
  const [overlayType, setOverlayType] = useState(null);
  const [overlayQuery, setOverlayQuery] = useState("");    // ⭐ REQUIRED
  const [overlayData, setOverlayData] = useState([]);
  const [overlayLoading, setOverlayLoading] = useState(false);

  const overlayAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  /* ===== PAN ===== */
  const panResponderOverlay = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 20 && Math.abs(g.dx) > Math.abs(g.dy),

      onPanResponderMove: (_, g) => {
        if (g.dx > 0) overlayAnim.setValue(g.dx);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH / 3) closeOverlay();
        else {
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  /* ===== OPEN ===== */
  const openOverlay = async (type, query) => {
    setOverlayType(type);
    setOverlayQuery(query);     // ⭐ REQUIRED
    setOverlayLoading(true);
    setOverlayData([]);

    overlayAnim.setValue(SCREEN_WIDTH);
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start();

    try {
      let res;

      if (type === "Albums") res = await searchAlbumsSpotify(query);
      else if (type === "Tracks") res = await searchTracksSpotify(query);
      else if (type === "Artists") res = await searchArtistsSpotify(query);

      const list =
        type === "Albums"
          ? res.albums
          : type === "Tracks"
          ? res.tracks
          : res.artists;

      setOverlayData(list || []);
    } catch (e) {
      console.log("overlay error", e);
    }

    setOverlayLoading(false);
  };

  /* ===== CLOSE ===== */
  const closeOverlay = () => {
    Animated.timing(overlayAnim, {
      toValue: SCREEN_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setOverlayType(null);
      setOverlayQuery("");   // ⭐ RESET
      setOverlayData([]);
      setOverlayLoading(false);
    });
  };

  return {
    overlayType,
    overlayQuery,        // ⭐⭐ MUST BE RETURNED
    overlayData,
    overlayLoading,
    overlayAnim,
    panResponderOverlay,
    openOverlay,
    closeOverlay,
  };
}
