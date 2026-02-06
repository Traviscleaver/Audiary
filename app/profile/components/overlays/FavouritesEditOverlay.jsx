import { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, Feather } from "../../../shared/imports";
import AddFavouriteTile from "../favourites/AddFavouriteTile";
import EditFavouriteTile from "../favourites/EditFavouriteTile";

export default function FavouritesEditOverlay({
  open,
  onClose,
  title,
  items = [], // up to 3 hydrated favourites
  onRemoveItem, // async (item) => void
  onPressAdd, // () => void (optional)
  onToggleHide, // (nextHiddenBool) => void
  isHidden = false,
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: open ? 220 : 180,
      useNativeDriver: true,
    }).start();
  }, [open, anim]);

  // Exactly 3 slots
  const slots = useMemo(() => {
    return [items[0] || null, items[1] || null, items[2] || null];
  }, [items]);

  if (!open) return null;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  const handleRemove = async (it) => {
    if (!it) return;
    if (busyId) return;

    Alert.alert(
      "Remove favourite?",
      "This will remove it from your favourites.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setBusyId(`${it.item_type}-${it.item_id}`);
              await onRemoveItem?.(it);
            } finally {
              setBusyId(null);
            }
          },
        },
      ]
    );
  };

  const hideLabel = isHidden ? "Show section on profile" : "Hide section on profile";

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        zIndex: 9999,
      }}
    >
      {/* tap backdrop to close */}
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />

      <Animated.View
        style={{
          transform: [{ translateY }],
          backgroundColor: COLORS.card,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          paddingTop: 14,
          paddingBottom: 18,
        }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "900" }}>
            {title || "Edit favourites"}
          </Text>

          <TouchableOpacity onPress={onClose} activeOpacity={0.85}>
            <Feather name="x" size={20} color={COLORS.subtext} />
          </TouchableOpacity>
        </View>

        {/* 3-slot grid */}
        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 8,
          }}
        >
          {slots.map((it, idx) => {
            if (it) {
              const idKey = `${it.item_type}-${it.item_id}`;
              const isBusy = busyId === idKey;

              return (
                <View key={idKey} style={{ opacity: isBusy ? 0.55 : 1 }}>
                  <EditFavouriteTile
                    item={it}
                    onPress={() => {}}
                    onRemove={() => handleRemove(it)}
                  />
                </View>
              );
            }

            // empty slot: show + tile (optional)
            return (
              <AddFavouriteTile
                key={`add-${idx}`}
                onPress={() => onPressAdd?.()}
              />
            );
          })}
        </View>

        {/* Hide/Show section button */}
        <TouchableOpacity
          onPress={() => onToggleHide?.(!isHidden)}
          activeOpacity={0.9}
          style={{
            marginTop: 18,
            marginHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: COLORS.divider,
            backgroundColor: "transparent",
          }}
        >
          <Text style={{ color: COLORS.subtext, fontWeight: "800" }}>
            {hideLabel}
          </Text>
        </TouchableOpacity>

        {/* Bottom padding space */}
        <View style={{ height: 8 }} />
      </Animated.View>
    </View>
  );
}
