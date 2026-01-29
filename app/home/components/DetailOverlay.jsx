import { Animated, COLORS } from "../../shared/imports";
import { getDetailHeaderTitle } from "../styles/selectors";
import { styles } from "../styles/styles";

/* Components */
import DetailBody from "../../shared/components/search/DetailContent";
import HeaderBar from "../../shared/components/search/DetailHeader";

export default function DetailOverlay({
  detailOpen,
  detailItem,
  detailType,
  detailAnim,
  detailScrollRef,
  detailScrollYRef,
  albumTracks,
  detailLoading,
  showAllAlbumTracks,

  closeDetail,

  openSubDetail,
  panResponderDetail,
  setShowAllAlbumTracks,
}) {
  if (!detailOpen) return null;

  return (
    <Animated.View
      {...panResponderDetail.panHandlers}
      style={[
        styles.fullOverlay,
        {
          backgroundColor: COLORS.screen,
          transform: [{ translateX: detailAnim }],
          zIndex: 1000,
        },
      ]}
    >
      <HeaderBar title={getDetailHeaderTitle(detailType)} onBack={closeDetail} />

      <DetailBody
        type={detailType}
        item={detailItem}
        loading={detailLoading}
        tracks={albumTracks}
        showAll={showAllAlbumTracks}
        setShowAll={setShowAllAlbumTracks}
        scrollRef={detailScrollRef}
        scrollYRef={detailScrollYRef}
        openSubDetail={openSubDetail}
      />
    </Animated.View>
  );
}
