import { defineStore } from "pinia";

const useSetDataStore = defineStore("setData", {
  state: () => {
    return {
      // 壁纸类别
      // 0 本地 / 1 必应 / 2 随机风景 / 3 随机动漫 / 4 自定义
      backgroundType: 2,
      backgroundCustom: "",
      // 壁纸遮罩
      showBackgroundGray: true,
      // 搜索引擎
      searchEngine: "bing",
      lastSearchEngine: "bing",
      customEngine: {},
      // 清空搜索框
      showCleanInput: true,
      // 搜索框自动 focus
      autoFocus: false,
      // 搜索后搜索框自动失焦
      autoInputBlur: true,
      // 时间样式
      timeStyle: "one",
      // 是否显秒
      showSeconds: false,
      // 是否显零
      showZeroTime: true,
      // 是否显示搜索建议
      showSuggestions: true,
      // 跳转方式
      // open 新标签页 / href 当前页面
      urlJumpType: "open",
    };
  },
  actions: {
    setSearchEngine(value) {
      // 储存上次
      this.lastSearchEngine = this.searchEngine;
      // 设置新引擎
      this.searchEngine = value;
    },
    // 恢复数据
    recoverSiteData(data) {
      let isSuccess = false;
      try {
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const item = data[key];
            this[key] = item;
          }
        }
        isSuccess = true;
      } catch (error) {
        console.error("站点数据恢复时处理失败：", error);
        isSuccess = false;
      }
      return isSuccess;
    },
  },
  // 开启数据持久化
  persist: {
    key: "setData",
    storage: window.localStorage,
  },
});

export default useSetDataStore;
