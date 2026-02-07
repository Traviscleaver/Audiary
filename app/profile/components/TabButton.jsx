// app/profile/components/TabButton.jsx
import { Text, TouchableOpacity, View, memo } from "../../shared/imports";
import { styles } from "../styles/styles";

const TabButton = memo(function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.tabWrap} onPress={onPress}>
      <View style={styles.tabPad}>
        <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
      </View>
      <View style={[styles.tabUnderline, active && styles.tabUnderlineOn]} />
    </TouchableOpacity>
  );
});

export default TabButton;
