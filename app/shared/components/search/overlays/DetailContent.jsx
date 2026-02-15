// app/shared/components/search/overlays/DetailContent.jsx
import { useEffect, useRef, useState } from "react";
import { favouritesExistsBySpotify } from "../../../../../lib/api";
import {
  ActivityIndicator,
  Alert,
  COLORS,
  Feather,
  FontAwesome,
  Image,
  Linking,
  ScrollView,
  SIZES,
  Text,
  TouchableOpacity,
  useSafeAreaInsets,
  View,
} from "../../../imports";
import FavoriteButton from "../../favouriteButton";
import { useReviewOverlay } from "../../review/ReviewOverlayProvider";

export default function DetailContent({
  type,
  item,
  loading,
  tracks = [],
  showAll,
  setShowAll,
  scrollRef,
  scrollYRef,
  openSubDetail,

  // ✅ NEW: allow parent overlay to disable scrolling during swipe-back
  scrollEnabled = true,
}) {
  const insets = useSafeAreaInsets();
  const { openReview } = useReviewOverlay();

  if (!item) return null;

  const hero =
    item.coverUrl ||
    item.imageUrl ||
    item.albumCover ||
    item.artistImage ||
    null;

  const title = item.title || item.name;
  const subtitle = type === "Artists" ? "" : item.artist || item.album;

  const canOpenTrack = typeof openSubDetail === "function";
  const spotifyId = item.id || item.spotifyId || null;

  const [initialFavorite, setInitialFavorite] = useState(false);
  const [favDbId, setFavDbId] = useState(null);

  const existsCacheRef = useRef(new Map());

  const canAddFavouriteOrAlert = async () => {
    try {
      const r = await favouritesCountByType(type);
      if ((r?.count ?? 0) >= 3) {
        Alert.alert(
          "Favourite limit reached",
          `You can only have 3 favourite ${
            type === "Tracks" ? "songs" : type === "Albums" ? "albums" : "artists"
          }.`
        );
        return false;
      }
      return true;
    } catch (e) {
      const msg = String(e?.message || "");
      if (msg.includes("404")) return true;
      return true;
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadExists() {
      if (!spotifyId) return;

      const key = `${type}::${spotifyId}`;
      const cached = existsCacheRef.current.get(key);

      if (cached && Date.now() - cached.at < 60_000) {
        setInitialFavorite(!!cached.exists);
        setFavDbId(cached.item_id ?? null);
        return;
      }

      try {
        const res = await favouritesExistsBySpotify(type, spotifyId);
        if (cancelled) return;

        existsCacheRef.current.set(key, { ...res, at: Date.now() });
        setInitialFavorite(!!res.exists);
        setFavDbId(res.item_id ?? null);
      } catch (e) {
        if (cancelled) return;
        setInitialFavorite(false);
        setFavDbId(null);
      }
    }

    loadExists();
    return () => {
      cancelled = true;
    };
  }, [type, spotifyId]);

  const onRatePress = () => {
    try {
      if (!spotifyId) return;

      if (type !== "Tracks" && type !== "Albums") {
        Alert.alert("Not supported", "Artists can’t be rated yet.");
        return;
      }

      const spotifyType = type === "Albums" ? "album" : "track";

      openReview({
        spotifyType,
        spotifyId,
        item: {
          spotifyId,
          title: item.title || item.name,
          subtitle:
            type === "Tracks"
              ? item.artist || item.album || ""
              : item.artist || "",
          imageUrl: hero,
          spotifyUrl: item.spotifyUrl,
          raw: item,
        },
      });
    } catch (err) {
      console.log("onRatePress error:", err);
      Alert.alert("Couldn’t open", "Something went wrong opening the review overlay.");
    }
  };

  const topPad = insets.top + SIZES.navHeight + 10;

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      scrollEnabled={scrollEnabled} // ✅ NEW
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: SIZES.footerHeight + 50,
        paddingTop: topPad,
      }}
      showsVerticalScrollIndicator={false}
      onScroll={(e) => {
        if (scrollYRef) scrollYRef.current = e.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
    >
      {/* HERO IMAGE */}
      <View style={styles.heroWrap}>
        {hero ? (
          <Image
            source={{ uri: hero }}
            style={[
              styles.hero,
              { borderRadius: type === "Artists" ? 130 : 18 },
            ]}
          />
        ) : (
          <View
            style={[
              styles.hero,
              { borderRadius: type === "Artists" ? 130 : 18 },
            ]}
          />
        )}
      </View>

      {/* TITLE */}
      <View style={styles.titleWrap}>
        <Text style={styles.detailTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.detailSub}>{subtitle}</Text>}
      </View>

      {/* ALBUM METADATA */}
      {type === "Albums" && (
        <View style={styles.detailMeta}>
          <Text style={styles.detailMetaText}>{item.releaseDate || "—"}</Text>
          <Text style={styles.detailMetaDot}>•</Text>
          <Text style={styles.detailMetaText}>
            {item.trackCount ? `${item.trackCount} Tracks` : "—"}
          </Text>
        </View>
      )}

      {/* RATINGS */}
      <View style={styles.ratingsRow}>
        <View style={styles.ratingCol}>
          <Text style={styles.ratingNumber}>0</Text>
          <Text style={styles.ratingLabel}>Total Ratings</Text>
        </View>

        <View style={styles.ratingCol}>
          <View style={styles.starRow}>
            <FontAwesome name="star" size={18} color={COLORS.gold} />
            <Text style={styles.ratingNumber}>-</Text>
          </View>
          <Text style={styles.ratingLabel}>Average Rating</Text>
        </View>

        <View style={styles.ratingCol}>
          <View style={styles.starRow}>
            <Feather name="star" size={18} color={COLORS.gold} />
            <Text style={styles.ratingNumber}>-</Text>
          </View>
          <Text style={styles.ratingLabel}>Your Rating</Text>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.detailActionsRow}>
        <TouchableOpacity
          style={styles.rateButton}
          activeOpacity={0.8}
          onPress={onRatePress}
          disabled={!spotifyId}
        >
          <Feather name="star" size={18} color="#000000ff" />
          <Text style={styles.rateButtonText}>
            {type === "Tracks"
              ? "Rate Track"
              : type === "Albums"
              ? "Rate Album"
              : "Rate Artist"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          activeOpacity={0.8}
          onPress={() => item.spotifyUrl && Linking.openURL(item.spotifyUrl)}
        >
          <FontAwesome name="play" size={16} color="#000000ff" />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>

        <FavoriteButton
          key={`${type}-${spotifyId}`}
          type={type}
          spotifyId={spotifyId}
          initialFavorite={initialFavorite}
          beforeToggle={async (next) => {
            if (next === true) return await canAddFavouriteOrAlert();
            return true;
          }}
          onToggle={(next) => setInitialFavorite(next)}
        />
      </View>

      {/* TRACKLIST */}
      {type === "Albums" && (
        <View style={{ marginTop: 5 }}>
          {loading ? (
            <View style={styles.trackLoader}>
              <ActivityIndicator size="large" color={COLORS.text} />
            </View>
          ) : tracks.length === 0 ? (
            <Text style={{ color: COLORS.subtext }}>No tracks found.</Text>
          ) : (
            <>
              {(showAll ? tracks : tracks.slice(0, 5)).map((t, idx) => {
                const artistNames = Array.isArray(t.artists)
                  ? t.artists
                      .map((a) => (typeof a === "string" ? a : a?.name))
                      .filter(Boolean)
                      .map((s) => String(s).trim())
                      .filter((s) => s.length > 0)
                      .join(", ")
                  : "";

                return (
                  <View key={`${t.id}-${idx}`} style={styles.trackRow}>
                    <TouchableOpacity
                      style={{ flex: 1, paddingRight: 10 }}
                      disabled={!canOpenTrack}
                      onPress={() => {
                        if (!canOpenTrack) return;

                        openSubDetail(
                          {
                            id: t.id,
                            spotifyId: t.id,
                            name: t.name,
                            artist: artistNames,
                            coverUrl: hero,
                            album: title,
                            spotifyUrl: t.spotifyUrl,
                          },
                          "Tracks"
                        );
                      }}
                    >
                      <Text style={styles.trackTitle}>{t.name}</Text>
                      {!!artistNames && (
                        <Text style={styles.trackArtist}>{artistNames}</Text>
                      )}
                    </TouchableOpacity>

                    <View style={styles.trackButtonsRow}>
                      <View style={styles.trackRatingRow}>
                        <FontAwesome name="star" size={18} color={COLORS.gold} />
                        <Text style={{ color: COLORS.subtext }}>—</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          t.spotifyUrl && Linking.openURL(t.spotifyUrl)
                        }
                        style={styles.trackPlayButton}
                        activeOpacity={0.85}
                      >
                        <FontAwesome name="play" size={14} color="#000000ff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {tracks.length > 5 && !showAll && (
                <TouchableOpacity
                  onPress={() => {
                    const y = scrollYRef?.current || 0;
                    setShowAll(true);
                    requestAnimationFrame(() => {
                      scrollRef?.current?.scrollTo({ y, animated: false });
                    });
                  }}
                  style={{ marginTop: 12 }}
                >
                  <Text style={{ color: COLORS.subtext, textAlign: "center" }}>
                    Show full tracklist
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = {
  heroWrap: { alignItems: "center", marginTop: 8 },
  hero: { width: 220, height: 220, backgroundColor: COLORS.field },

  titleWrap: { alignItems: "flex-start", marginTop: 18 },
  detailTitle: { color: COLORS.text, fontSize: 22, fontWeight: "800" },
  detailSub: { color: COLORS.subtext, marginTop: 6 },

  detailMeta: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  detailMetaText: { color: COLORS.subtext },
  detailMetaDot: { color: COLORS.subtext },

  detailActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    borderColor: COLORS.divider,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  rateButton: {
    flex: 1,
    backgroundColor: COLORS.active,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  rateButtonText: { color: "#000000ff", fontWeight: "800" },

  playButton: {
    width: 120,
    backgroundColor: COLORS.active,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  playButtonText: { color: "#000000ff", fontWeight: "800" },

  ratingsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  ratingCol: { alignItems: "center", flex: 1 },
  ratingNumber: { color: COLORS.text, fontWeight: "900", fontSize: 18 },
  ratingLabel: { color: COLORS.subtext, marginTop: 6, fontSize: 12 },
  starRow: { flexDirection: "row", alignItems: "center", gap: 6 },

  trackLoader: { marginTop: 20, alignItems: "center" },
  trackRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  trackTitle: { color: COLORS.text, fontWeight: "800" },
  trackArtist: { color: COLORS.subtext, marginTop: 4 },

  trackButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minWidth: 90,
  },
  trackRatingRow: { flexDirection: "row", alignItems: "center", gap: 6 },

  trackPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.active,
    alignItems: "center",
    justifyContent: "center",
  },
};
