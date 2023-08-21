<template>
  <Transition name="fadeDown" mode="out-in">
    <div v-if="status.engineChangeStatus" class="engine-choose">
      <n-scrollbar style="max-height: 44.5vh">
        <n-grid
          class="all-engine"
          responsive="screen"
          cols="2 s:3 m:4 l:4"
          :x-gap="10"
          :y-gap="10"
        >
          <n-grid-item
            v-for="(item, key) in defaultEngine"
            :key="key"
            :class="['engine', key === set.searchEngine ? 'choose' : null]"
            @click="changeSearchEngine(key)"
          >
            <SvgIcon :iconName="`icon-${key}`" />
            <span class="name">{{ item.name }}</span>
          </n-grid-item>
          <n-grid-item
            :class="['engine', set.searchEngine === 'custom' ? 'choose' : null]"
            @click="customEngineClick"
          >
            <SvgIcon iconName="icon-custom" />
            <span class="name">自定义</span>
          </n-grid-item>
          <n-grid-item class="engine" @click="customEngineModal = true">
            <SvgIcon iconName="icon-custom" />
            <span class="name">自定义配置</span>
          </n-grid-item>
        </n-grid>
      </n-scrollbar>
      <!-- 自定义搜索引擎 -->
      <n-modal
        preset="card"
        title="自定义搜索引擎"
        v-model:show="customEngineModal"
        :bordered="false"
      >
        <n-form
          ref="customEngineRef"
          :rules="customEngineRules"
          :model="customEngineValue"
          :label-width="80"
        >
          <n-form-item label="自定义搜索引擎地址" path="url">
            <n-input
              clearable
              v-model:value="customEngineValue.url"
              placeholder="请输入自定义搜索引擎地址"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button strong secondary @click="customEngineModal = false">
              取消
            </n-button>
            <n-button strong secondary @click="setCustomEngine">
              确认
            </n-button>
          </n-space>
        </template>
      </n-modal>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from "vue";
import {
  NSpace,
  NButton,
  NScrollbar,
  NGrid,
  NGridItem,
  NModal,
  NForm,
  NFormItem,
  NInput,
} from "naive-ui";
import { statusStore, setStore } from "@/stores";
import defaultEngine from "@/assets/defaultEngine.json";

const set = setStore();
const status = statusStore();

// 自定义搜索引擎数据
const customEngineRef = ref(null);
const customEngineModal = ref(false);
const customEngineValue = ref({
  url: set.customEngineUrl,
});
const customEngineRules = {
  url: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error("请输入自定义搜索引擎地址");
      } else if (
        !/^https:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(value)
      ) {
        return new Error("请检查是否为网址且是否为 https:// 开头");
      }
      return true;
    },
    trigger: ["input", "blur"],
  },
};

// 更换搜索引擎
const changeSearchEngine = (key) => {
  // 获取元素
  const mainInput = document.getElementById("main-input");
  // 更改状态
  set.setSearchEngine(key);
  status.setEngineChangeStatus(false);
  mainInput?.focus();
};

// 点击自定义搜索引擎
const customEngineClick = () => {
  if (set.customEngineUrl) {
    changeSearchEngine("custom");
  } else {
    $message.info("无自定义数据，请配置");
    customEngineModal.value = true;
  }
};

// 自定义搜索引擎
const setCustomEngine = () => {
  customEngineRef.value?.validate((errors) => {
    if (!errors) {
      set.setSearchEngine(customEngineValue.value.url, true);
      customEngineModal.value = false;
      $message.success("已启用自定义搜索引擎");
    } else {
      $message.error("请检查您的输入");
    }
  });
};
</script>

<style lang="scss" scoped>
.engine-choose {
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  color: var(--main-text-color);
  background-color: var(--main-background-light-color);
  backdrop-filter: blur(30px) saturate(1.25);
  border-radius: 16px;
  box-sizing: border-box;
  z-index: 1;
  .all-engine {
    padding: 10px;
    box-sizing: border-box;
    .engine {
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 40px;
      padding: 0 16px;
      grid-column: span 1 / span 1;
      border-radius: 10px;
      box-sizing: border-box;
      background-color: var(--main-background-light-color);
      transition: background-color 0.3s, box-shadow 0.3s;
      .i-icon {
        margin-right: 12px;
      }
      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.choose {
        background-color: var(--main-background-hover-color);
        &::before {
          content: "";
          position: absolute;
          border-radius: 14px;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 2px solid var(--main-background-hover-color);
          transition: opacity 0.3s;
        }
      }
      &:hover {
        background-color: var(--main-background-hover-color);
        box-shadow: 0 0 0px 2px var(--main-background-hover-color);
        &::before {
          opacity: 0;
        }
      }
      &:active {
        box-shadow: none;
      }
    }
    @media (max-width: 798px) {
      grid-template-columns: repeat(3, minmax(0px, 1fr));
    }
    @media (max-width: 580px) {
      grid-template-columns: repeat(2, minmax(0px, 1fr));
    }
  }
}
</style>
