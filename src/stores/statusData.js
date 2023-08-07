import { defineStore } from "pinia";

const useStatusDataStore = defineStore("statusData", {
  state: () => {
    return {
      // 壁纸状态
      imgLoadStatus: false,
      // 站点状态
      // normal 正常 / focus 搜索 / box 盒子 / set 设置
      siteStatus: "normal",
      // 切换搜索引擎
      engineChangeStatus: false,
      // 搜索框文本
      searchInputValue: "",
    };
  },
  getters: {},
  actions: {
    setImgLoadStatus(value) {
      this.imgLoadStatus = value;
    },
    setSiteStatus(value) {
      this.siteStatus = value;
      this.searchInputValue = "";
    },
    setEngineChangeStatus(value) {
      this.engineChangeStatus = value;
    },
    setSearchInputValue(value) {
      this.searchInputValue = value;
    },
  },
});

export default useStatusDataStore;
