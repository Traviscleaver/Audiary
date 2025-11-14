
import {
  getTopAlbumsSpotify,
  getTopTracksSpotify,
  useEffect,
  useState,
} from "../lib/imports";

export default function usePopularSection() {
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
        console.warn("Popular section error:", e);
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
