import { ActivityIndicator, Animated, COLORS, ScrollView, View } from "../../shared/imports";
import { styles } from "../styles/styles";

/* Components */
import SectionList from "../../shared/components/search/SearchResultsPreviewSection";

export default function SearchOverlay({
  searchOpen,
  insetsTop,
  searchAnim,
  panResponderSearch,
  loadingSearch,

  albums,
  tracksRes,
  artists,
  query,

  openDetail,
  closeSearchOverlay,
  openOverlay,
}) {
  if (!searchOpen) return null;

  return (
    <Animated.View
      {...panResponderSearch.panHandlers}
      style={[
        styles.searchOverlay,
        { transform: [{ translateX: searchAnim }], paddingTop: insetsTop + 120 },
      ]}
    >
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {loadingSearch ? (
          <View style={{ marginTop: 50, alignItems: "center" }}>
            <ActivityIndicator size="large" color={COLORS.text} />
          </View>
        ) : (
          <>
            <SectionList
              title="Albums"
              data={albums}
              type="Albums"
              onOpen={openDetail}
              onViewAll={(type) => {
                closeSearchOverlay();
                openOverlay(type, query);
              }}
            />

            <SectionList
              title="Tracks"
              data={tracksRes}
              type="Tracks"
              onOpen={openDetail}
              onViewAll={(type) => {
                closeSearchOverlay();
                openOverlay(type, query);
              }}
            />

            <SectionList
              title="Artists"
              data={artists}
              type="Artists"
              onOpen={openDetail}
              onViewAll={(type) => {
                closeSearchOverlay();
                openOverlay(type, query);
              }}
            />
          </>
        )}
      </ScrollView>
    </Animated.View>
  );
}
