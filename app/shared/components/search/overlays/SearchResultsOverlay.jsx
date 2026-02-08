// app/shared/components/search/overlays/SearchResultsOverlay.jsx
import {
  ActivityIndicator,
  Animated,
  COLORS,
  FlatList,
  SIZES,
  Text,
  View,
  useSafeAreaInsets,
} from "../../../imports";

import SearchResultRow from "../rows/SearchResultRow";
import DetailHeader from "./DetailHeader";

export default function SearchResultsOverlay({
  overlayType,
  overlayData,
  overlayLoading,
  overlayAnim,
  overlayQuery,
  panResponderOverlay,
  closeOverlay,
  openDetail,
  insetsBottom = 0,
}) {
  const insets = useSafeAreaInsets();

  if (!overlayType) return null;

  // ✅ Header title should be Albums / Tracks / Artists
  const headerTitle =
    overlayType === "Tracks"
      ? "Tracks"
      : overlayType === "Albums"
      ? "Albums"
      : overlayType === "Artists"
      ? "Artists"
      : String(overlayType);

  const isArtist = overlayType === "Artists";

  // ✅ Space so list doesn't go under header
  const topPad = insets.top + SIZES.navHeight + 10;

  return (
    <Animated.View
      {...panResponderOverlay.panHandlers}
      style={[
        styles.fullOverlay,
        {
          transform: [{ translateX: overlayAnim }],
          backgroundColor: COLORS.screen,
        },
      ]}
    >
      {/* ✅ BLACK NAVBAR BACKGROUND */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top + SIZES.navHeight,
          backgroundColor: "#000",
          zIndex: 9998,
        }}
      />

      {/* back button + centered title */}
      <DetailHeader title={headerTitle} onBack={closeOverlay} />

      {overlayLoading ? (
        <View style={[styles.center, { paddingTop: topPad }]}>
          <ActivityIndicator size="large" color={COLORS.text} />
        </View>
      ) : (
        <FlatList
          data={overlayData || []}
          keyExtractor={(i, idx) => String(i?.id ?? i?.spotifyId ?? idx)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: topPad,
            paddingBottom: SIZES.footerHeight + insetsBottom + 24,
          }}
          renderItem={({ item }) => (
            <SearchResultRow
              item={item}
              variant={isArtist ? "artist" : "default"}
              onPress={() => openDetail(item, overlayType)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={{ color: COLORS.subtext }}>No results found.</Text>
            </View>
          }
        />
      )}
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
    zIndex: 900,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyWrap: { paddingTop: 40, alignItems: "center" },
};
