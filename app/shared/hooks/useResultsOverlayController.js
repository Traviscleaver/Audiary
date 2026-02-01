import { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";

import {
  searchAlbumsSpotify,
  searchArtistsSpotify,
  searchTracksSpotify,
} from "../imports";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function useResultsOverlayController() {
  const [overlayType, setOverlayType] = useState(null); // "Albums" | "Tracks" | "Artists"
  const [overlayQuery, setOverlayQuery] = useState("");
  const [overlayData, setOverlayData] = useState([]);
  const [overlayLoading, setOverlayLoading] = useState(false);

  const overlayAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const closeOverlay = () => {
    Animated.timing(overlayAnim, {
      toValue: SCREEN_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setOverlayType(null);
      setOverlayQuery("");
      setOverlayData([]);
      setOverlayLoading(false);
    });
  };

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

  const openOverlay = async (type, query) => {
    const q = String(query || "").trim();

    setOverlayType(type);
    setOverlayQuery(q);
    setOverlayLoading(true);
    setOverlayData([]);

    overlayAnim.setValue(SCREEN_WIDTH);
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start();

    // Prevent blank overlay when query is empty
    if (q.length < 2) {
      setOverlayLoading(false);
      setOverlayData([]);
      return;
    }

    try {
      let res;

      if (type === "Albums") res = await searchAlbumsSpotify(q);
      else if (type === "Tracks") res = await searchTracksSpotify(q);
      else if (type === "Artists") res = await searchArtistsSpotify(q);

      const list =
        type === "Albums"
          ? res?.albums
          : type === "Tracks"
          ? res?.tracks
          : res?.artists;

      setOverlayData(Array.isArray(list) ? list : []);
    } catch (e) {
      console.log("overlay error", e);
      setOverlayData([]);
    } finally {
      setOverlayLoading(false);
    }
  };

  return {
    overlayType,
    overlayQuery,
    overlayData,
    overlayLoading,
    overlayAnim,
    panResponderOverlay,
    openOverlay,
    closeOverlay,
  };
}
