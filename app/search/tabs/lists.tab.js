// app/search/tabs/reviews.tab.js
export default {
  key: "Lists",
  placeholder: "Search Lists",

  previewSearch: async () => {
    // TODO: replace with your API call
    return { reviews: [] };
  },

  fetchAll: async () => {
    // TODO: replace with your API call
    return [];
  },

  getPreviewSections: ({ data, query }) => {
    return [
      { title: "Lists", type: "Lists", data: data?.reviews || [], query },
    ];
  },
};
