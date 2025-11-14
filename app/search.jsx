import {
  ActivityIndicator,
  Animated,
  COLORS,
  Dimensions,
  Feather,
  FlatList,
  SIZES,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useEffect,
  useRouter,
  useSafeAreaInsets,
  useState
} from "./lib/imports";

/* 🔥 Shared Components */
import FooterBar from "./components/MainNavigationFooter";
import HeaderBar from "./components/OverlayHeaderBar";
import SectionList from "./components/SearchPreviewSection";
import DetailBody from "./components/SearchResultDetailContent";
import RowItem from "./components/SearchResultRow";
import SubDetailView from "./components/SubResultDetailOverlay";

/* 🔥 Shared Hooks */
import useSearchHome from "./hooks/useHomeSearchController";
import useDetail from "./hooks/userDetailOverlayController";
import useOverlay from "./hooks/useViewAllOverlayController";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Search() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  /* 🔥 Shared search system from home.jsx */
  const {
    searchOpen,
    query,
    albums,
    artists,
    tracksRes,
    searchAnim,
    searchInputRef,
    loadingSearch,

    openSearchOverlay,
    closeSearchOverlay,
    panResponderSearch,
    setQuery,
  } = useSearchHome();

  /* 🔥 Shared “View All” Overlay */
  const {
    overlayType,
    overlayData,
    overlayLoading,
    overlayAnim,
    overlayQuery,
    openOverlay,
    closeOverlay,
    panResponderOverlay,
  } = useOverlay();

  /* 🔥 Shared Detail + Subdetail */
  const {
    detailOpen,
    detailItem,
    detailType,
    detailAnim,
    detailScrollRef,
    detailScrollYRef,
    albumTracks,
    detailLoading,
    showAllAlbumTracks,

    openDetail,
    closeDetail,

    subDetailOpen,
    subDetailItem,
    subDetailType,
    subDetailAnim,
    subDetailScrollRef,

    openSubDetail,
    closeSubDetail,
    panResponderDetail,
    panResponderSubDetail,
    setShowAllAlbumTracks,
  } = useDetail();

  /* ============================================
     🔥 TOP TABS (Music / Reviews / Lists / Users)
     ============================================ */
  const [activeTopTab, setActiveTopTab] = useState("Music");
  const [tabsWidth, setTabsWidth] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!tabsWidth) return;
    const tabs = ["Music", "Reviews", "Lists", "Users"];
    const idx = Math.max(0, tabs.indexOf(activeTopTab));
    const slot = tabsWidth / 4;
    setIndicator({ left: idx * slot, width: slot });
  }, [activeTopTab, tabsWidth]);

  const TopTabs = () => {
    const tabs = ["Music", "Reviews", "Lists", "Users"];

    return (
      <View style={{ backgroundColor: COLORS.navbar }}>
        <View
          onLayout={(e) => setTabsWidth(e.nativeEvent.layout.width)}
          style={{
            position: "relative",
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 8,
            borderBottomColor: COLORS.divider,
            borderBottomWidth: 1,
          }}
        >
          {/* Active underline */}
          <View
            style={{
              position: "absolute",
              bottom: -1,
              left: indicator.left,
              width: indicator.width,
              height: 2,
              backgroundColor: COLORS.active,
            }}
          />

          {tabs.map((t) => {
            const active = activeTopTab === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTopTab(t)}
                style={{ paddingVertical: 12, flex: 1, alignItems: "center" }}
              >
                <Text
                  style={{
                    color: active ? COLORS.text : COLORS.faint,
                    fontWeight: active ? "700" : "600",
                    fontSize: 16,
                  }}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  /* ============================================
     🔥 RENDER
     ============================================ */
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.screen }}>
      {/* STATUS BAR BG */}
      <View
        style={{
          height: insets.top,
          backgroundColor: COLORS.navbar,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
        }}
      />

      {/* NAVBAR */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: COLORS.navbar,
        }}
      >
        <Text
          style={{
            color: COLORS.text,
            fontSize: 30,
            fontWeight: "900",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          Audiary
        </Text>

        {/* SEARCH INPUT */}
        <View
          style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.screen,
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 8,
              flex: 1,
            }}
          >
            <Feather
              name="search"
              size={18}
              color={COLORS.subtext}
              style={{ marginRight: 6 }}
            />

            <TextInput
              ref={searchInputRef}
              placeholder="Search for music"
              placeholderTextColor={COLORS.subtext}
              value={query}
              onChangeText={setQuery}
              onFocus={() => {
                if (!searchOpen) openSearchOverlay();
              }}
              style={{
                flex: 1,
                fontSize: 16,
                color: COLORS.text,
                paddingVertical: 6,
              }}
            />

            {searchOpen && query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Feather name="x" size={18} color={COLORS.subtext} />
              </TouchableOpacity>
            )}
          </View>

          {searchOpen && (
            <TouchableOpacity
              onPress={closeSearchOverlay}
              style={{ paddingLeft: 10 }}
            >
              <Text style={{ color: COLORS.subtext, fontSize: 16 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 🔥 TABS */}
      <TopTabs />

      {/* RESULTS */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {loadingSearch ? (
          <View style={{ marginTop: 50, alignItems: "center" }}>
            <ActivityIndicator size="large" color={COLORS.text} />
          </View>
        ) : activeTopTab === "Music" ? (
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
        ) : (
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Text style={{ color: COLORS.faint }}>
              No content for {activeTopTab} yet.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FOOTER */}
      <FooterBar router={router} insets={insets} />

      {/* ======================================================
         🔥 VIEW ALL OVERLAY
         ====================================================== */}
      {overlayType && (
        <Animated.View
          {...panResponderOverlay.panHandlers}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.screen,
            transform: [{ translateX: overlayAnim }],
            zIndex: 999,
          }}
        >
          <HeaderBar
            title={`"${overlayQuery}" in ${overlayType}`}
            onBack={closeOverlay}
          />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: SIZES.footerHeight + insets.bottom + 24,
            }}
          >
            {overlayLoading ? (
              <View style={{ marginTop: 50, alignItems: "center" }}>
                <ActivityIndicator size="large" color={COLORS.text} />
              </View>
            ) : (
              <FlatList
                data={overlayData}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                  <RowItem
                    item={item}
                    isArtist={overlayType === "Artists"}
                    onPress={() => openDetail(item, overlayType)}
                  />
                )}
              />
            )}
          </ScrollView>
        </Animated.View>
      )}

      {/* ======================================================
         🔥 DETAIL VIEW
         ====================================================== */}
      {detailOpen && (
        <Animated.View
          {...panResponderDetail.panHandlers}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.screen,
            transform: [{ translateX: detailAnim }],
            zIndex: 1000,
          }}
        >
          <HeaderBar
            title={
              detailType === "Tracks"
                ? "Track"
                : detailType === "Albums"
                ? "Album"
                : "Artist"
            }
            onBack={closeDetail}
          />

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
      )}

      {/* ======================================================
         🔥 SUB DETAIL VIEW
         ====================================================== */}
      {subDetailOpen && (
        <SubDetailView
          subDetailAnim={subDetailAnim}
          panResponderSubDetail={panResponderSubDetail}
          subDetailType={subDetailType}
          subDetailItem={subDetailItem}
          closeSubDetail={closeSubDetail}
          subDetailScrollRef={subDetailScrollRef}
          insets={insets}
        />
      )}
    </View>
  );
}
