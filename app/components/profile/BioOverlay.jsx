import {
  Animated,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet
} from "../../lib/imports";

import { COLORS } from "../../lib/imports";

export default function BioOverlay({ subAnim, closeBioOverlay }) {
  return (
    <Animated.View style={[styles.settingsOverlay, { opacity: subAnim }]}>
      <TouchableOpacity style={styles.overlayBackground} onPress={closeBioOverlay} />

      <Animated.View
        style={[
          styles.subSheet,
          {
            transform: [
              {
                translateY: subAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [500, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.sheetHeader}>
          <TouchableOpacity onPress={closeBioOverlay}>
            <Text style={styles.sheetCancel}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>Bio</Text>

          <TouchableOpacity onPress={closeBioOverlay}>
            <Text style={styles.sheetSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 16 }}>
          <TextInput
            multiline
            placeholder="Write something..."
            placeholderTextColor={COLORS.subtext}
            style={styles.bioInput}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  settingsOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    zIndex: 3000,
  },
  overlayBackground: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },

  subSheet: {
    height: "60%",
    width: "100%",
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  sheetCancel: { color: COLORS.subtext, fontSize: 16 },
  sheetTitle: { color: COLORS.text, fontSize: 18, fontWeight: "800" },
  sheetSave: { color: COLORS.active, fontSize: 16, fontWeight: "700" },

  bioInput: {
    width: "100%",
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 8,
  },
});
