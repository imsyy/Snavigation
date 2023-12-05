<template>
  <!-- 捷径 -->
  <Transition name="fade" mode="out-in">
    <div v-if="shortcutData[0]" class="shortcut">
      <n-scrollbar class="scrollbar">
        <n-grid
          class="all-shortcut"
          responsive="screen"
          cols="2 s:3 m:4 l:5"
          :x-gap="10"
          :y-gap="10"
        >
          <n-grid-item
            v-for="item in shortcutData"
            :key="item"
            class="shortcut-item"
            @contextmenu="shortCutContextmenu($event, item)"
            @click="shortCutJump(item.url)"
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
    v-model:show="addShortcutModalShow"
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
      <n-form-item label="ID" path="id">
        <n-input-number
          disabled
          placeholder="请输入ID"
          v-model:value="addShortcutValue.id"
          style="width: 100%"
          :show-button="false"
        />
      </n-form-item>
      <n-form-item label="捷径名称" path="name">
        <n-input
          clearable
          show-count
          maxlength="14"
          v-model:value="addShortcutValue.name"
          placeholder="请输入捷径名称"
        />
      </n-form-item>
      <n-form-item label="站点链接" path="url">
        <n-input clearable v-model:value="addShortcutValue.url" placeholder="请输入站点链接" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button strong secondary @click="addShortcutClose"> 取消 </n-button>
        <n-button strong secondary @click="addOrEditShortcuts">
          {{ addShortcutModalType ? "编辑" : "添加" }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
  <!-- 捷径右键菜单 -->
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    size="large"
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
import { ref, nextTick, h } from "vue";
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
  NInputNumber,
  NDropdown,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { siteStore, setStore } from "@/stores";
import SvgIcon from "@/components/SvgIcon.vue";
import identifyInput from "@/utils/identifyInput";

const set = setStore();
const site = siteStore();
const { shortcutData } = storeToRefs(site);

// 图标渲染
const renderIcon = (icon) => {
  return () => {
    return h(SvgIcon, { iconName: `icon-${icon}` }, null);
  };
};

// 添加捷径数据
const addShortcutRef = ref(null);
const addShortcutModalShow = ref(false);
const addShortcutModalType = ref(false); // false 添加 / true 编辑
const addShortcutValue = ref({
  id: null,
  name: "",
  url: "",
});
const addShortcutRules = {
  id: {
    required: true,
    type: "number",
    message: "请输入合法 ID",
    trigger: ["input", "blur"],
  },
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

// 右键菜单数据
const shortCutDropdownX = ref(0);
const shortCutDropdownY = ref(0);
const shortCutDropdownShow = ref(false);
const shortCutDropdownOptions = [
  {
    label: "编辑",
    key: "edit",
    icon: renderIcon("edit"),
  },
  {
    label: "删除",
    key: "delete",
    icon: renderIcon("delete-1"),
  },
];

// 关闭弹窗
const addShortcutClose = () => {
  addShortcutModalShow.value = false;
  addShortcutValue.value = {
    id: null,
    name: "",
    url: "",
  };
};

// 开启添加捷径
const addShortcutModalOpen = () => {
  // 生成 ID
  const shortcutMaxID = shortcutData.value.reduce((max, item) => {
    return item.id > max ? item.id : max;
  }, -1);
  // 生成表单数据
  addShortcutValue.value = {
    id: shortcutMaxID + 1,
    name: "",
    url: "",
  };
  addShortcutModalType.value = false;
  addShortcutModalShow.value = true;
};

// 添加或编辑捷径
const addOrEditShortcuts = () => {
  addShortcutRef.value?.validate((errors) => {
    if (errors) {
      $message.error("请检查您的输入");
      return false;
    }
    // 新增捷径
    if (!addShortcutModalType.value) {
      // 是否重复
      const isDuplicate = shortcutData.value?.some(
        (item) =>
          item.name === addShortcutValue.value.name || item.url === addShortcutValue.value.url,
      );
      if (isDuplicate) {
        $message.error("新增名称或链接与已有捷径重复");
        return false;
      }
      shortcutData.value.push({
        id: addShortcutValue.value.id,
        name: addShortcutValue.value.name,
        url: addShortcutValue.value.url,
      });
      $message.success("捷径添加成功");
      addShortcutClose();
      return true;
    } else {
      // 编辑捷径
      const index = shortcutData.value.findIndex((item) => item.id === addShortcutValue.value.id);
      if (index === -1) {
        $message.error("捷径中不存在该项，请重试");
        return false;
      }
      shortcutData.value[index].name = addShortcutValue.value.name;
      shortcutData.value[index].url = addShortcutValue.value.url;
      $message.success("捷径编辑成功");
      addShortcutClose();
      return true;
    }
  });
};

// 删除捷径
const delShortcuts = () => {
  const deleteId = addShortcutValue.value.id;
  if (typeof deleteId === "number") {
    const indexToRemove = shortcutData.value.findIndex((item) => item.id === deleteId);
    if (indexToRemove !== -1) {
      shortcutData.value.splice(indexToRemove, 1);
      // 将后续元素的 id 前移一位
      for (let i = indexToRemove; i < shortcutData.value.length; i++) {
        shortcutData.value[i].id = i;
      }
      $message.success("捷径删除成功");
      return true;
    }
    $message.error("捷径删除失败，请重试");
  } else {
    $message.error("捷径删除失败，请重试");
  }
};

// 开启右键菜单
const shortCutContextmenu = (e, data) => {
  e.preventDefault();
  shortCutDropdownShow.value = false;
  // 写入弹窗数据
  const { id, name, url } = data;
  addShortcutValue.value = { id, name, url };
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
      addShortcutModalShow.value = true;
      break;
    case "delete":
      $dialog.warning({
        title: "删除捷径",
        content: `确认删除 ${addShortcutValue.value.name} 捷径？此操作将无法恢复！`,
        positiveText: "删除",
        negativeText: "取消",
        onPositiveClick: () => {
          delShortcuts();
        },
      });
      break;
    default:
      break;
  }
};

// 捷径跳转
const shortCutJump = (url) => {
  const urlRegex = /^(https?:\/\/)/i;
  const urlFormat = urlRegex.test(url) ? url : `//${url}`;
  if (set.urlJumpType === "href") {
    window.location.href = urlFormat;
  } else if (set.urlJumpType === "open") {
    window.open(urlFormat, "_blank");
  }
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
      transition:
        background-color 0.3s,
        box-shadow 0.3s;
      .i-icon {
        width: 1rem;
        margin-right: 6px;
        font-size: 20px;
        opacity: 1;
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover {
        background-color: var(--main-background-hover-color);
        box-shadow: 0 0 0px 2px var(--main-background-hover-color);
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
