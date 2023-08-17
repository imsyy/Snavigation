<template>
  <!-- 捷径 -->
  <Transition name="fade" mode="out-in">
    <div v-if="shortcutData[0]" class="shortcut">
      <n-scrollbar class="scrollbar">
        <n-grid
          class="all-shortcut"
          responsive="screen"
          cols="3 s:4 m:5 l:6"
          :x-gap="10"
          :y-gap="10"
        >
          <n-grid-item
            v-for="item in shortcutData"
            :key="item"
            class="shortcut-item"
            @contextmenu="shortCutContextmenu($event, item)"
            @click="shortCutJump"
          >
            <span class="name">{{ item.name }}</span>
          </n-grid-item>
          <n-grid-item
            class="shortcut-item"
            @contextmenu="
              (e) => {
                e.preventDefault();
              }
            "
            @click="addShortcutModalOpen"
          >
            <SvgIcon iconName="icon-add" />
            <span class="name">添加捷径</span>
          </n-grid-item>
        </n-grid>
      </n-scrollbar>
    </div>
    <div v-else class="not-shortcut">
      <span class="tip">暂无捷径，去添加吧</span>
      <n-button strong secondary @click="addShortcutModalOpen">
        <template #icon>
          <SvgIcon iconName="icon-add" />
        </template>
        添加捷径
      </n-button>
    </div>
  </Transition>
  <!-- 添加捷径 -->
  <n-modal
    preset="card"
    v-model:show="addShortcutModal"
    :title="`${addShortcutModalType ? '编辑' : '添加'}捷径`"
    :bordered="false"
    @mask-click="addShortcutClose"
  >
    <n-form
      ref="addShortcutRef"
      :rules="addShortcutRules"
      :model="addShortcutValue"
      :label-width="80"
    >
      <n-form-item label="捷径名称" path="name">
        <n-input
          clearable
          type="text"
          v-model:value="addShortcutValue.name"
          placeholder="请输入捷径名称"
        />
      </n-form-item>
      <n-form-item label="站点链接" path="url">
        <n-input
          clearable
          type="text"
          v-model:value="addShortcutValue.url"
          placeholder="请输入站点链接"
        />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button strong secondary @click="addShortcutClose"> 取消 </n-button>
        <n-button strong secondary @click="addShortcutBtn">
          {{ addShortcutModalType ? "编辑" : "添加" }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
  <!-- 捷径右键菜单 -->
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="shortCutDropdownX"
    :y="shortCutDropdownY"
    :options="shortCutDropdownOptions"
    :show="shortCutDropdownShow"
    :on-clickoutside="
      () => {
        shortCutDropdownShow = false;
      }
    "
    @select="shortCutDropdownSelect"
  />
</template>

<script setup>
import { ref, nextTick } from "vue";
import {
  NButton,
  NScrollbar,
  NGrid,
  NGridItem,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NDropdown,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { siteStore } from "@/stores";
import identifyInput from "@/utils/identifyInput";

const site = siteStore();
const { shortcutData } = storeToRefs(site);

// 添加捷径数据
const addShortcutRef = ref(null);
const addShortcutModal = ref(false);
const addShortcutModalType = ref(false); // false 添加 / true 编辑
const addShortcutValue = ref({
  name: "",
  url: "",
});
const addShortcutRules = {
  name: {
    required: true,
    message: "请输入名称",
    trigger: ["input", "blur"],
  },
  url: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error("请输入站点链接");
      } else if (identifyInput(value) !== "url") {
        return new Error("请检查是否为正确的网址");
      }
      return true;
    },
    trigger: ["input", "blur"],
  },
};

// 关闭弹窗
const addShortcutClose = () => {
  addShortcutModal.value = false;
  addShortcutValue.value = {
    name: "",
    url: "",
  };
};

// 开启添加捷径
const addShortcutModalOpen = () => {
  addShortcutValue.value = {
    name: "",
    url: "",
  };
  addShortcutModalType.value = false;
  addShortcutModal.value = true;
};

// 添加或编辑捷径
const addShortcutBtn = () => {
  addShortcutRef.value?.validate((errors) => {
    if (!errors) {
      // 添加
      if (!addShortcutModalType.value) {
        // 是否有重复
        const isDuplicate = shortcutData.value[0]
          ? shortcutData.value?.some((item) => {
              return (
                item.name === addShortcutValue.value.name ||
                item.url === addShortcutValue.value.url
              );
            })
          : false;
        if (isDuplicate) {
          $message.error("新增名称或链接与已有捷径重复");
        } else {
          shortcutData.value.push({
            name: addShortcutValue.value.name,
            url: addShortcutValue.value.url,
          });
          $message.success("添加成功");
          addShortcutClose();
        }
      }
      // 编辑
      else {
        $message.info("即将支持");
      }
    } else {
      $message.error("请检查您的输入");
    }
  });
};

// 右键菜单数据
const shortCutDropdownX = ref(0);
const shortCutDropdownY = ref(0);
const shortCutDropdownShow = ref(false);
const shortCutDropdownOptions = [
  {
    label: "编辑",
    key: "edit",
  },
  {
    label: "删除",
    key: "delete",
  },
];

// 开启右键菜单
const shortCutContextmenu = (e, data) => {
  e.preventDefault();
  shortCutDropdownShow.value = false;
  // 写入弹窗数据
  const { name, url } = data;
  addShortcutValue.value = { name, url };
  nextTick().then(() => {
    shortCutDropdownShow.value = true;
    shortCutDropdownX.value = e.clientX;
    shortCutDropdownY.value = e.clientY;
  });
};

// 右键菜单点击
const shortCutDropdownSelect = (key) => {
  shortCutDropdownShow.value = false;
  console.log(key);
  switch (key) {
    case "edit":
      addShortcutModalType.value = true;
      addShortcutModal.value = true;
      break;
    case "delete":
      $message.info("即将支持");
      break;
    default:
      break;
  }
};

// 捷径跳转
const shortCutJump = () => {
  $message.info("即将支持");
};
</script>

<style lang="scss" scoped>
.shortcut {
  width: 100%;
  height: 100%;
  .all-shortcut {
    padding: 20px;
    box-sizing: border-box;
    .shortcut-item {
      cursor: pointer;
      height: 60px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--main-background-light-color);
      border-radius: 8px;
      font-size: 16px;
      transition: background-color 0.3s, box-shadow 0.3s;
      .i-icon {
        width: 0rem;
        opacity: 0;
        font-size: 0px;
        transition: width 0.3s, opacity 0.3s, font-size 0.3s, margin-right 0.3s;
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover {
        background-color: var(--main-background-hover-color);
        box-shadow: 0 0 0px 2px var(--main-background-hover-color);
        .i-icon {
          width: 1rem;
          margin-right: 6px;
          font-size: 20px;
          opacity: 1;
        }
      }
      &:active {
        box-shadow: none;
      }
    }
  }
}
.not-shortcut {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .tip {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>
