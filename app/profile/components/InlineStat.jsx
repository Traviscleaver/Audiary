// app/profile/components/InlineStat.jsx
import { Text, View } from "../../shared/imports";
import { styles } from "../styles/styles";

export default function InlineStat({ count, label }) {
  return (
    <View style={styles.inlineGroupIg}>
      <Text style={styles.inlineCountIg}>{count}</Text>
      <Text style={styles.inlineLabelIg}>{label}</Text>
    </View>
  );
}
