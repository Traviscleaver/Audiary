// app/profile/components/settings/SettingsHeader.jsx
import { Text, TouchableOpacity, View } from "../../../shared/imports";
import { overlayStyles as styles } from "./styles";

export default function SettingsHeader({ onBack, onSave }) {
  return (
    <View style={styles.sheetHeader}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.sheetCancel}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.sheetTitle}>Settings</Text>

      <TouchableOpacity onPress={onSave}>
        <Text style={styles.sheetSave}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
