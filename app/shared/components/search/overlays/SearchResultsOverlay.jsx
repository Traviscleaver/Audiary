import {
  ActivityIndicator,
  Animated,
  COLORS,
  FlatList,
  SIZES,
  Text,
  View,
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
  if (!overlayType) return null;

  const title =
    overlayQuery && overlayQuery.trim().length > 0
      ? `"${overlayQuery}" in ${overlayType}`
      : overlayType;

  const isArtist = overlayType === "Artists";

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
      <DetailHeader title={title} onBack={closeOverlay} />

      {overlayLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.text} />
        </View>
      ) : (
        <FlatList
          data={overlayData || []}
          keyExtractor={(i) => String(i.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: SIZES.footerHeight + insetsBottom + 24,
          }}
          renderItem={({ item }) => (
            <SearchResultRow
              item={item}
              isArtist={isArtist}
              onPress={() => openDetail(item, overlayType)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={{ color: COLORS.subtext }}>
                No results found.
              </Text>
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
