// app/shared/components/review/SearchPickerSheet.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Modal, Pressable } from "react-native";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  searchAlbumsSpotify,
  searchArtistsSpotify,
  searchTracksSpotify,
  useSafeAreaInsets,
} from "../../imports";

import { styles as searchStyles } from "../../../search/styles/styles";
import SearchHeader from "../../../search/ui/SearchHeader";
import { styles as rStyles } from "./styles/styles";

const MAX_PREVIEW = 6;

export default function SearchPickerSheet({ visible, onClose, onPick }) {
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef(null);
  const anim = useRef(new Animated.Value(0)).current;

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(true);

  const [loading, setLoading] = useState(false);

  // ✅ keep FULL results + preview results
  const [tracksAll, setTracksAll] = useState([]);
  const [albumsAll, setAlbumsAll] = useState([]);
  const [artistsAll, setArtistsAll] = useState([]);

  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);

  const [error, setError] = useState(null);

  // ✅ new: which section is currently "view all"
  // null | "Tracks" | "Albums" | "Artists"
  const [viewAllType, setViewAllType] = useState(null);

  const close = (reason = "cancel") => onClose?.(reason);

  useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      setTimeout(() => searchInputRef.current?.focus?.(), 60);
    } else {
      setQuery("");
      setTracksAll([]);
      setAlbumsAll([]);
      setArtistsAll([]);
      setTracks([]);
      setAlbums([]);
      setArtists([]);
      setError(null);
      setLoading(false);
      setViewAllType(null);
      anim.setValue(0);
    }
  }, [visible, anim]);

  useEffect(() => {
    let alive = true;
    const q = query.trim();
    if (!visible) return;

    // ✅ whenever query changes, exit "view all"
    setViewAllType(null);

    if (q.length < 2) {
      setTracksAll([]);
      setAlbumsAll([]);
      setArtistsAll([]);
      setTracks([]);
      setAlbums([]);
      setArtists([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const t = setTimeout(async () => {
      try {
        const [tRes, aRes, arRes] = await Promise.all([
          searchTracksSpotify(q),
          searchAlbumsSpotify(q),
          searchArtistsSpotify(q),
        ]);
        if (!alive) return;

        const normTrack = (x) => ({
          ...x,
          spotifyId: x.spotifyId || x.spotify_id || x.id,
          spotifyType: "track",
        });

        const normAlbum = (x) => ({
          ...x,
          spotifyId: x.spotifyId || x.spotify_id || x.id,
          spotifyType: "album",
        });

        const normArtist = (x) => ({
          ...x,
          spotifyId: x.spotifyId || x.spotify_id || x.id,
          spotifyType: "artist",
        });

        const tAll = (tRes?.tracks || []).map(normTrack);
        const aAll = (aRes?.albums || []).map(normAlbum);
        const arAll = (arRes?.artists || []).map(normArtist);

        setTracksAll(tAll);
        setAlbumsAll(aAll);
        setArtistsAll(arAll);

        setTracks(tAll.slice(0, MAX_PREVIEW));
        setAlbums(aAll.slice(0, MAX_PREVIEW));
        setArtists(arAll.slice(0, MAX_PREVIEW));
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

    // ✅ Only allow track/album for reviews (artists not rateable right now)
    if (spotifyType === "artist") {
      setError("Artists can’t be rated yet.");
      return;
    }

    onPick?.({ spotifyType, spotifyId, item });
    close("pick");
  };

  // ✅ headers become { _kind:"header", title:"Tracks", canViewAll:true/false }
  const rows = useMemo(() => {
    const out = [];
    if (tracks.length) {
      out.push({
        _kind: "header",
        title: "Tracks",
        canViewAll: tracksAll.length > MAX_PREVIEW,
      });
      tracks.forEach((item) => out.push({ _kind: "item", item }));
    }
    if (albums.length) {
      out.push({
        _kind: "header",
        title: "Albums",
        canViewAll: albumsAll.length > MAX_PREVIEW,
      });
      albums.forEach((item) => out.push({ _kind: "item", item }));
    }
    if (artists.length) {
      out.push({
        _kind: "header",
        title: "Artists",
        canViewAll: artistsAll.length > MAX_PREVIEW,
      });
      artists.forEach((item) => out.push({ _kind: "item", item }));
    }
    return out;
  }, [tracks, albums, artists, tracksAll, albumsAll, artistsAll]);

  const keyExtractor = (row, idx) => {
    if (row._kind === "header") return `h-${row.title}-${idx}`;
    const x = row.item;
    return `${x.spotifyType}-${x.spotifyId || x.id || idx}`;
  };

  const showEmpty =
    !loading && !error && query.trim().length >= 2 && rows.length === 0;

  const renderItemRow = (x) => {
    const title = x.title || x.name || "Untitled";

    const subtitle =
      x.spotifyType === "artist"
        ? ""
        : x.artist || x.artist_name || x.subtitle || "";

    const imageUrl =
      x.imageUrl ||
      x.coverUrl ||
      x.album_cover_url ||
      x.cover_url ||
      x.image_url ||
      x.artistImage ||
      null;

    return (
      <TouchableOpacity
        onPress={() => pick(x)}
        activeOpacity={0.85}
        style={rStyles.row}
      >
        <View style={rStyles.rowImageWrap}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : null}
        </View>

        <View style={rStyles.rowTextWrap}>
          <Text style={rStyles.rowTitle} numberOfLines={1}>
            {title}
          </Text>

          {!!subtitle && (
            <Text style={rStyles.rowSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRow = ({ item }) => {
    if (item._kind === "header") {
      return (
        <View style={rStyles.sectionHeaderRow}>
          <Text style={rStyles.sectionHeader}>{item.title}</Text>

          {item.canViewAll ? (
            <TouchableOpacity
              onPress={() => setViewAllType(item.title)}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={rStyles.viewAllText}>View all</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }

    return renderItemRow(item.item);
  };

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

  // ✅ data for view-all mode
  const viewAllData = useMemo(() => {
    if (viewAllType === "Tracks") return tracksAll;
    if (viewAllType === "Albums") return albumsAll;
    if (viewAllType === "Artists") return artistsAll;
    return [];
  }, [viewAllType, tracksAll, albumsAll, artistsAll]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => close("cancel")}
    >
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
        <Pressable style={rStyles.backdrop} onPress={() => close("cancel")} />
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
        <View style={rStyles.sheetOuter}>
          <View style={rStyles.handleWrap}>
            <View style={rStyles.handle} />
          </View>

          <View style={rStyles.searchHeaderWrap}>
            <SearchHeader
              insetsTop={0}
              query={query}
              setQuery={setQuery}
              searchOpen={searchOpen}
              openSearchOverlay={() => setSearchOpen(true)}
              closeSearchOverlay={() => close("cancel")}
              searchInputRef={searchInputRef}
              placeholder="Search songs, albums, or artists"
            />
          </View>

          <View style={[searchStyles.resultsScroll, { flex: 1 }]}>
            {loading && (
              <View style={rStyles.searchLoadingWrap}>
                <ActivityIndicator />
              </View>
            )}

            {!!error && <Text style={rStyles.searchErrorText}>{error}</Text>}

            {!loading && !error && query.trim().length < 2 && (
              <Text style={rStyles.searchHintText}>Type at least 2 characters…</Text>
            )}

            {showEmpty && (
              <Text style={rStyles.searchHintText}>No results found.</Text>
            )}

            {/* ✅ VIEW ALL MODE */}
            {viewAllType ? (
              <>
                <View style={rStyles.viewAllTopBar}>
                  <TouchableOpacity
                    onPress={() => setViewAllType(null)}
                    activeOpacity={0.85}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={rStyles.viewAllBackText}>Back</Text>
                  </TouchableOpacity>

                  <Text style={rStyles.viewAllTitle}>{viewAllType}</Text>

                  <View style={{ width: 44 }} />
                </View>

                <FlatList
                  data={viewAllData}
                  renderItem={({ item }) => renderItemRow(item)}
                  keyExtractor={(x, idx) =>
                    `${x.spotifyType}-${x.spotifyId || x.id || idx}`
                  }
                  keyboardShouldPersistTaps="handled"
                  ItemSeparatorComponent={() => <View style={rStyles.separator} />}
                  contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
                />
              </>
            ) : (
              /* ✅ PREVIEW MODE */
              <FlatList
                data={rows}
                renderItem={renderRow}
                keyExtractor={keyExtractor}
                keyboardShouldPersistTaps="handled"
                ItemSeparatorComponent={() => <View style={rStyles.separator} />}
                contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
              />
            )}
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}
