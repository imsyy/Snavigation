<template>
  <n-tabs class="all-box" size="large" justify-content="space-evenly" animated>
    <n-tab-pane class="no-padding" name="link" tab="捷径">
      <ShortCut />
    </n-tab-pane>
    <n-tab-pane name="note" tab="便签"> 即将完善 </n-tab-pane>
    <n-tab-pane name="more" tab="待办"> 还能有啥呢 😢 </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { NTabs, NTabPane } from "naive-ui";
import ShortCut from "@/components/AllFunc/Box/ShortCut.vue";
</script>
