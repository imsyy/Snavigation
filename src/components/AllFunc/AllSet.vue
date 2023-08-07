<!-- 全局设置 -->
<template>
  <n-tabs class="set" size="large" justify-content="space-evenly" animated>
    <n-tab-pane name="main" tab="基础设置">
      <n-scrollbar style="max-height: 316px">
        <n-card class="set-item">
          <div class="name">
            <span class="title">壁纸偏好</span>
            <span class="tip">设置站点背景图片</span>
          </div>
        </n-card>
        <n-card class="set-item">
          <div class="name">
            <span class="title">壁纸遮罩</span>
            <span class="tip">壁纸周围是否显示暗色遮罩</span>
          </div>
          <n-switch v-model:value="showBackgroundGray" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            <span class="title">搜索引擎</span>
            <span class="tip">切换搜索引擎</span>
          </div>
        </n-card>
        <n-card class="set-item">
          <div class="name">
            <span class="title">搜索建议</span>
            <span class="tip">是否显示搜索建议</span>
          </div>
          <n-switch v-model:value="showSuggestions" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            <span class="title">跳转方式</span>
            <span class="tip">全站链接跳转方式</span>
          </div>
          <n-select
            class="set"
            v-model:value="urlJumpType"
            :options="urlJumpTypeOptions"
          />
        </n-card>
      </n-scrollbar>
    </n-tab-pane>
    <n-tab-pane name="personalization" tab="个性调整">
      <n-card class="set-item">
        <div class="name">
          <span class="title">时间显秒</span>
          <span class="tip">是否在分钟后面显示秒数</span>
        </div>
        <n-switch v-model:value="showSeconds" :round="false" />
      </n-card>
      <n-card class="set-item">
        <div class="name">
          <span class="title">自动聚焦</span>
          <span class="tip">打开网站时自动聚焦搜索框</span>
        </div>
        <n-switch v-model:value="autoFocus" :round="false" />
      </n-card>
      <n-card class="set-item">
        <div class="name">
          <span class="title">自动失焦</span>
          <span class="tip">跳转搜索后搜索框自动失焦</span>
        </div>
        <n-switch v-model:value="autoInputBlur" :round="false" />
      </n-card>
    </n-tab-pane>
    <n-tab-pane name="other" tab="其他设置"> 其他设置 </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { NTabs, NTabPane, NCard, NSwitch, NSelect, NScrollbar } from "naive-ui";
import { storeToRefs } from "pinia";
import { setStore } from "@/stores";

const set = setStore();
const {
  backgroundType,
  showBackgroundGray,
  searchEngine,
  lastSearchEngine,
  customEngine,
  showCleanInput,
  autoFocus,
  autoInputBlur,
  timeStyle,
  showSeconds,
  showSuggestions,
  urlJumpType,
} = storeToRefs(set);

// 链接跳转方式
const urlJumpTypeOptions = [
  {
    label: "新页面打开",
    value: "open",
  },
  {
    label: "当前页打开",
    value: "href",
  },
];
</script>
