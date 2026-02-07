// app/profile/components/PlaceholderSlider.jsx
import { FlatList, View, memo } from "../../shared/imports";
import { styles } from "../styles/styles";

/**
 * Skeleton slider used while favourites load.
 */
const PlaceholderSlider = memo(function PlaceholderSlider({ count, type }) {
  const arr = Array.from({ length: count }).map((_, i) => ({
    id: `${type}-${i}`,
  }));

  return (
    <FlatList
      horizontal
      data={arr}
      keyExtractor={(i) => i.id}
      renderItem={() => (
        <View style={styles.sliderItem}>
          <View style={styles.cover} />
          <View style={{ height: 10 }} />
          <View style={styles.placeholderLine} />
        </View>
      )}
      contentContainerStyle={styles.sliderContent}
      showsHorizontalScrollIndicator={false}
    />
  );
});

export default PlaceholderSlider;
