<template>
  <section class="page">
    <div class="page-header">
      <h1>拼单搭子</h1>
      <p>一起拼单省钱，找到志同道合的校园伙伴。</p>
    </div>

    <EmptyState
      v-if="items.length === 0"
      text="暂无拼单信息"
    />

    <div v-else class="list">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type"
        :location="item.location"
        :time="item.deadline"
      >
        <template #footer>
          <span class="progress">{{ item.currentCount }} / {{ item.targetCount }} 人</span>
          <span class="status">{{ item.status === 'open' ? '拼单中' : '已结束' }}</span>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'

const items = ref<GroupBuyItem[]>([])

onMounted(async () => {
  const res = await getGroupBuys()
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

.progress {
  color: #6b7280;
  font-size: 13px;
}

.status {
  margin-left: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  background: #eff6ff;
  color: #2563eb;
}
</style>
