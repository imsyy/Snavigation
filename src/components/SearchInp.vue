<template>
  <div class="search-input" @click.stop>
    <div
      v-if="status.siteStatus === 'focus'"
      class="mask"
      @click="closeSearchInput"
    />
    <div
      ref="searchAllRef"
      :class="status.siteStatus === 'focus' ? 'all focus' : 'all'"
      :style="{ pointerEvents: inputClickable ? 'none' : 'auto' }"
      @animationstart="inputClickable = true"
      @animationend="inputAnimationEnd"
    >
      <div class="engine" title="切换搜索引擎" @click="changeEngine">
        <SvgIcon
          :iconName="`icon-${defaultEngine[set.searchEngine].icon}`"
          className="baidu"
        />
      </div>
      <input
        class="input"
        id="main-input"
        ref="searchInputRef"
        type="text"
        label="search"
        title="请输入搜索内容"
        autocomplete="false"
        :placeholder="inputTip"
        v-model="inputValue"
        @focus="status.setSiteStatus('focus')"
        @click.stop="status.setEngineChangeStatus(false)"
        @keydown.stop="pressKeyboard"
      />
      <div class="go" title="搜索" @click="toSearch(inputValue)">
        <SvgIcon iconName="icon-search" className="search" />
      </div>
    </div>
    <!-- 搜索引擎 -->
    <SearchEngine />
    <!-- 搜索建议 -->
    <Suggestions
      ref="suggestionsRef"
      :keyWord="inputValue"
      @toSearch="toSearch"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePush } from "notivue";
import { statusStore, setStore } from "@/stores";
import SearchEngine from "@/components/SearchEngine.vue";
import Suggestions from "@/components/Suggestions.vue";
import defaultEngine from "@/assets/defaultEngine.json";

const set = setStore();
const status = statusStore();
const push = usePush();

// 搜索框配置
const inputTip = import.meta.env.VITE_INPUT_TIP ?? "想要搜点什么";

// 搜索框数据
const searchAllRef = ref(null);
const searchInputRef = ref(null);
const inputClickable = ref(true);
const inputValue = ref("");

// 搜索建议子组件
const suggestionsRef = ref(null);

// 关闭搜索框
const closeSearchInput = () => {
  status.setSiteStatus("normal");
  status.setEngineChangeStatus(false);
  searchInputRef.value?.blur();
  inputValue.value = "";
};

// 前往搜索
const toSearch = (val, type = 1) => {
  const searchValue = val?.trim();
  // 定义跳转方法
  const jumpLink = (url) => {
    if (set.urlJumpType === "open") {
      window.location.href = url;
    } else if (set.urlJumpType === "href") {
      window.open(url, "_blank");
    }
  };
  // 是否为空
  if (searchValue) {
    console.log("前往搜索：" + searchValue, type);
    // 1 默认 / 2 快捷翻译 / 3 电子邮件 / 4 直接访问
    switch (type) {
      case 1:
        const engine = defaultEngine[set.searchEngine];
        const value = encodeURIComponent(searchValue);
        jumpLink(engine.url + value);
        break;
      case 2:
        jumpLink(`https://fanyi.baidu.com/#en/zh/${searchValue}`);
        break;
      case 3:
        jumpLink(`mailto:${searchValue}`);
        break;
      case 4:
        const urlRegex = /^(https?:\/\/)/i;
        const url = urlRegex.test(searchValue)
          ? searchValue
          : `//${searchValue}`;
        jumpLink(url);
        break;
      default:
        break;
    }
    closeSearchInput();
  } else {
    status.setSiteStatus("focus");
    searchInputRef.value?.focus();
    push.info({ message: "请输入搜索内容", duration: 1500 });
  }
};

// 搜索框动画结束
const inputAnimationEnd = () => {
  console.log("搜索框动画结束");
  inputClickable.value = false;
  // 自动 focus
  if (set.autoFocus) {
    status.setSiteStatus("focus");
    searchInputRef.value?.focus();
  }
};

// 键盘事件
const pressKeyboard = (event) => {
  // 获取键的键码
  const keyCode = event.keyCode;
  // 子组件事件
  suggestionsRef.value?.keyboardEvents(keyCode, event);
};

// 更换搜索引擎
const changeEngine = () => {
  status.setSiteStatus("focus");
  status.setEngineChangeStatus(!status.engineChangeStatus);
};
</script>

<style lang="scss" scoped>
.search-input {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 680px;
  width: calc(100% - 60px);
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .all {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 42px;
    width: 100%;
    border-radius: 30px;
    color: var(--main-text-color);
    background-color: var(--main-background-color);
    backdrop-filter: blur(10px);
    opacity: 1;
    animation: fade-up-in 0.7s cubic-bezier(0.37, 0.99, 0.36, 1);
    transition: transform 0.3s, background-color 0.3s;
    z-index: 1;
    &.focus {
      transform: translateY(-50px);
      background-color: var(--main-input-hover-color);
      .input {
        color: var(--main-text-hover-color);
        &::placeholder {
          opacity: 0;
        }
      }
      .engine,
      .go,
      .delete {
        color: var(--main-text-hover-color);
      }
    }
    .input {
      display: flex;
      justify-content: center;
      height: 100%;
      width: 100%;
      padding: 0;
      margin: 0;
      border: none;
      outline: none;
      background: none;
      font-size: 16px;
      color: var(--main-text-color);
      &::placeholder {
        text-align: center;
        transform: translateY(1px);
        color: var(--main-text-color);
        letter-spacing: 2px;
        transition: opacity 0.3s;
      }
    }
    .engine,
    .go {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 64px;
      font-size: 20px;
      border-radius: 30px;
      transition: background-color 0.3s;
      &:hover {
        background-color: var(--main-background-color);
      }
    }
  }
}
</style>
