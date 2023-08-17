import { defineStore } from "pinia";
import defaultShortCut from "@/assets/defaultShortCut";

const useSiteDataStore = defineStore("siteData", {
  state: () => {
    return {
      // 捷径数据
      shortcutData: defaultShortCut,
    };
  },
  actions: {
    setShortcutData(value) {
      this.shortcutData = value;
    },
  },
  // 开启数据持久化
  persist: {
    key: "siteData",
    storage: window.localStorage,
  },
});

export default useSiteDataStore;
