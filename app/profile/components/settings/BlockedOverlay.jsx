// app/profile/components/settings/BlockedOverlay.jsx
import { Animated, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "../../../shared/imports";
import { overlayStyles as styles } from "./styles";

/**
 * “Blocked” sub overlay: slides in from the right.
 * Uses safe-area padding so the header is always visible under the notch.
 */
export default function BlockedOverlay({ subAnim, onClose, screenWidth }) {
  const insets = useSafeAreaInsets();

  const translateX = subAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[styles.subOverlay, { transform: [{ translateX }] }]}>
      {/* HEADER (safe-area aware) */}
      <View
        style={[
          styles.subHeader,
          {
            paddingTop: insets.top,
            height: 54 + insets.top, // ✅ ensure header area includes notch
          },
        ]}
      >
        <TouchableOpacity onPress={onClose} activeOpacity={0.75}>
          <Text style={styles.subBack}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.subTitle}>Blocked</Text>

        {/* keeps title centered */}
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 12 }}>
        <View style={styles.emptyStateWrap}>
          <Text style={styles.emptyStateTitle}>No blocked users</Text>
          <Text style={styles.emptyStateSub}>Users you block will appear here.</Text>
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>
    </Animated.View>
  );
}
