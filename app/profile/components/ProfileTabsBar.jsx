// app/profile/components/ProfileTabsBar.jsx
import { View } from "../../shared/imports";
import { styles } from "../styles/styles";
import TabButton from "./TabButton";

export default function ProfileTabsBar({ tabs, activeTab, setActiveTab }) {
  return (
    <View style={styles.tabsBar}>
      {tabs.map((t) => (
        <TabButton key={t} label={t} active={activeTab === t} onPress={() => setActiveTab(t)} />
      ))}
    </View>
  );
}
