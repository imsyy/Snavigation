<template>
  <Provider>
    <!-- 壁纸 -->
    <Cover @loadComplete="loadComplete" />
    <!-- 主界面 -->
    <Transition name="fade" mode="out-in">
      <main
        v-if="status.imgLoadStatus"
        tabindex="0"
        id="main"
        :class="`main-${status.siteStatus}`"
        @click="status.setSiteStatus('normal')"
        @contextmenu="mainContextmenu"
        @keydown="mainPressKeyboard"
      >
        <WeatherTime />
        <SearchInp @contextmenu.stop />
        <AllFunc @contextmenu.stop />
        <Footer />
        <!-- 状态切换 -->
        <Transition name="fade">
          <div
            v-show="
              status.siteStatus !== 'focus' && status.siteStatus !== 'normal'
            "
            class="change-status"
            :title="status.siteStatus !== 'set' ? '设置' : '首页'"
            @click.stop="
              status.setSiteStatus(
                status.siteStatus !== 'set' ? 'set' : 'normal'
              )
            "
          >
            <Transition name="fade" mode="out-in">
              <SvgIcon
                :iconName="`icon-${
                  status.siteStatus !== 'set' ? 'setting' : 'home'
                }`"
                :key="status.siteStatus !== 'set' ? 'setting' : 'home'"
              />
            </Transition>
          </div>
        </Transition>
        <!-- Notification -->
        <Notification />
      </main>
      <div v-else id="loading">
        <img src="/icon/logo.png" alt="logo" class="logo" />
        <span class="tip">开发中</span>
      </div>
    </Transition>
  </Provider>
</template>

<script setup>
import { nextTick } from "vue";
import { statusStore } from "@/stores";
import { getGreeting } from "@/utils/timeTools";
import Provider from "@/components/Provider.vue";
import Cover from "@/components/Cover.vue";
import WeatherTime from "@/components/WeatherTime.vue";
import SearchInp from "@/components/SearchInput/SearchInp.vue";
import AllFunc from "@/components/AllFunc/AllFunc.vue";
import Footer from "@/components/Footer.vue";

const status = statusStore();

// 获取配置
const welcomeText = import.meta.env.VITE_WELCOME_TEXT ?? "欢迎访问本站";

// 鼠标右键
const mainContextmenu = (event) => {
  event.preventDefault();
  status.setSiteStatus("box");
};

// 加载完成事件
const loadComplete = () => {
  nextTick(() => {
    $message.info(getGreeting() + "，" + welcomeText, {
      showIcon: false,
      duration: 3000,
    });
  });
};

// 全局键盘事件
const mainPressKeyboard = (event) => {
  const keyCode = event.keyCode;
  // 回车
  if (keyCode === 13) {
    // focus 元素
    const mainInput = document.getElementById("main-input");
    status.setSiteStatus("focus");
    mainInput?.focus();
  }
};
</script>

<style lang="scss" scoped>
#main,
#loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &.main-normal,
  &.main-focus {
    .main-box {
      opacity: 0;
      margin-top: 0;
      transform: scale(0.35);
      pointer-events: none;
    }
  }
  &.main-box,
  &.main-set {
    .main-box {
      opacity: 1;
      margin-top: 200px;
      transform: scale(1);
      visibility: visible;
    }
    .search-input {
      :deep(.all) {
        opacity: 0;
        width: 0;
        visibility: hidden;
      }
    }
  }
  .change-status {
    cursor: pointer;
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    padding: 8px;
    border-radius: 8px;
    color: var(--main-text-color);
    z-index: 1;
    transition: opacity 0.3s, background-color 0.3s, transform 0.3s;
    &:hover {
      backdrop-filter: blur(20px);
      background-color: var(--main-background-light-color);
    }
    &:active {
      transform: scale(0.95);
    }
  }
}
#loading {
  color: var(--main-text-color);
  .logo {
    width: 100px;
    height: 100px;
    margin-bottom: 24px;
    animation: logo-breathe 3s infinite alternate;
  }
  .tip {
    font-size: 20px;
  }
}
</style>
