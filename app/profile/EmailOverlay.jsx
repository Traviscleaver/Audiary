import {
  Animated,
  COLORS,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "../shared/imports";

export default function EmailOverlay({
  subAnim,
  email,
  setEmail,
  closeEmailOverlay,
}) {
  return (
    <Animated.View style={[styles.settingsOverlay, { opacity: subAnim }]}>
      <TouchableOpacity
        style={styles.overlayBackground}
        onPress={closeEmailOverlay}
      />

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
          <TouchableOpacity onPress={closeEmailOverlay}>
            <Text style={styles.sheetCancel}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>Email</Text>

          <TouchableOpacity onPress={closeEmailOverlay}>
            <Text style={styles.sheetSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingLeft: 15, paddingTop: 0 }}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={COLORS.subtext}
            style={[styles.bioInput, { minHeight: 50 }]}
            autoCapitalize="none"
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
