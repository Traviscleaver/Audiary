/**
 * usePopularMusic
 * Fetches a curated set of popular/top albums and tracks for display in UI sections.
 * Returns the lists and separate loading states for albums and tracks.
 */

import {
  getTopAlbumsSpotify,
  getTopTracksSpotify,
  useEffect,
  useState,
} from "../imports";

export default function usePopularMusic() {
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);

  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [albumsRes, tracksRes] = await Promise.all([
          getTopAlbumsSpotify(39),
          getTopTracksSpotify(39),
        ]);

        if (!mounted) return;

        setPopularAlbums(albumsRes.albums || []);
        setTracks(tracksRes.tracks || []);
      } catch (e) {
        console.warn("Popular music error:", e);
      } finally {
        if (!mounted) return;
        setLoadingAlbums(false);
        setLoadingTracks(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    popularAlbums,
    tracks,
    loadingAlbums,
    loadingTracks,
  };
}
