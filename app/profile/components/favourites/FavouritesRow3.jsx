import { View } from "react-native";
import AddFavouriteTile from "./AddFavouriteTile";
import FavouriteTile from "./FavouriteTile";

/**
 * Exactly 3 slots, evenly spaced.
 * - Real items fill from left
 * - Missing slots become + tiles
 */
export default function FavouritesRow3({ items = [], onPressAdd, onPressItem }) {
  const slots = [items[0] || null, items[1] || null, items[2] || null];

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        paddingHorizontal: 16,
      }}
    >
      {slots.map((it, idx) =>
        it ? (
          <FavouriteTile
            key={`${it.item_type}-${it.item_id}-${idx}`}
            item={it}
            onPress={() => onPressItem?.(it)}
          />
        ) : (
          <AddFavouriteTile key={`add-${idx}`} onPress={onPressAdd} />
        )
      )}
    </View>
  );
}
