// app/profile/components/ProfileTopBar.jsx
import { Animated } from "react-native";
import {
    COLORS,
    Feather,
    Text,
    TouchableOpacity,
    View,
} from "../../shared/imports";
import { styles } from "../styles/styles";

/**
 * Sticky-then-hide top bar overlay.
 * Controlled by translateY passed from parent.
 */
export default function ProfileTopBar({
  settingsOpen,
  topBarTranslateY,
  totalHeight,
  paddingTop,
  rowHeight,
  usernameTitle,
  onOpenCreate,
  onOpenSettings,
}) {
  return (
    <Animated.View
      style={[
        styles.topBarContainer,
        {
          height: totalHeight,
          paddingTop,
          transform: [{ translateY: topBarTranslateY }],
          zIndex: settingsOpen ? 0 : 997,
        },
      ]}
      pointerEvents={settingsOpen ? "none" : "box-none"}
    >
      <View style={[styles.topBar, { height: rowHeight }]}>
        <TouchableOpacity style={styles.topBarIconBtn} onPress={onOpenCreate}>
          <Feather name="plus" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          {usernameTitle}
        </Text>

        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.topBarIconBtn} onPress={onOpenSettings}>
            <Feather name="more-horizontal" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
