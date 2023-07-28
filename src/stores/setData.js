import { defineStore } from "pinia";

const useSetDataStore = defineStore("setData", {
  state: () => {
    return {
      // 壁纸类别
      // 0 本地 / 1 必应 / 2 随机风景 / 3 随机动漫 / 4 自定义
      backgroundType: 0,
      // 壁纸遮罩
      showBackgroundGray: true,
      // 清空搜索框
      showCleanInput: true,
      // 搜索框自动 focus
      autoFocus: false,
      // 时间样式
      timeStyle: "one",
      // 是否显秒
      showSeconds: false,
      // 是否显示搜索建议
      showSuggestions: true,
      // 跳转方式
      // open 当前页面 / href 新标签页
      urlJumpType: "href",
    };
  },
  // 开启数据持久化
  persist: {
    key: "setData",
    storage: window.localStorage,
  },
});

export default useSetDataStore;
