<template>
  <section class="page">
    <div class="page-header">
      <h1>失物招领</h1>
      <p>发布和查看校园内的失物与招领信息，互帮互助。</p>
    </div>

    <EmptyState
      v-if="items.length === 0"
      text="暂无失物招领信息"
    />

    <div v-else class="list">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type === 'lost' ? '寻物' : '拾到'"
        :location="item.location"
        :time="item.eventTime"
      >
        <template #footer>
          <span class="contact">{{ item.contact }}</span>
          <span :class="['status', item.type]">{{ item.type === 'lost' ? '寻物中' : '待认领' }}</span>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'

const items = ref<LostFoundItem[]>([])

onMounted(async () => {
  const res = await getLostFounds()
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

.contact {
  color: #6b7280;
  font-size: 13px;
}

.status {
  margin-left: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status.lost {
  background: #fef2f2;
  color: #dc2626;
}

.status.found {
  background: #f0fdf4;
  color: #16a34a;
}
</style>
