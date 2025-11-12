import { Text, View } from "react-native";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#202930",
      }}
    >
      <Text>Popular this week</Text>
    </View>
  );
}
