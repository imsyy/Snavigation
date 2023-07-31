<template>
  <!-- 壁纸 -->
  <Cover @loadComplete="loadComplete" />
  <!-- 主界面 -->
  <Transition name="fade" mode="out-in">
    <main v-if="status.imgLoadStatus" id="main" @click="mainClick">
      <WeatherTime />
      <SearchInp />
      <Footer />
      <!-- Notivue -->
      <Notivue v-slot="item">
        <Notifications :item="item" />
      </Notivue>
    </main>
    <div v-else id="loading">
      <img src="/icon/logo.png" alt="logo" class="logo" />
      <span class="tip">开发中</span>
    </div>
  </Transition>
</template>

<script setup>
import { nextTick } from "vue";
import { statusStore } from "@/stores";
import { Notivue, Notifications, usePush } from "notivue";
import { getGreeting } from "@/utils/timeTools";
import Cover from "@/components/Cover.vue";
import WeatherTime from "@/components/WeatherTime.vue";
import SearchInp from "@/components/SearchInp.vue";
import Footer from "@/components/Footer.vue";

const status = statusStore();
const push = usePush();

// 获取配置
const welcomeText = import.meta.env.VITE_WELCOME_TEXT ?? "欢迎访问本站";

// 全局点击
const mainClick = () => {
  status.setSiteStatus("normal");
};

// 加载完成事件
const loadComplete = () => {
  nextTick(() => {
    push.info({
      title: getGreeting(),
      message: welcomeText,
      duration: 2000,
    });
  });
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
