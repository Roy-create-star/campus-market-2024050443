<script setup lang="ts">
// 获取当前星期
const weekList = ['周日','周一','周二','周三','周四','周五','周六']
const today = weekList[new Date().getDay()]
</script>

<template>
  <section>
    <h2>项目启动成功</h2>
    <p>欢迎使用校园轻集市实训项目，今天{{ today }}</p>
    <p>请按照每日任务要求，完成代码、证据卡和自动化检测。</p>
  </section>
</template>

<style scoped>
section {
  line-height: 1.8;
}
</style>