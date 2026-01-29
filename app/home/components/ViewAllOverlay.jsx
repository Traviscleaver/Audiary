import {
  ActivityIndicator,
  Animated,
  COLORS,
  FlatList,
  ScrollView,
  SIZES,
  View,
} from "../../shared/imports";
import { styles } from "../styles/styles";

/* Components */
import HeaderBar from "../../shared/components/search/DetailHeader";
import RowItem from "../../shared/components/search/SearchResultRow";

export default function ViewAllOverlay({
  overlayType,
  overlayData,
  overlayLoading,
  overlayAnim,
  overlayQuery,
  panResponderOverlay,
  closeOverlay,
  openDetail,
  insetsBottom,
}) {
  if (!overlayType) return null;

  return (
    <Animated.View
      {...panResponderOverlay.panHandlers}
      style={[
        styles.fullOverlay,
        { transform: [{ translateX: overlayAnim }], backgroundColor: COLORS.screen },
      ]}
    >
      <HeaderBar title={`"${overlayQuery}" in ${overlayType}`} onBack={closeOverlay} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: SIZES.footerHeight + insetsBottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {overlayLoading ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color={COLORS.text} />
          </View>
        ) : (
          <FlatList
            data={overlayData}
            scrollEnabled={false}
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
  );
}
