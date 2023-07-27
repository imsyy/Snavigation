<template>
  <div class="search-input" @click.stop>
    <div
      v-if="status.siteStatus === 'focus'"
      class="mask"
      @click="closeSearchInput"
    />
    <div
      :class="status.siteStatus === 'focus' ? 'all focus' : 'all'"
      :style="{ pointerEvents: inputClickable ? 'none' : 'auto' }"
      ref="searchAllRef"
    >
      <div class="engine" title="切换搜索引擎">
        <SvgIcon iconName="icon-baidu" className="baidu" />
      </div>
      <input
        class="input"
        ref="searchInputRef"
        type="text"
        label="search"
        title="请输入搜索内容"
        :placeholder="inputTip"
        v-model="inputValue"
        @focus="status.setSiteStatus('focus')"
        @keydown="pressKeyboard"
      />
      <div class="go" title="搜索" @click="toSearch">
        <SvgIcon iconName="icon-search" className="search" />
      </div>
    </div>
    <!-- 搜索建议 -->
    <SearchSuggestions ref="searchSuggestionsRef" :keyWord="inputValue" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { statusStore, setStore } from "@/stores";
import SearchSuggestions from "@/components/SearchSuggestions.vue";

const set = setStore();
const status = statusStore();

// 搜索框配置
const inputTip = import.meta.env.VITE_INPUT_TIP ?? "想要搜点什么";

// 搜索框数据
const searchAllRef = ref(null);
const searchInputRef = ref(null);
const inputClickable = ref(true);
const inputValue = ref("");

// 搜索建议子组件
const searchSuggestionsRef = ref(null);

// 关闭搜索框
const closeSearchInput = () => {
  status.setSiteStatus("normal");
  inputValue.value = "";
};

// 前往搜索
const toSearch = () => {
  const keywords = inputValue.value?.trim();
  if (keywords) {
    console.log("前往搜索：" + keywords);
  } else {
    status.setSiteStatus("focus");
    searchInputRef.value?.focus();
  }
};

// 搜索框 Dom 操作
const searchInputDom = (dom) => {
  if (!dom) return false;
  dom.addEventListener("animationstart", () => {
    console.log("动画开始");
    inputClickable.value = true;
  });
  dom.addEventListener("animationend", () => {
    console.log("动画结束");
    inputClickable.value = false;
    // 自动 focus
    if (set.autoFocus) {
      status.setSiteStatus("focus");
      searchInputRef.value?.focus();
    }
  });
};

// 键盘事件
const pressKeyboard = (event) => {
  // 获取键的键码
  const keyCode = event.keyCode;
  // 13 回车
  if (keyCode === 13) toSearch();
  // 子组件事件
  searchSuggestionsRef.value?.keyboardEvents(keyCode);
};

onMounted(() => {
  searchInputDom(searchAllRef.value);
});
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
      background-color: var(--main-background-hover-color);
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
