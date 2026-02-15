// app/shared/components/review/SelectedTargetCard.jsx
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "../../imports";
import { styles } from "./styles/styles";

export default function SelectedTargetCard({ target, onClosePress }) {
  if (!target) return null;

  const typeLabel = target.targetType === "album" ? "ALBUM" : "SONG";

  return (
    <View style={styles.selectedCardWrap}>
      <View style={styles.selectedCard}>
        <View style={styles.selectedImageWrap}>
          {target.imageUrl ? (
            <Image source={{ uri: target.imageUrl }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <View style={styles.selectedImageFallback} />
          )}
        </View>

        <View style={styles.selectedTextWrap}>
          <Text numberOfLines={1} style={styles.selectedTitle}>
            {target.title}
          </Text>
          {!!target.subtitle && (
            <Text numberOfLines={1} style={styles.selectedSubtitle}>
              {target.subtitle}
            </Text>
          )}
        </View>

        <View style={styles.selectedRightActions}>
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>{typeLabel}</Text>
          </View>

          <TouchableOpacity onPress={onClosePress} style={styles.selectedActionBtn} activeOpacity={0.8}>
            <Feather name="x" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
