<template>
  <n-tabs class="set" size="large" justify-content="space-evenly" animated>
    <n-tab-pane name="main" tab="基础设置">
      <n-scrollbar class="scrollbar">
        <n-h6 prefix="bar"> 壁纸 </n-h6>
        <n-card
          class="set-item cover"
          :content-style="{ flexDirection: 'column', alignItems: 'flex-start' }"
        >
          <div class="name">
            <span class="title">壁纸偏好</span>
            <span class="tip">设置站点背景图片</span>
          </div>
          <n-grid
            class="cover-selete"
            responsive="screen"
            cols="2 s:3 m:4 l:4"
            :x-gap="16"
            :y-gap="16"
          >
            <n-grid-item
              v-for="(item, index) in backgroundTypeArr"
              :key="index"
              :class="index === backgroundType ? 'item check' : 'item'"
              @click="changeBackground(index)"
            >
              <span class="name" v-html="item.name" />
            </n-grid-item>
          </n-grid>
        </n-card>
        <n-h6 prefix="bar"> 搜索 </n-h6>
        <n-card class="set-item">
          <div class="name">
            <span class="title">搜索引擎</span>
            <span class="tip">切换或自定义搜索引擎</span>
          </div>
          <n-button
            strong
            secondary
            @click="
              () => {
                status.setSiteStatus('focus');
                status.setEngineChangeStatus(true);
              }
            "
          >
            前往调整
          </n-button>
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
      <n-scrollbar class="scrollbar">
        <n-h6 prefix="bar"> 壁纸 </n-h6>
        <n-card class="set-item">
          <div class="name">
            <span class="title">壁纸遮罩</span>
            <span class="tip">壁纸周围是否显示暗色遮罩</span>
          </div>
          <n-switch v-model:value="showBackgroundGray" :round="false" />
        </n-card>
        <n-h6 prefix="bar"> 天气与时间 </n-h6>
        <n-card class="set-item">
          <div class="name">
            <span class="title">时间显秒</span>
            <span class="tip">是否在分钟后面显示秒数</span>
          </div>
          <n-switch v-model:value="showSeconds" :round="false" />
        </n-card>
        <n-h6 prefix="bar"> 搜索框 </n-h6>
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
      </n-scrollbar>
    </n-tab-pane>
    <n-tab-pane name="other" tab="其他设置">
      <n-scrollbar class="scrollbar">
        <n-h6 prefix="bar"> 重置 </n-h6>
        <n-card class="set-item">
          <div class="name">
            <span class="title">站点重置</span>
            <span class="tip">若站点显示异常或出现问题时可尝试此操作</span>
          </div>
          <n-button strong secondary @click="resetSite"> 重置 </n-button>
        </n-card>
        <n-h6 prefix="bar"> 备份 </n-h6>
        <n-card class="set-item">
          <div class="name">
            <span class="title">站点备份</span>
            <span class="tip">将站点配置及个性化内容进行备份</span>
          </div>
          <n-button strong secondary @click="backupSite"> 备份 </n-button>
        </n-card>
        <n-h6 prefix="bar"> 恢复 </n-h6>
        <n-card class="set-item">
          <div class="name">
            <span class="title">数据恢复</span>
            <span class="tip">将备份的站点内容进行恢复</span>
          </div>
          <input
            ref="recoverRef"
            type="file"
            style="display: none"
            accept=".json"
            @change="recoverSite"
          />
          <n-button strong secondary @click="recoverRef?.click()">
            恢复
          </n-button>
        </n-card>
      </n-scrollbar>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { ref } from "vue";
import {
  NTabs,
  NTabPane,
  NCard,
  NSwitch,
  NSelect,
  NScrollbar,
  NButton,
  NGrid,
  NGridItem,
  NH6,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { setStore, statusStore } from "@/stores";

const set = setStore();
const status = statusStore();
const {
  backgroundType,
  showBackgroundGray,
  autoFocus,
  autoInputBlur,
  showSeconds,
  showSuggestions,
  urlJumpType,
} = storeToRefs(set);
const recoverRef = ref(null);

// 壁纸类别
const backgroundTypeArr = [
  { name: "本地默认", tip: "默认壁纸，随机更换" },
  { name: "每日必应", tip: "必应每日一图，每天更新" },
  { name: "随机风景", tip: "随机风景图，随机更换" },
  { name: "随机动漫", tip: "随机二次元图，随机更换" },
];

// 切换壁纸
const changeBackground = (type) => {
  backgroundType.value = type;
  $message.success("壁纸设置成功，刷新后生效");
};

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

// 站点重置
const resetSite = () => {
  $noti.dialog({
    title: "站点重置",
    content: "确认重置站点为默认状态？你的全部数据以及自定义设置都将丢失！",
    clickVerify: () => {
      localStorage.clear();
      $message.info("站点重置成功，即将刷新");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });
};

// 站点备份
const backupSite = () => {
  try {
    const date = new Date();
    const dateString = date.toISOString().replace(/[:.]/g, "-");
    const fileName = `Snavigation_Backup_${dateString}.json`;
    const jsonData = JSON.stringify(set.$state);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // 备份完成
    $message.success("站点备份成功");
  } catch (error) {
    console.error("站点备份失败：", error);
    $message.error("站点备份失败");
  }
};

// 站点恢复
const recoverSite = async () => {
  try {
    const fileInput = recoverRef.value;
    if (!fileInput?.files.length) {
      $message.error("请选择要恢复的备份文件");
      return false;
    }
    const file = fileInput.files[0];
    const jsonData = await file.text();
    const data = JSON.parse(jsonData);
    // 恢复数据
    $noti.dialog({
      title: "站点恢复",
      content: "确认使用该恢复文件？你现有的数据以及自定义设置都将被覆盖！",
      clickVerify: () => {
        const isSuccess = set.recoverSiteData(data);
        if (isSuccess) {
          $message.info("站点恢复成功，即将刷新");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          $message.error("站点数据恢复失败，请重试");
        }
      },
      clickCancel: () => {
        recoverRef.value.value = null;
      },
    });
  } catch (error) {
    console.error("站点数据恢复失败：", error);
    $message.error("站点数据恢复失败，请重试");
  }
};
</script>

<style lang="scss">
.cover-selete {
  margin-top: 12px;
  .item {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: var(--main-background-light-color);
    transition: background-color 0.3s, box-shadow 0.3s;
    &.check {
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
}
</style>
