// app/shared/components/review/SelectedTargetCard.jsx
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS, Feather } from "../../imports";
import { styles } from "./styles/styles";

export default function SelectedTargetCard({ target, onChangePress, onClosePress }) {
  if (!target) return null;

  return (
    <View style={styles.selectedCard}>
      <View style={styles.selectedImageWrap}>
        {target.imageUrl ? (
          <Image source={{ uri: target.imageUrl }} style={{ width: "100%", height: "100%" }} />
        ) : (
          <View style={styles.selectedImageFallback}>
            <Feather name="music" size={20} color={COLORS.subtext} />
          </View>
        )}
      </View>

      <View style={styles.selectedTextWrap}>
        <Text style={styles.selectedTitle} numberOfLines={1}>
          {target.title}
        </Text>
        <Text style={styles.selectedSubtitle} numberOfLines={1}>
          {target.subtitle}
        </Text>
      </View>

      {onChangePress && (
        <TouchableOpacity onPress={onChangePress} style={styles.selectedActionBtn} activeOpacity={0.8}>
          <Feather name="x" size={18} color={COLORS.subtext} />
        </TouchableOpacity>
      )}
    </View>
  );
}
