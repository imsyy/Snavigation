<template>
  <Transition name="fadeDown" mode="out-in">
    <div v-if="status.engineChangeStatus" class="engine-choose">
      <perfect-scrollbar class="scrollbar">
        <div class="all-engine">
          <div
            v-for="(item, key) in defaultEngine"
            :key="key"
            class="engine"
            @click="changeSearchEngine(key)"
          >
            <SvgIcon :iconName="`icon-${key}`" />
            <span class="name">{{ item.name }}</span>
          </div>
        </div>
      </perfect-scrollbar>
    </div>
  </Transition>
</template>

<script setup>
import { statusStore, setStore } from "@/stores";
import defaultEngine from "@/assets/defaultEngine.json";

const set = setStore();
const status = statusStore();

// 更换搜索引擎
const changeSearchEngine = (key) => {
  // 获取元素
  const mainInput = document.getElementById("main-input");
  // 更改状态
  set.setSearchEngine(key);
  status.setEngineChangeStatus(false);
  mainInput?.focus();
};
</script>

<style lang="scss" scoped>
.engine-choose {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: var(--main-text-color);
  background-color: var(--main-background-light-color);
  backdrop-filter: blur(30px) saturate(1.25);
  border-radius: 16px;
  box-sizing: border-box;
  z-index: 1;
  overflow: hidden;
  .scrollbar {
    padding: 10px;
    max-height: 44vh;
    .all-engine {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(4, minmax(0px, 1fr));
      .engine {
        cursor: pointer;
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
        &:hover {
          background-color: var(--main-background-hover-color);
          box-shadow: 0 0 0px 2px #ffffff30;
        }
      }
      @media (max-width: 798px) {
        grid-template-columns: repeat(3, minmax(0px, 1fr));
      }
      @media (max-width: 580px) {
        grid-template-columns: repeat(2, minmax(0px, 1fr));
      }
    }
    :deep(.ps__rail-y) {
      display: none;
    }
  }
}
</style>
