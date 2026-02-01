// app/search/ui/TabResults.jsx
import SectionList from "../../shared/components/search/sections/SearchResultsPreviewSection";
import { ActivityIndicator, COLORS, Text, View } from "../../shared/imports";

export default function TabResults({
  loading,
  tab,
  data,
  query,
  openDetail,
  openOverlay,
}) {
  if (loading) {
    return (
      <View style={{ marginTop: 50, alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.text} />
      </View>
    );
  }

  const q = query?.trim() || "";
  if (!q) {
    return (
      <View style={{ marginTop: 40, alignItems: "center" }}>
        <Text style={{ color: COLORS.faint }}>Start typing to search.</Text>
      </View>
    );
  }

  const sections = tab.getPreviewSections({ data, query: q });
  const hasAny = sections.some((s) => (s.data || []).length > 0);

  if (!hasAny) {
    return (
      <View style={{ marginTop: 40, alignItems: "center" }}>
        <Text style={{ color: COLORS.faint }}>No results.</Text>
      </View>
    );
  }

  return (
    <>
      {sections.map((s) => (
        <SectionList
          key={s.type}
          title={s.title}
          data={s.data}
          type={s.type}
          onOpen={openDetail}
          onViewAll={(type) => openOverlay(type, s.query)}
        />
      ))}
    </>
  );
}
