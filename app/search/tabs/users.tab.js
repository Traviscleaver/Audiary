// app/search/tabs/users.tab.js
import { api } from "../../../lib/api";

function normalizeQuery(q) {
  return String(q || "").trim();
}

export default {
  key: "Users",
  placeholder: "Search Users",

  previewSearch: async ({ query, limit = 15 } = {}) => {
    const q = normalizeQuery(query);
    if (q.length < 2) return { users: [] };

    // ✅ NO /api here — your server route is /users/search
    const res = await api(
      `/users/search?q=${encodeURIComponent(q)}&limit=${limit}`
    );

    const users = res?.users || res?.results || res?.data || [];
    return { users };
  },

  fetchAll: async ({ query } = {}) => {
    const q = normalizeQuery(query);
    if (q.length < 2) return [];

    // ✅ NO /api here either
    const res = await api(`/users/search?q=${encodeURIComponent(q)}`);

    const users = res?.users || res?.results || res?.data || [];
    return users;
  },

  getPreviewSections: ({ data, query }) => {
    return [
      {
        title: "Users",
        type: "Users",
        data: data?.users || [],
        query,
      },
    ];
  },
};
