// app/search/tabs/index.js
import listsTab from "./lists.tab";
import musicTab from "./music.tab";
import reviewsTab from "./reviews.tab";
import usersTab from "./users.tab";

export const SEARCH_TABS = [musicTab, reviewsTab, listsTab, usersTab];

export function getTabByKey(key) {
  return SEARCH_TABS.find((t) => t.key === key) || SEARCH_TABS[0];
}
