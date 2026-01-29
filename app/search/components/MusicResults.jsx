import SectionList from "../../shared/components/search/SearchResultsPreviewSection";
import { ActivityIndicator, COLORS, View } from "../../shared/imports";

export default function MusicResults({
  loadingSearch,
  albums,
  tracksRes,
  artists,
  query,
  openDetail,
  openOverlay,
}) {
  if (loadingSearch) {
    return (
      <View style={{ marginTop: 50, alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.text} />
      </View>
    );
  }

  return (
    <>
      <SectionList
        title="Albums"
        data={albums}
        type="Albums"
        onOpen={openDetail}
        onViewAll={(type) => openOverlay(type, query)}
      />

      <SectionList
        title="Tracks"
        data={tracksRes}
        type="Tracks"
        onOpen={openDetail}
        onViewAll={(type) => openOverlay(type, query)}
      />

      <SectionList
        title="Artists"
        data={artists}
        type="Artists"
        onOpen={openDetail}
        onViewAll={(type) => openOverlay(type, query)}
      />
    </>
  );
}
