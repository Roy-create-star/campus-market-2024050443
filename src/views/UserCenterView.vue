<template>
  <section class="page">
    <div class="profile-card">
      <div class="avatar">
        {{ userStore.displayName.slice(0, 1) }}
      </div>

      <div>
        <h1>{{ userStore.displayName }}</h1>
        <p>{{ userStore.userDescription }}</p>
        <p>{{ userStore.currentUser.bio }}</p>
      </div>
    </div>

    <div class="panel">
      <h2>我的收藏</h2>

      <EmptyState
        v-if="favoriteStore.favorites.length === 0"
        text="暂无收藏内容"
      />

      <div v-else class="favorite-list">
        <ItemCard
          v-for="item in favoriteStore.favorites"
          :key="`${item.type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :tag="getTypeLabel(item.type)"
          :location="item.location"
        >
          <template #footer>
            <button class="remove-btn" @click="favoriteStore.removeFavorite(item.type, item.id)">
              取消收藏
            </button>
          </template>
        </ItemCard>
      </div>
    </div>

    <div class="panel">
      <h2>我的发布</h2>

      <EmptyState
        v-if="myPublishedItems.length === 0"
        text="暂无发布内容"
      />

      <div v-else class="favorite-list">
        <ItemCard
          v-for="item in myPublishedItems"
          :key="`${item.type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :tag="getTypeLabel(item.type)"
          :location="item.location"
          :time="item.time"
        >
          <template #footer>
            <span class="publish-status">{{ item.status }}</span>
          </template>
        </ItemCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from '../components/EmptyState.vue'
import ItemCard from '../components/ItemCard.vue'
import { computed, onMounted, ref } from 'vue'
import { useFavoriteStore } from '../stores/favorite'
import { useUserStore } from '../stores/user'
import { getTrades, type TradeItem } from '../api/trade'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const trades = ref<TradeItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])

onMounted(async () => {
  const [tradeRes, groupBuyRes, errandRes] = await Promise.all([
    getTrades(),
    getGroupBuys(),
    getErrands(),
  ])
  trades.value = tradeRes.data
  groupBuys.value = groupBuyRes.data
  errands.value = errandRes.data
})

interface PublishedItem {
  id: number
  type: string
  title: string
  description: string
  location?: string
  time?: string
  status: string
}

const myPublishedItems = computed<PublishedItem[]>(() => {
  const name = userStore.displayName
  const items: PublishedItem[] = []

  for (const t of trades.value) {
    if (t.publisher === name) {
      items.push({ id: t.id!, type: 'trade', title: t.title, description: t.description, location: t.location, time: t.publishTime, status: t.status })
    }
  }

  for (const g of groupBuys.value) {
    if (g.publisher === name) {
      items.push({ id: g.id!, type: 'groupBuy', title: g.title, description: g.description, location: g.location, status: g.status })
    }
  }

  for (const e of errands.value) {
    if (e.publisher === name) {
      items.push({ id: e.id!, type: 'errand', title: e.title, description: e.description, status: e.status })
    }
  }

  return items
})

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    trade: '二手交易',
    lostFound: '失物招领',
    groupBuy: '拼单搭子',
    errand: '跑腿委托',
  }

  return map[type] || '校园信息'
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card,
.panel {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #eff6ff;
  color: #2563eb;
  font-size: 28px;
  font-weight: 700;
}

.profile-card h1,
.panel h2 {
  margin: 0 0 8px;
}

.profile-card p,
.hint {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.favorite-list {
  display: grid;
  gap: 16px;
}

.remove-btn {
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
}

.publish-status {
  font-size: 13px;
  color: #6b7280;
}
</style>
