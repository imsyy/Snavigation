<!-- 自定义通知组件 -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-show="notiShow"
        class="notification"
        :style="{ zIndex: notizIndex }"
      >
        <div class="notification-mask" @click="allNoti.close()" />
        <Transition name="fadeDown">
          <div v-if="notiShow" :class="['notification-content', notiType]">
            <div class="header">
              <div class="title" v-html="notiTitle" />
            </div>
            <div class="content" v-html="notiContent" />
            <div class="actions">
              <button class="btn" @click="notiCancel">取消</button>
              <button class="btn" @click="notiVerify">确定</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { findMaxZIndex } from "@/utils/domTools";

// 弹窗数据
const notiShow = ref(false);
const notiTitle = ref(null);
const notiContent = ref(null);
const notiType = ref("dialog");
const notizIndex = ref(2000);
const notiClickVerify = ref(null);
const notiClickCancel = ref(null);

// 全部方法
const allNoti = {
  dialog: (options) => {
    if (
      typeof options === "undefined" ||
      options === null ||
      (typeof options === "object" && Object.keys(options).length === 0)
    ) {
      return console.error("Noti:请传入必要数据");
    }
    // 获取配置
    const { title, content, clickVerify, ClickCancel } = options;
    if (!title || !content) return console.error("Noti:参数错误或不完整");
    // 更改数据
    notiTitle.value = title;
    notiContent.value = content;
    notiClickVerify.value = clickVerify;
    notiClickCancel.value = ClickCancel;
    notizIndex.value = findMaxZIndex();
    notiShow.value = true;
  },
  close: () => {
    notiShow.value = false;
    notiTitle.value = null;
    notiContent.value = null;
    notiType.value = null;
    notiClickVerify.value = null;
    notiClickCancel.value = null;
    notizIndex.value = 2000;
  },
};

// 取消事件
const notiCancel = () => {
  if (typeof notiClickCancel.value === "function") {
    notiClickCancel.value();
  }
  allNoti.close();
};

// 确认事件
const notiVerify = () => {
  if (typeof notiClickVerify.value === "function") {
    notiClickVerify.value();
  }
  allNoti.close();
};

onMounted(() => {
  // 挂载至全局
  window.$noti = allNoti;
});
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main-notification-background-color);
  backdrop-filter: blur(40px);
  .notification-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .notification-content {
    width: 60vw;
    height: auto;
    max-width: 700px;
    min-width: min(24rem, 100vw);
    border-radius: 8px;
    color: var(--main-text-color);
    background-color: var(--main-background-light-color);
    z-index: 1;
    .header {
      padding: 20px;
      font-weight: bold;
      font-size: 20px;
    }
    .content {
      padding: 0 20px;
    }
    .actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      padding: 20px;
      .btn {
        cursor: pointer;
        font-size: 14px;
        padding: 9px 16px;
        border-radius: 8px;
        outline: none;
        border: none;
        background-color: var(--main-background-light-color);
        color: var(--main-text-color);
        transition: background-color 0.3s;
        &:last-child {
          margin-left: 12px;
        }
        &:hover {
          background-color: var(--main-background-hover-color);
        }
      }
    }
  }
}
</style>
