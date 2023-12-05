<template>
  <Transition name="fadeDown" mode="out-in">
    <div
      v-if="
        set.showSuggestions &&
        searchKeyword !== null &&
        status.siteStatus === 'focus' &&
        !status.engineChangeStatus
      "
      class="suggestions"
      :style="{ height: `${suggestionsHeights}px` }"
    >
      <n-scrollbar style="max-height: 45vh">
        <!-- 快捷操作 -->
        <Transition
          name="fade"
          mode="out-in"
          @after-enter="changeSuggestionsHeights"
          @after-leave="changeSuggestionsHeights"
        >
          <div v-if="searchKeyword !== null" class="special-result" ref="specialallResultsRef">
            <!-- 快捷翻译 -->
            <div
              v-if="searchKeywordType === 'text'"
              class="s-result"
              @click.stop="toSearch(keyWord, 2)"
            >
              <SvgIcon iconName="icon-translation-two" />
              <span class="text">快捷翻译：{{ keyWord }}</span>
            </div>
            <!-- 直接访问 -->
            <div
              v-if="searchKeywordType !== 'text'"
              class="s-result"
              @click.stop="toSearch(searchKeyword, searchKeywordType === 'email' ? 3 : 4)"
            >
              <SvgIcon :iconName="`icon-${searchKeywordType === 'email' ? 'email' : 'link'}`" />
              <span class="text">
                {{ searchKeywordType === "email" ? "发送邮件至" : "直接访问" }}：{{ searchKeyword }}
              </span>
            </div>
          </div>
        </Transition>
        <!-- 搜索建议 -->
        <Transition
          name="fade"
          mode="out-in"
          @after-enter="changeSuggestionsHeights"
          @after-leave="changeSuggestionsHeights"
        >
          <div
            v-if="searchKeyword !== null && searchSuggestionsData[0]"
            class="all-result"
            ref="allResultsRef"
          >
            <div
              v-for="item in searchSuggestionsData"
              class="s-result"
              :key="item"
              @click.stop="toSearch(item, 1)"
            >
              <SvgIcon iconName="icon-search" className="search" />
              <span class="text">{{ item }}</span>
            </div>
          </div>
        </Transition>
      </n-scrollbar>
    </div>
  </Transition>
</template>

<script setup>
import { NScrollbar } from "naive-ui";
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
// 搜索建议元素
const specialallResultsRef = ref(null);
const allResultsRef = ref(null);
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
  // 是否为空
  if (!searchValue || searchValue === "") {
    searchKeyword.value = null;
    return false;
  }
  // 关闭切换搜索引擎
  status.setEngineChangeStatus(false);
  // 赋值关键字
  searchKeyword.value = searchValue;
  // 若为文字
  if (searchKeyword.value) {
    console.log(val + "的搜索建议");
    // 调用搜索建议
    getSearchSuggestions(searchValue)
      .then((res) => {
        console.log(res);
        // 写入结果
        searchSuggestionsData.value = Array.from(res);
        // 计算高度
        nextTick().then(() => {
          changeSuggestionsHeights();
        });
      })
      .catch((error) => {
        // 清空结果
        searchSuggestionsData.value = [];
        console.error("处理搜索建议发生错误：", error);
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
      if (mainInput && allResultsRef.value && searchSuggestionsData.value[0]) {
        const suggestionItems = allResultsRef.value.querySelectorAll(".s-result");
        if (suggestionItems.length > 0) {
          // 获取当前已聚焦的元素
          const focusedItem = document.querySelector(".s-result.focus");
          // 确定当前聚焦的元素在列表中的索引
          const currentIndex = Array.from(suggestionItems).indexOf(focusedItem);
          // 移除所有元素的选中状态
          suggestionItems.forEach((item) => item.classList.toggle("focus", false));
          // 计算下一个要聚焦的元素的索引
          let nextIndex = keyCode === 38 ? currentIndex - 1 : currentIndex + 1;
          // 确保索引不越界
          nextIndex = Math.max(0, Math.min(nextIndex, suggestionItems.length - 1));
          // 操作元素
          if (nextIndex !== -1) {
            suggestionItems[nextIndex].classList.toggle("focus", true);
            mainInput.value = suggestionItems[nextIndex].querySelector(".text").textContent;
          }
        }
      }
    }
    // 13 回车
    if (keyCode === 13) {
      toSearch(mainInput.value, 1);
    }
  } catch (error) {
    $message.error("出现问题，请尝试重置程序");
    console.error("键盘事件出现错误：" + error);
  }
};

// 计算元素高度并改变
const changeSuggestionsHeights = () => {
  try {
    const allResultsHeight = allResultsRef.value?.offsetHeight;
    const specialallResultsHeight = specialallResultsRef.value?.offsetHeight;
    suggestionsHeights.value = (specialallResultsHeight || 0) + (allResultsHeight || 0);
  } catch (error) {
    console.error("计算高度时出现错误：" + error);
  }
};

// 触发父组件搜索事件
const toSearch = (val, type = 1) => {
  emit("toSearch", val, type);
};

// 监听搜索框变化
watch(
  () => props.keyWord,
  (val) => {
    if (set.showSuggestions) {
      // 清空结果
      searchSuggestionsData.value = [];
      // 判断类型
      searchKeywordType.value = identifyInput(val);
      // 调用搜索结果
      keywordsSearch(val);
    }
  },
);

// 暴露方法
defineExpose({ keyboardEvents });
</script>

<style lang="scss" scoped>
.suggestions {
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  max-height: 45vh;
  overflow: hidden;
  color: var(--main-text-color);
  background-color: var(--main-background-light-color);
  backdrop-filter: blur(30px) saturate(1.25);
  border-radius: 16px;
  transition:
    height 0.2s ease,
    opacity 0.3s ease,
    transform 0.3s ease;
  z-index: 1;

  .all-result,
  .special-result {
    .s-result {
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 6px 12px;
      font-size: 14px;
      transition:
        background-color 0.3s,
        padding-left 0.3s;
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
      @media (min-width: 520px) {
        &:hover,
        &.focus {
          background-color: var(--main-background-light-color);
          padding-left: 18px;
        }
      }
      &:active {
        background-color: var(--main-background-light-color);
        padding-left: 18px;
      }
    }
  }
}
</style>
