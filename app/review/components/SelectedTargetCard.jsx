// app/review/components/SelectedTargetCard.jsx
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Feather,
  COLORS,
} from "../../shared/imports";
import { styles } from "../styles/styles";

/**
 * SelectedTargetCard
 *
 * Shows the current selected item being rated (song/album).
 * - Song cover should be derived from album cover (imageUrl already normalized).
 */
export default function SelectedTargetCard({
  target,
  onChangePress,
  onClosePress,
}) {
  if (!target) return null;

  return (
    <View style={styles.selectedCard}>
      <View style={styles.selectedImageWrap}>
        {target.imageUrl ? (
          <Image
            source={{ uri: target.imageUrl }}
            style={{ width: "100%", height: "100%" }}
          />
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
        <TouchableOpacity onPress={onChangePress} style={styles.selectedActionBtn}>
          <Text style={styles.selectedChangeText}>Change</Text>
        </TouchableOpacity>
      )}

      {onClosePress && (
        <TouchableOpacity onPress={onClosePress} style={styles.selectedActionBtn}>
          <Feather name="x" size={18} color={COLORS.subtext} />
        </TouchableOpacity>
      )}
    </View>
  );
}
