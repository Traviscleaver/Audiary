import SubDetailView from "../../shared/components/search/overlays/NestedDetailOverlay";

export default function SubDetailOverlay({
  subDetailOpen,
  subDetailAnim,
  panResponderSubDetail,
  subDetailType,
  subDetailItem,
  closeSubDetail,
  subDetailScrollRef,
  insets,
}) {
  if (!subDetailOpen) return null;

  return (
    <SubDetailView
      subDetailAnim={subDetailAnim}
      panResponderSubDetail={panResponderSubDetail}
      subDetailType={subDetailType}
      subDetailItem={subDetailItem}
      closeSubDetail={closeSubDetail}
      subDetailScrollRef={subDetailScrollRef}
      insets={insets}
    />
  );
}
