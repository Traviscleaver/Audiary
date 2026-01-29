// DetailContent.jsx
// Scrollable content area for the detail overlay.
// Renders hero image, metadata, action buttons, ratings, and optional album tracklist.

import {
  ActivityIndicator,
  COLORS,
  Feather,
  FontAwesome,
  Image,
  Linking,
  ScrollView,
  SIZES,
  Text,
  TouchableOpacity,
  View,
} from "../../imports";

export default function DetailContent({
  type,
  item,
  loading,
  tracks,
  showAll,
  setShowAll,
  scrollRef,
  scrollYRef,
  openSubDetail,
}) {
  if (!item) return null;

  const hero =
    item.coverUrl ||
    item.imageUrl ||
    item.albumCover ||
    item.artistImage ||
    null;

  const title = item.title || item.name;
  const subtitle = type === "Artists" ? "" : item.artist || item.album;

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: SIZES.footerHeight + 50,
      }}
      showsVerticalScrollIndicator={false}
      onScroll={(e) => {
        if (scrollYRef) scrollYRef.current = e.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
    >
      {/* HERO IMAGE */}
      <View style={{ alignItems: "center", marginTop: 8 }}>
        {hero ? (
          <Image
            source={{ uri: hero }}
            style={{
              width: 220,
              height: 220,
              borderRadius: type === "Artists" ? 130 : 18,
              backgroundColor: COLORS.field,
            }}
          />
        ) : (
          <View
            style={{
              width: 220,
              height: 220,
              borderRadius: type === "Artists" ? 130 : 18,
              backgroundColor: COLORS.field,
            }}
          />
        )}
      </View>

      {/* TITLE */}
      <View style={{ alignItems: "center", marginTop: 18 }}>
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

      {/* ACTION BUTTONS */}
      <View style={styles.detailActionsRow}>
        <TouchableOpacity style={styles.rateButton}>
          <Feather name="star" size={18} color="#fff" />
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
          onPress={() => item.spotifyUrl && Linking.openURL(item.spotifyUrl)}
        >
          <Feather name="play" size={18} color="#fff" />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      </View>

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

      {/* TRACKLIST */}
      {type === "Albums" && (
        <View style={{ marginTop: 18 }}>
          <Text style={styles.trackHeader}>Tracks</Text>

          {loading ? (
            <View style={styles.trackLoader}>
              <ActivityIndicator size="large" color={COLORS.text} />
            </View>
          ) : tracks.length === 0 ? (
            <Text style={{ color: COLORS.subtext }}>No tracks found.</Text>
          ) : (
            <>
              {(showAll ? tracks : tracks.slice(0, 5)).map((t, idx) => {
                const artistNames = t.artists?.join(", ");
                const num = t.track_number ?? idx + 1;

                return (
                  <View key={`${t.id}-${num}`} style={styles.trackRow}>
                    <View style={{ width: 28 }}>
                      <Text style={{ color: COLORS.subtext }}>{num}</Text>
                    </View>

                    <TouchableOpacity
                      style={{ flex: 1, paddingRight: 10 }}
                      onPress={() =>
                        openSubDetail({
                          id: t.id,
                          name: t.name,
                          artist: artistNames,
                          coverUrl: hero,
                          album: title,
                          spotifyUrl: t.spotifyUrl,
                        })
                      }
                    >
                      <Text style={styles.trackTitle}>{t.name}</Text>
                      {!!artistNames && (
                        <Text style={styles.trackArtist}>{artistNames}</Text>
                      )}
                    </TouchableOpacity>

                    <View style={styles.trackButtons}>
                      <View style={styles.trackRatingRow}>
                        <FontAwesome name="star" size={18} color={COLORS.gold} />
                        <Text style={{ color: COLORS.subtext }}>—</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => t.spotifyUrl && Linking.openURL(t.spotifyUrl)}
                        style={styles.trackPlayButton}
                      >
                        <Feather name="play" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {tracks.length > 5 && !showAll && (
                <TouchableOpacity
                  onPress={() => {
                    const y = scrollYRef.current || 0;
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
  // ... unchanged styles
};
