// shared/hooks/usePopularMusic.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { getTopAlbumsSpotify, getTopTracksSpotify } from "../imports";

const INITIAL_ALBUMS = 18;

function pageSize(width) {
  return width >= 820 ? 20 : 18;
}

export default function usePopularMusic() {
  const { width } = useWindowDimensions();
  const PAGE = useMemo(() => pageSize(width), [width]);

  const [popularAlbums, setPopularAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);

  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(false);

  const [albumsOffset, setAlbumsOffset] = useState(0);
  const [tracksOffset, setTracksOffset] = useState(0);

  const [albumsHasMore, setAlbumsHasMore] = useState(true);
  const [tracksHasMore, setTracksHasMore] = useState(true);

  const [albumsLoadingMore, setAlbumsLoadingMore] = useState(false);
  const [tracksLoadingMore, setTracksLoadingMore] = useState(false);

  const [tracksLoaded, setTracksLoaded] = useState(false);

  const albumsLockRef = useRef(false);
  const tracksLockRef = useRef(false);

  // preload 18 albums
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingAlbums(true);
        const res = await getTopAlbumsSpotify(INITIAL_ALBUMS, 0);
        const first = res?.albums || [];

        if (!mounted) return;

        setPopularAlbums(first);
        setAlbumsOffset(first.length);
        setAlbumsHasMore(first.length === INITIAL_ALBUMS);
      } catch (e) {
        console.warn("Popular albums error:", e);
      } finally {
        if (!mounted) return;
        setLoadingAlbums(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ awaitable "load more albums"
  const loadMoreAlbums = async () => {
    if (albumsLockRef.current) return false;
    if (!albumsHasMore) return false;

    albumsLockRef.current = true;
    setAlbumsLoadingMore(true);

    try {
      const offset = albumsOffset;
      const res = await getTopAlbumsSpotify(PAGE, offset);
      const next = res?.albums || [];

      setPopularAlbums((prev) => {
        const seen = new Set(prev.map((x) => x?.id));
        const filtered = next.filter((x) => x?.id && !seen.has(x.id));
        return prev.concat(filtered);
      });

      setAlbumsOffset((prev) => prev + next.length);
      if (next.length < PAGE) setAlbumsHasMore(false);

      return true;
    } catch (e) {
      console.warn("Load more albums error:", e);
      return false;
    } finally {
      setAlbumsLoadingMore(false);
      albumsLockRef.current = false;
    }
  };

  const ensureTracksLoaded = async () => {
    if (tracksLoaded) return true;
    if (tracksLockRef.current) return false;

    tracksLockRef.current = true;
    setLoadingTracks(true);

    try {
      const res = await getTopTracksSpotify(PAGE, 0);
      const first = res?.tracks || [];

      setTracks(first);
      setTracksOffset(first.length);
      setTracksHasMore(first.length === PAGE);
      setTracksLoaded(true);

      return true;
    } catch (e) {
      console.warn("Popular tracks error:", e);
      return false;
    } finally {
      setLoadingTracks(false);
      tracksLockRef.current = false;
    }
  };

  // ✅ awaitable "load more tracks"
  const loadMoreTracks = async () => {
    if (!tracksLoaded) return false;
    if (tracksLockRef.current) return false;
    if (!tracksHasMore) return false;

    tracksLockRef.current = true;
    setTracksLoadingMore(true);

    try {
      const offset = tracksOffset;
      const res = await getTopTracksSpotify(PAGE, offset);
      const next = res?.tracks || [];

      setTracks((prev) => {
        const seen = new Set(prev.map((x) => x?.id));
        const filtered = next.filter((x) => x?.id && !seen.has(x.id));
        return prev.concat(filtered);
      });

      setTracksOffset((prev) => prev + next.length);
      if (next.length < PAGE) setTracksHasMore(false);

      return true;
    } catch (e) {
      console.warn("Load more tracks error:", e);
      return false;
    } finally {
      setTracksLoadingMore(false);
      tracksLockRef.current = false;
    }
  };

  return {
    popularAlbums,
    tracks,

    loadingAlbums,
    loadingTracks,

    ensureTracksLoaded,

    loadMoreAlbums,
    albumsLoadingMore,
    albumsHasMore,

    loadMoreTracks,
    tracksLoadingMore,
    tracksHasMore,
    tracksLoaded,
  };
}
