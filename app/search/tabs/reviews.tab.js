// app/search/tabs/lists.tab.js
export default {
  key: "Reviews",
  placeholder: "Search Reviews",

  previewSearch: async () => {
    // TODO: replace with your API call
    return { lists: [] };
  },

  fetchAll: async () => {
    // TODO: replace with your API call
    return [];
  },

  getPreviewSections: ({ data, query }) => {
    return [{ title: "Reviews", type: "Reviews", data: data?.lists || [], query }];
  },
};
