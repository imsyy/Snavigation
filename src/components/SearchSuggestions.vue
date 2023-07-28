<template>
  <Transition name="fadeUp" mode="out-in">
    <div
      v-if="
        set.showSuggestions &&
        status.siteStatus === 'focus' &&
        searchKeyword !== null
      "
      class="search-suggestions"
      :style="{
        height: suggestionsHeights !== 0 ? `${suggestionsHeights}px` : 'auto',
      }"
    >
      <!-- 搜索建议 -->
      <Transition name="fade" mode="out-in">
        <div
          v-show="
            searchKeyword !== null &&
            searchKeywordType === 'text' &&
            searchSuggestionsData[0]
          "
          class="all-result"
          ref="allResultsRef"
        >
          <!-- 快捷翻译 -->
          <div class="translation" @click="toSearch(searchKeyword, 2)">
            <SvgIcon iconName="icon-translation" />
            <span class="text">快捷翻译：{{ searchKeyword }}</span>
          </div>
          <!-- 建议 -->
          <div
            v-for="item in searchSuggestionsData"
            class="s-result"
            :key="item"
            @click="toSearch(item, 1)"
          >
            <SvgIcon iconName="icon-search" className="search" />
            <span class="text">{{ item }}</span>
          </div>
        </div>
      </Transition>
      <!-- 无搜索建议 -->
      <Transition name="fade" mode="out-in">
        <div
          v-show="searchKeywordType === 'text' && !hasSuggestions"
          class="no-result"
        >
          <SvgIcon iconName="icon-found" className="not-found" />
          <div class="all-text">
            <span class="text">暂无搜索建议</span>
            <span class="tip">请尝试其他关键词</span>
          </div>
        </div>
      </Transition>
      <!-- 特殊类型 -->
      <Transition name="fade" mode="out-in">
        <div
          v-show="searchKeywordType !== 'text'"
          class="special-result"
          ref="specialResultsRef"
        >
          <!-- 直接访问 -->
          <div
            class="s-result"
            @click="
              toSearch(searchKeyword, searchKeywordType === 'email' ? 3 : 4)
            "
          >
            <SvgIcon iconName="icon-link" />
            <span class="text">
              {{
                searchKeywordType === "email" ? "发送邮件至" : "直接访问"
              }}：{{ searchKeyword }}
            </span>
          </div>
          <!-- 直接搜索 -->
          <div class="s-result" @click="toSearch(searchKeyword, 1)">
            <SvgIcon iconName="icon-search" />
            <span class="text">搜索：{{ searchKeyword }}</span>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import { statusStore, setStore } from "@/stores";
import { getSearchSuggestions } from "@/api";
import debounce from "@/utils/debounce";
import identifyInput from "@/utils/identifyInput";

const set = setStore();
const status = statusStore();
const emit = defineEmits(["toSearch"]);

// 搜索关键字
const searchKeyword = ref(null);
// 搜索关键字类别
const searchKeywordType = ref("text");
// 搜索建议数据
const searchSuggestionsData = ref([]);
// 是否有搜索结果
const hasSuggestions = ref(true);
// 搜索建议元素
const allResultsRef = ref(null);
const specialResultsRef = ref(null);
// 搜索建议高度
const suggestionsHeights = ref(0);
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
  const searchValue = val?.trim();
  searchKeyword.value = searchValue;
  // 判断类型
  searchKeywordType.value = identifyInput(searchValue);
  // 若为文字
  if (searchKeywordType.value === "text") {
    if (searchValue) {
      console.log(val + "的搜索建议");
      // 调用搜索建议
      searchSuggestionsData.value = [];
      getSearchSuggestions(searchValue)
        .then((res) => {
          console.log(res);
          // 是否有结果
          hasSuggestions.value = res[0] ? true : false;
          // 写入结果
          searchSuggestionsData.value = Array.from(res);
          // 获取元素高度
          nextTick(() => {
            const height = allResultsRef.value?.offsetHeight;
            suggestionsHeights.value = res[0] ? height : 130;
          });
        })
        .catch((error) => {
          console.error("处理搜索建议发生错误：", error);
        });
    } else {
      searchKeyword.value = null;
      hasSuggestions.value = true;
      suggestionsHeights.value = 0;
    }
  }
  // 其他类型
  else {
    hasSuggestions.value = true;
    // 获取元素高度
    nextTick(() => {
      const height = specialResultsRef.value?.offsetHeight;
      suggestionsHeights.value = height ?? 62;
    });
  }
}, 300);

// 响应键盘事件
const keyboardEvents = (keyCode, event) => {
  try {
    // 获取元素
    const mainInput = document.getElementById("main-input");
    // 38 上 / 40 下
    if (keyCode === 38 || keyCode === 40) {
      // 阻止默认事件
      event.preventDefault();
      if (mainInput && allResultsRef.value && hasSuggestions.value) {
        const suggestionItems =
          allResultsRef.value.querySelectorAll(".s-result");
        if (suggestionItems.length > 0) {
          // 获取当前已聚焦的元素
          const focusedItem = document.querySelector(".s-result.focus");
          // 确定当前聚焦的元素在列表中的索引
          const currentIndex = Array.from(suggestionItems).indexOf(focusedItem);
          // 移除所有元素的选中状态
          suggestionItems.forEach((item) =>
            item.classList.toggle("focus", false)
          );
          // 计算下一个要聚焦的元素的索引
          let nextIndex = keyCode === 38 ? currentIndex - 1 : currentIndex + 1;
          // 确保索引不越界
          nextIndex = Math.max(
            0,
            Math.min(nextIndex, suggestionItems.length - 1)
          );
          // 操作元素
          if (nextIndex !== -1) {
            suggestionItems[nextIndex].classList.toggle("focus", true);
            mainInput.value =
              suggestionItems[nextIndex].querySelector(".text").textContent;
          }
        }
      }
    }
    // 13 回车
    if (keyCode === 13) {
      toSearch(mainInput.value, 1);
    }
  } catch (error) {
    console.error("键盘事件出现错误：" + error);
  }
};

// 触发父组件搜索事件
const toSearch = (val, type = 1) => {
  emit("toSearch", val, type);
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
  max-height: 338px;
  overflow-y: hidden;
  color: var(--main-text-color);
  background-color: var(--main-background-light-color);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: height 0.25s ease, opacity 0.3s ease, transform 0.3s ease;
  .all-result,
  .special-result {
    .s-result,
    .translation {
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 6px 12px;
      font-size: 14px;
      transition: background-color 0.3s, padding-left 0.3s;
      .i-icon {
        opacity: 0.8;
        margin-right: 8px;
      }
      .text {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover,
      &.focus {
        background-color: var(--main-background-light-color);
        padding-left: 18px;
      }
      &:first-child {
        border-radius: 16px 16px 0 0;
      }
      &:last-child {
        border-radius: 0 0 16px 16px;
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
