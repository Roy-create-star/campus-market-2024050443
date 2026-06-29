<template>
  <section class="page">
    <div class="page-header">
      <h1>跑腿委托</h1>
      <p>委托或接取跑腿任务，让校园生活更便捷。</p>
    </div>

    <EmptyState
      v-if="items.length === 0"
      text="暂无跑腿任务"
    />

    <div v-else class="list">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.taskType"
        :location="`${item.from} → ${item.to}`"
        :time="item.deadline"
      >
        <template #footer>
          <strong>￥{{ item.reward }}</strong>
          <span class="status">{{ item.status === 'open' ? '进行中' : '已结束' }}</span>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { getErrands, type ErrandItem } from '../api/errand'

const items = ref<ErrandItem[]>([])

onMounted(async () => {
  const res = await getErrands()
  items.value = res.data
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.page-header h1 {
  margin: 0 0 8px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}

.list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.status {
  margin-left: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  background: #f0fdf4;
  color: #16a34a;
}
</style>
