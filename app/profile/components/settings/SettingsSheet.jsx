// app/profile/components/settings/SettingsSheet.jsx
import { Animated, View } from "../../../shared/imports";
import SettingsContent from "./SettingsContent";
import SettingsHeader from "./SettingsHeader";
import { overlayStyles as styles } from "./styles";

/**
 * The sliding panel itself (layout container).
 */
export default function SettingsSheet({
  top,
  translateX,
  onBack,
  onSave,
  ...contentProps
}) {
  return (
    <Animated.View
      style={[
        styles.settingsSheet,
        {
          top,
          transform: [{ translateX }],
        },
      ]}
    >
      <SettingsHeader onBack={onBack} onSave={onSave} />

      <View style={{ flex: 1 }}>
        <SettingsContent {...contentProps} />
      </View>
    </Animated.View>
  );
}
