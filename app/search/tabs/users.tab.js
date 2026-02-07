// app/search/tabs/users.tab.js
import { searchUsers } from "../../../lib/api";

function normalizeQuery(q) {
  return String(q || "").trim();
}

export default {
  key: "Users",
  placeholder: "Search Users",

  previewSearch: async ({ query, limit = 15 } = {}) => {
    const q = normalizeQuery(query);
    if (q.length < 2) return { users: [] };

    const res = await searchUsers(q, limit);
    const users = res?.users || res?.results || res?.data || [];
    return { users };
  },

  fetchAll: async ({ query } = {}) => {
    const q = normalizeQuery(query);
    if (q.length < 2) return [];

    const res = await searchUsers(q);
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
