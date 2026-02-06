// app/review/components/SearchPickerOverlay.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-native";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  useSafeAreaInsets,
  COLORS,
  searchTracksSpotify,
  searchAlbumsSpotify,
} from "../../shared/imports";

import SearchHeader from "../../search/ui/SearchHeader";
import { styles as searchStyles } from "../../search/styles/styles";

const MAX_PREVIEW = 5;

export default function SearchPickerOverlay({ visible, onClose, onPick }) {
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(true);

  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);

  const placeholder = "Search songs or albums";

  // ✅ tell parent WHY we closed
  const close = (reason = "cancel") => onClose?.(reason);

  useEffect(() => {
    if (visible) {
      setTimeout(() => searchInputRef.current?.focus?.(), 50);
    } else {
      setQuery("");
      setTracks([]);
      setAlbums([]);
      setError(null);
    }
  }, [visible]);

  useEffect(() => {
    let alive = true;
    const q = query.trim();

    if (!visible) return;

    if (q.length < 2) {
      setTracks([]);
      setAlbums([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const t = setTimeout(async () => {
      try {
        const [tRes, aRes] = await Promise.all([
          searchTracksSpotify(q),
          searchAlbumsSpotify(q),
        ]);
        if (!alive) return;

        const rawTracks = (tRes?.tracks || []).slice(0, MAX_PREVIEW);
        const rawAlbums = (aRes?.albums || []).slice(0, MAX_PREVIEW);

        setTracks(
          rawTracks.map((x) => ({
            ...x,
            spotifyId: x.spotifyId || x.spotify_id || x.id,
            spotifyType: "track",
          }))
        );

        setAlbums(
          rawAlbums.map((x) => ({
            ...x,
            spotifyId: x.spotifyId || x.spotify_id || x.id,
            spotifyType: "album",
            albumType: x.albumType || x.type || null, // keeps album_type if you want it later
          }))
        );
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Search failed");
      } finally {
        if (alive) setLoading(false);
      }
    }, 250);

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query, visible]);

  const pick = (item) => {
    const spotifyId = item?.spotifyId || item?.spotify_id || item?.id;
    const spotifyType = item?.spotifyType || null;

    if (!spotifyId || !spotifyType) {
      setError("Pick failed: missing spotifyId or spotifyType.");
      return;
    }

    // ✅ send type through so ReviewScreen can decide song vs album
    onPick?.({ spotifyType, spotifyId, item });

    // ✅ close overlay but tell parent it's a pick (not cancel)
    close("pick");
  };

  const rows = useMemo(() => {
    const out = [];
    if (tracks.length) {
      out.push({ _kind: "header", title: "Tracks" });
      tracks.forEach((item) => out.push({ _kind: "item", item }));
    }
    if (albums.length) {
      out.push({ _kind: "header", title: "Albums" });
      albums.forEach((item) => out.push({ _kind: "item", item }));
    }
    return out;
  }, [tracks, albums]);

  const renderRow = ({ item }) => {
    if (item._kind === "header") {
      return (
        <Text
          style={{
            color: COLORS.subtext,
            fontWeight: "800",
            marginTop: 10,
            marginBottom: 6,
          }}
        >
          {item.title}
        </Text>
      );
    }

    const x = item.item;
    const title = x.title || x.name || "Untitled";
    const subtitle = x.artist || x.artist_name || x.subtitle || "";
    const imageUrl =
      x.coverUrl || x.album_cover_url || x.cover_url || x.image_url || null;

    return (
      <TouchableOpacity
        onPress={() => pick(x)}
        activeOpacity={0.85}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : null}
        </View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: COLORS.text, fontWeight: "800" }} numberOfLines={1}>
            {title}
          </Text>
          <Text style={{ color: COLORS.subtext, marginTop: 2 }} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        <Text style={{ color: COLORS.subtext, fontWeight: "700", marginLeft: 10 }}>
          {x.spotifyType === "album" ? "Album" : "Song"}
        </Text>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (row, idx) => {
    if (row._kind === "header") return `h-${row.title}-${idx}`;
    const x = row.item;
    return `${x.spotifyType}-${x.spotifyId || x.id || idx}`;
  };

  const showEmpty =
    !loading && !error && query.trim().length >= 2 && rows.length === 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => close("cancel")}
    >
      <View style={searchStyles.screen}>
        <SearchHeader
          insetsTop={insets.top}
          query={query}
          setQuery={setQuery}
          searchOpen={searchOpen}
          openSearchOverlay={() => setSearchOpen(true)}
          closeSearchOverlay={() => close("cancel")}
          searchInputRef={searchInputRef}
          placeholder={placeholder}
        />

        <View style={searchStyles.resultsScroll}>
          {loading && (
            <View style={{ paddingTop: 20 }}>
              <ActivityIndicator />
            </View>
          )}

          {!!error && (
            <Text style={{ color: COLORS.danger || "#ff6b6b", paddingVertical: 6 }}>
              {error}
            </Text>
          )}

          {!loading && !error && query.trim().length < 2 && (
            <Text style={{ color: COLORS.subtext, paddingVertical: 6 }}>
              Type at least 2 characters…
            </Text>
          )}

          {showEmpty && (
            <Text style={{ color: COLORS.subtext, paddingVertical: 6 }}>
              No results found.
            </Text>
          )}

          <FlatList
            data={rows}
            renderItem={renderRow}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.divider,
                  opacity: 0.25,
                }}
              />
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
