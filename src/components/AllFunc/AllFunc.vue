<template>
  <div class="main-box" @click.stop>
    <Transition name="fade" mode="out-in">
      <AllBox v-if="status.siteStatus === 'box'" />
      <AllSet v-else-if="status.siteStatus === 'set'" />
    </Transition>
  </div>
</template>

<script setup>
import { statusStore } from "@/stores";
import AllBox from "@/components/AllFunc/AllBox.vue";
import AllSet from "@/components/AllFunc/AllSet.vue";

const status = statusStore();
</script>

<style lang="scss" scoped>
.main-box {
  position: absolute;
  width: 80%;
  height: 400px;
  max-height: 400px;
  max-width: 1200px;
  background-color: var(--main-background-light-color);
  backdrop-filter: blur(20px);
  color: var(--main-text-color);
  border-radius: 8px;
  transition: opacity 0.3s, transform 0.3s, margin-top 0.3s;
  z-index: 2;
  :deep(.set-item) {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 12px;
    border: none;
    box-shadow: var(--main-box-shadow);
    --n-color: var(--main-background-light-color);
    .n-card__content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .name {
        display: flex;
        flex-direction: column;
        .title {
          font-size: 16px;
        }
        .tip {
          font-size: 13px;
          opacity: 0.8;
        }
      }
      .set {
        width: 200px;
        @media (max-width: 768px) {
          width: 140px;
          min-width: 140px;
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
