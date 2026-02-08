import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../shared/imports";
import { Feather } from "@expo/vector-icons";

import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";

import AddFavouriteTile from "../favourites/AddFavouriteTile";
import EditFavouriteTile from "../favourites/EditFavouriteTile";

import { reorderFavourites } from "../../../../lib/api"; // adjust path if needed

export default function FavouritesEditOverlay({
  open,
  onClose,
  title,
  items = [], // hydrated favourites (include item_id, item_type, rank)
  onRemoveItem,
  onPressAdd,
  onToggleHide,
  isHidden = false,
  onLocalReorder, // (bucketItemsWithNewRanks) => void
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

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  // Determine bucket type from first item
  const bucketType = useMemo(() => {
    const it = items?.find(Boolean);
    if (!it) return null;
    if (it.item_type === "album") return "Albums";
    if (it.item_type === "song") return "Tracks";
    if (it.item_type === "artist") return "Artists";
    return null;
  }, [items]);

  // Build fixed 3-slot array (rank 1..3)
  const data = useMemo(() => {
    const byRank = (a, b) => (a.rank ?? 999) - (b.rank ?? 999);
    const sorted = (items || []).slice().sort(byRank);

    const slots = [null, null, null];

    // put ranked items into their slots
    for (const it of sorted) {
      const r = Number(it.rank);
      if (r === 1 || r === 2 || r === 3) {
        slots[r - 1] = it;
      }
    }

    // fill remaining slots with any unranked items
    for (const it of sorted) {
      if (slots.includes(it)) continue;
      const emptyIndex = slots.findIndex((x) => !x);
      if (emptyIndex !== -1) slots[emptyIndex] = it;
    }

    return slots.map((it, idx) => ({
      key: it ? `${it.item_type}-${it.item_id}` : `empty-${idx + 1}`,
      slotRank: idx + 1,
      item: it,
    }));
  }, [items]);

  if (!open) return null;

  const handleRemove = async (it) => {
    if (!it) return;
    if (busyId) return;

    Alert.alert("Remove favourite?", "This will remove it from your favourites.", [
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
    ]);
  };

  const hideLabel = isHidden ? "Show section on profile" : "Hide section on profile";

  // Match your tile size; tweak if your tiles are different
  const TILE_WRAP_W = 110;

  const renderSlot = ({ item, drag, isActive }) => {
    const it = item.item;

    // Empty slot
    if (!it) {
      return (
        <ScaleDecorator>
          <View style={{ width: TILE_WRAP_W, opacity: isActive ? 0.9 : 1 }}>
            <AddFavouriteTile onPress={() => onPressAdd?.()} />
          </View>
        </ScaleDecorator>
      );
    }

    const idKey = `${it.item_type}-${it.item_id}`;
    const isBusy = busyId === idKey;

    return (
      <ScaleDecorator>
        <View style={{ width: TILE_WRAP_W, opacity: isBusy ? 0.55 : isActive ? 0.9 : 1 }}>
          {/* The tile itself */}
          <EditFavouriteTile
            item={it}
            onPress={() => {}}
            onRemove={() => handleRemove(it)}
          />

          {/* ✅ Dedicated drag handle so nested touchables don't block dragging */}
          <TouchableOpacity
            onLongPress={drag}
            delayLongPress={120}
            activeOpacity={0.85}
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              paddingVertical: 6,
              paddingHorizontal: 8,
              borderRadius: 10,
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          >
            <Feather name="menu" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    );
  };

  const onDragEnd = async ({ data: next }) => {
    // next is the 3-slot array in new order
    const order = next
      .map((slot, idx) => {
        const it = slot.item;
        if (!it) return null;
        return { item_id: it.item_id, rank: idx + 1 };
      })
      .filter(Boolean);

    // optimistic local update
    if (onLocalReorder) {
      const updated = next
        .map((slot, idx) => (slot.item ? { ...slot.item, rank: idx + 1 } : null))
        .filter(Boolean);
      onLocalReorder(updated);
    }

    // persist to server
    try {
      if (bucketType) {
        await reorderFavourites(bucketType, order);
      }
    } catch (e) {
      console.log("favourite reorder failed", e?.message || e);
    }
  };

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

        <Text style={{ color: COLORS.subtext, marginHorizontal: 16, marginBottom: 10 }}>
          Hold the handle and drag to reorder.
        </Text>

        {/* 3-slot draggable row */}
        <View style={{ paddingHorizontal: 16 }}>
          <DraggableFlatList
            data={data}
            keyExtractor={(x) => x.key}
            horizontal
            scrollEnabled={false}          // ✅ important for horizontal drag
            activationDistance={0}         // ✅ easier to activate
            dragItemOverflow               // ✅ lets item float above bounds
            onDragEnd={onDragEnd}
            renderItem={renderSlot}
            contentContainerStyle={{ gap: 12 }}
            showsHorizontalScrollIndicator={false}
          />
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
          <Text style={{ color: COLORS.subtext, fontWeight: "800" }}>{hideLabel}</Text>
        </TouchableOpacity>

        <View style={{ height: 8 }} />
      </Animated.View>
    </View>
  );
}
