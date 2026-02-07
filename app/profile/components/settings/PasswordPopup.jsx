// app/profile/components/settings/PasswordPopup.jsx
import { Text, TouchableOpacity, View } from "../../../shared/imports";
import { overlayStyles as styles } from "./styles";

/**
 * Simple modal popup.
 */
export default function PasswordPopup({ onClose }) {
  return (
    <View style={styles.popupWrap} pointerEvents="box-none">
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.popupBackdrop} />
      <View style={styles.popupCard}>
        <Text style={styles.popupText}>Check your email to change password.</Text>

        <TouchableOpacity activeOpacity={0.85} onPress={onClose} style={styles.popupBtn}>
          <Text style={styles.popupBtnText}>Okay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
