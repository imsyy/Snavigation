<template>
  <n-tabs class="func" size="large" justify-content="space-evenly" animated>
    <n-tab-pane name="link" tab="捷径">
      <n-h6 prefix="bar"> 常用 </n-h6>
    </n-tab-pane>
    <n-tab-pane name="note" tab="便签"> 即将完善 </n-tab-pane>
    <n-tab-pane name="more" tab="更多"> 还能有啥呢 😢 </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { NTabs, NTabPane, NH6 } from "naive-ui";
</script>
