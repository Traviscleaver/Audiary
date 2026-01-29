import { ALBUMS_TAB } from "../libs/constants";

export function getPopularSectionState({
  tab,
  popularAlbums,
  tracks,
  loadingAlbums,
  loadingTracks,
}) {
  const isAlbums = tab === ALBUMS_TAB;

  return {
    isAlbums,
    items: isAlbums ? popularAlbums : tracks,
    loading: isAlbums ? loadingAlbums : loadingTracks,
  };
}

export function getDetailHeaderTitle(detailType) {
  if (detailType === "Tracks") return "Track";
  if (detailType === "Albums") return "Album";
  return "Artist";
}
