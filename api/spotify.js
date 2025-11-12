import { encode as btoa } from "base-64";

const CLIENT_ID = "c7d7aa47c5554dff888bf92c0a16928e";
const CLIENT_SECRET = "1b7386a050114a7eaf57b6569e386d12";

async function getSpotifyToken() {
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

// Helper: deduplicate by name + artist/ID, keep highest popularity
function deduplicateAndSort(items, keyFn) {
  const map = {};
  items.forEach((item) => {
    const key = keyFn(item);
    if (!map[key] || item.popularity > map[key].popularity) {
      map[key] = item;
    }
  });
  return Object.values(map).sort((a, b) => b.popularity - a.popularity);
}

// Albums
export async function searchAlbumsSpotify(query) {
  if (!query) return { albums: [] };
  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=album&limit=50`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const albums = data.albums?.items || [];

    const mapped = albums.map((album) => {
      const artist = album.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
      return {
        id: album.id,
        title: album.name.trim(),
        artist,
        type: album.album_type,
        coverUrl: album.images?.[1]?.url || album.images?.[0]?.url || null,
        popularity: album.popularity || 0,
        release_date: album.release_date,
      };
    });

    return { albums: deduplicateAndSort(mapped, (a) => `${a.title.toLowerCase()}|${a.artist.toLowerCase()}`) };
  } catch (err) {
    console.error("Spotify albums search error:", err);
    return { albums: [] };
  }
}

// Tracks
export async function searchTracksSpotify(query) {
  if (!query) return { tracks: [] };
  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=50`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const tracks = data.tracks?.items || [];

    const mapped = tracks.map((track) => {
      const artist = track.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
      return {
        id: track.id,
        name: track.name,
        artist,
        popularity: track.popularity || 0,
        album: track.album?.name || "",
        coverUrl: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || null,
      };
    });

    return { tracks: deduplicateAndSort(mapped, (a) => `${a.name.toLowerCase()}|${a.artist.toLowerCase()}`) };
  } catch (err) {
    console.error("Spotify tracks search error:", err);
    return { tracks: [] };
  }
}

// Artists
export async function searchArtistsSpotify(query) {
  if (!query) return { artists: [] };
  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=artist&limit=50`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const artists = data.artists?.items || [];

    const mapped = artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      popularity: artist.popularity || 0,
      imageUrl: artist.images?.[1]?.url || artist.images?.[0]?.url || null,
      genres: artist.genres || [],
    }));

    return { artists: deduplicateAndSort(mapped, (a) => a.name.toLowerCase()) };
  } catch (err) {
    console.error("Spotify artists search error:", err);
    return { artists: [] };
  }
}
