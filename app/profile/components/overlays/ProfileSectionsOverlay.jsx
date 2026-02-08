import React, { useEffect, useRef, useState } from "react";
import { Animated, Switch, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../shared/imports";
import { Feather } from "@expo/vector-icons";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";

export default function ProfileSectionsOverlay({
  open,
  onClose,
  blocks,
  setBlocks,
  onReorder,
  onToggleDisplay,
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [local, setLocal] = useState([]);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: open ? 220 : 180,
      useNativeDriver: true,
    }).start();
  }, [open, anim]);

  useEffect(() => {
    const sorted = (Array.isArray(blocks) ? blocks : [])
      .slice()
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
    setLocal(sorted);
  }, [blocks, open]);

  if (!open) return null;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  const labelFor = (b) => {
    if (b.block_type === "favorites") {
      const s = String(b.subtype || "").toLowerCase();
      if (s === "albums") return "Favourite Albums";
      if (s === "tracks") return "Favourite Songs";
      if (s === "artists") return "Favourite Artists";
      return `Favourites: ${b.subtype || "Unknown"}`;
    }
    if (b.block_type === "stats") return `Stats: ${b.subtype || "Stats"}`;
    if (b.block_type === "playlist") return "Playlist";
    return b.block_type || "Block";
  };

  const persistOrder = async (nextList) => {
    const order = nextList.map((b, idx) => ({
      profile_block_id: b.profile_block_id,
      rank: idx + 1,
    }));

    // optimistic local + parent
    setLocal(nextList);
    setBlocks?.(
      nextList.map((b, idx) => ({
        ...b,
        rank: idx + 1,
      }))
    );

    try {
      await onReorder?.(order);
    } catch (e) {
      console.log("reorder failed", e?.message || e);
    }
  };

  const toggleDisplay = async (item, nextShown) => {
    const nextDisplay = !!nextShown;

    setLocal((prev) =>
      prev.map((b) =>
        b.profile_block_id === item.profile_block_id
          ? { ...b, display: nextDisplay }
          : b
      )
    );

    setBlocks?.((prev) =>
      (prev || []).map((b) =>
        b.profile_block_id === item.profile_block_id
          ? { ...b, display: nextDisplay }
          : b
      )
    );

    try {
      await onToggleDisplay?.(item.profile_block_id, nextDisplay);
    } catch (e) {
      console.log("toggle display failed", e?.message || e);
    }
  };

  const renderItem = ({ item, drag, isActive }) => {
    const shown = item.display !== false;

    return (
      <ScaleDecorator>
        <View
          style={{
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: COLORS.divider,
            opacity: isActive ? 0.85 : 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
            <TouchableOpacity
              onLongPress={drag}
              delayLongPress={120}
              activeOpacity={0.85}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderRadius: 10,
                backgroundColor: COLORS.divider,
              }}
            >
              {/* hamburger */}
              <Feather name="menu" size={16} color={COLORS.subtext} />
            </TouchableOpacity>

            <Text style={{ color: COLORS.text, fontWeight: "800", flexShrink: 1 }} numberOfLines={1}>
              {labelFor(item)}
            </Text>
          </View>

          <Switch value={shown} onValueChange={(v) => toggleDisplay(item, v)} />
        </View>
      </ScaleDecorator>
    );
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
          padding: 16,
          maxHeight: "75%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "900" }}>
            Customize profile
          </Text>

          <TouchableOpacity onPress={onClose} activeOpacity={0.85}>
            <Feather name="x" size={20} color={COLORS.subtext} />
          </TouchableOpacity>
        </View>

        <Text style={{ color: COLORS.subtext, marginBottom: 10 }}>
          Drag the handle to reorder. Toggle to show/hide.
        </Text>

        <DraggableFlatList
          data={local}
          keyExtractor={(item) => String(item.profile_block_id)}
          renderItem={renderItem}
          onDragEnd={async ({ data }) => {
            await persistOrder(data);
          }}
          activationDistance={10}
        />

        <View style={{ height: 8 }} />
      </Animated.View>
    </View>
  );
}
