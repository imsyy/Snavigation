<template>
  <Transition name="fadeUp">
    <div
      v-show="
        set.showSuggestions &&
        status.siteStatus === 'focus' &&
        searchKeyword !== null
      "
      class="search-suggestions"
    >
      <Transition name="fade" mode="out-in">
        <div
          v-if="searchKeyword !== null && searchSuggestionsData[0]"
          class="all-result"
        >
          <div
            v-for="item in searchSuggestionsData"
            :key="item"
            class="s-result"
          >
            <SvgIcon iconName="icon-search" className="search" />
            <span class="text">{{ item }}</span>
          </div>
        </div>
        <div class="no-result" v-else-if="!hasSuggestions">
          <SvgIcon iconName="icon-found" className="not-found" />
          <div class="all-text">
            <span class="text">暂无搜索结果</span>
            <span class="tip">请尝试其他关键词</span>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from "vue";
import { statusStore, setStore } from "@/stores";
import { getSearchSuggestions } from "@/api";
import debounce from "@/utils/debounce";

const set = setStore();
const status = statusStore();

// 搜索关键字
const searchKeyword = ref(null);
// 搜索建议数据
const searchSuggestionsData = ref([]);
// 是否有搜索结果
const hasSuggestions = ref(true);
// 接收搜索框内容
const props = defineProps({
  // 搜索关键字
  keyWord: {
    type: String,
    required: true,
  },
});

// 搜索框联想
const keywordsSearch = debounce((val) => {
  if (val?.trim()) {
    console.log(val + "的搜索建议");
    searchKeyword.value = val;
    // 调用搜索建议
    getSearchSuggestions(val).then((res) => {
      console.log(res);
      // 是否有结果
      hasSuggestions.value = res[0] ? true : false;
      // 写入结果
      searchSuggestionsData.value = Array.from(res);
    });
  } else {
    searchKeyword.value = null;
    hasSuggestions.value = true;
  }
}, 500);

// 响应键盘事件
const keyboardEvents = (keyCode) => {
  console.log("键盘按下：" + keyCode);
  // 38 上 / 40 下
};

// 监听搜索框变化
watch(
  () => props.keyWord,
  (val) => keywordsSearch(val)
);

// 暴露方法
defineExpose({ keyboardEvents });
</script>

<style lang="scss" scoped>
.search-suggestions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: var(--main-text-color);
  background-color: var(--main-background-light-color);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  .all-result {
    .s-result {
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 6px 12px;
      font-size: 14px;
      transition: background-color 0.3s, padding-left 0.3s;
      .search {
        opacity: 0.8;
        margin-right: 8px;
      }
      .text {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover {
        background-color: var(--main-background-light-color);
        padding-left: 18px;
      }
      &:first-child {
        border-radius: 8px 8px 0 0;
      }
      &:last-child {
        border-radius: 0 0 8px 8px;
      }
    }
  }
  .no-result {
    width: 100%;
    height: 130px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .not-found {
      font-size: 32px;
      margin-bottom: 8px;
    }
    .all-text {
      display: flex;
      flex-direction: column;
      .text {
        font-size: 18px;
        display: inline-block;
        margin-bottom: 6px;
      }
      .tip {
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }
}
</style>
