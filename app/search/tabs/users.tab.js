// app/search/tabs/lists.tab.js
export default {
  key: "Users",
  placeholder: "Search Users",

  previewSearch: async () => {
    // TODO: replace with your API call
    return { lists: [] };
  },

  fetchAll: async () => {
    // TODO: replace with your API call
    return [];
  },

  getPreviewSections: ({ data, query }) => {
    return [{ title: "Users", type: "Users", data: data?.lists || [], query }];
  },
};
