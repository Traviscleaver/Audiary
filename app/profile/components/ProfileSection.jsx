import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../shared/imports";

export default function ProfileSection({
  title,
  children,
  bottomMargin,
  onEditPress,
}) {
  return (
    <View style={{ marginTop: 18, marginBottom: bottomMargin ? 22 : 0 }}>
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "800" }}>
          {title}
        </Text>

        {!!onEditPress && (
          <TouchableOpacity onPress={onEditPress} activeOpacity={0.85}>
            <Text
              style={{
                color: COLORS.subtext,
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {children}
    </View>
  );
}
