// app/search/tabs/music.tab.js

import {
  searchAlbumsSpotify,
  searchArtistsSpotify,
  searchTracksSpotify,
} from "../../shared/imports";

const MAX_PREVIEW = 15;

export default {
  key: "Music",
  placeholder: "Search Music",

  // Preview search (used on main Search page)
  previewSearch: async ({ query, signal }) => {
    const q = query.trim();
    if (q.length < 2) return { albums: [], tracks: [], artists: [] };

    const [a, t, r] = await Promise.all([
      searchAlbumsSpotify(q, { signal }),
      searchTracksSpotify(q, { signal }),
      searchArtistsSpotify(q, { signal }),
    ]);

    return {
      albums: (a?.albums || []).slice(0, MAX_PREVIEW),
      tracks: (t?.tracks || []).slice(0, MAX_PREVIEW),
      artists: (r?.artists || []).slice(0, MAX_PREVIEW),
    };
  },

  // View-all overlay fetch
  fetchAll: async ({ type, query }) => {
    if (type === "Albums") {
      const res = await searchAlbumsSpotify(query);
      return res?.albums || [];
    }
    if (type === "Tracks") {
      const res = await searchTracksSpotify(query);
      return res?.tracks || [];
    }
    if (type === "Artists") {
      const res = await searchArtistsSpotify(query);
      return res?.artists || [];
    }
    return [];
  },

  // Shape preview sections for UI
  getPreviewSections: ({ data, query }) => {
    return [
      { title: "Albums", type: "Albums", data: data?.albums || [], query },
      { title: "Tracks", type: "Tracks", data: data?.tracks || [], query },
      { title: "Artists", type: "Artists", data: data?.artists || [], query },
    ];
  },
};
