<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElCard, ElButton, ElTag, ElTabs, ElTabPane, ElDialog, ElRadioGroup, ElRadio, ElMessage, ElEmpty } from 'element-plus'
import { useUserStore } from '../stores/user'
import { useFavoriteStore } from '../stores/favorite'
import { getTrades, type TradeItem } from '../api/trade'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const activeTab = ref('publish')

interface MyPost {
  id: number
  title: string
  price: number
  date: string
  status: string
  img: string
}

const myPosts = ref<MyPost[]>([])

onMounted(async () => {
  if (route.query.tab === 'favorite') {
    activeTab.value = 'favorite'
  }

  const [tradeRes, lostRes, groupRes, errandRes] = await Promise.all([
    getTrades(),
    getLostFounds(),
    getGroupBuys(),
    getErrands()
  ])

  const all: MyPost[] = []

  tradeRes.data.forEach((item: TradeItem) => {
    all.push({
      id: item.id!,
      title: item.title,
      price: item.price,
      date: item.publishTime,
      status: item.status === 'open' ? 'ongoing' : 'closed',
      img: 'https://picsum.photos/seed/profile-trade-' + item.id + '/120/120',
    })
  })

  lostRes.data.forEach((item: LostFoundItem) => {
    all.push({
      id: item.id!,
      title: item.title,
      price: 0,
      date: item.eventTime,
      status: item.status === 'open' ? 'ongoing' : 'closed',
      img: 'https://picsum.photos/seed/profile-lost-' + item.id + '/120/120',
    })
  })

  groupRes.data.forEach((item: GroupBuyItem) => {
    all.push({
      id: item.id!,
      title: item.title,
      price: 0,
      date: item.deadline,
      status: item.status === 'open' ? 'ongoing' : 'closed',
      img: 'https://picsum.photos/seed/profile-group-' + item.id + '/120/120',
    })
  })

  errandRes.data.forEach((item: ErrandItem) => {
    all.push({
      id: item.id!,
      title: item.title,
      price: item.reward,
      date: item.deadline,
      status: item.status === 'open' ? 'ongoing' : 'closed',
      img: 'https://picsum.photos/seed/profile-errand-' + item.id + '/120/120',
    })
  })

  myPosts.value = all
})

const stats = computed(() => ({
  posts: myPosts.value.length,
  favorites: favoriteStore.favoriteCount,
  reviews: 5,
}))

const statusDialogVisible = ref(false)
const editingItem = ref<{ title: string; status: string } | null>(null)
const newStatus = ref('ongoing')

function openStatusDialog(item: { title: string; status: string }) {
  editingItem.value = item
  newStatus.value = item.status
  statusDialogVisible.value = true
}

function confirmStatus() {
  if (editingItem.value) {
    editingItem.value.status = newStatus.value
  }
  statusDialogVisible.value = false
  ElMessage.success('状态已更新')
}

function removeFavorite(type: string, id: number) {
  favoriteStore.removeFavorite(type as 'trade' | 'lostFound' | 'groupBuy' | 'errand', id)
}

function statusTagType(status: string) {
  const map: Record<string, 'warning' | 'success' | 'info'> = { ongoing: 'warning', completed: 'success', closed: 'info' }
  return map[status] || 'info'
}

function statusLabel(status: string) {
  const map: Record<string, string> = { ongoing: '进行中', completed: '已完成', closed: '已关闭' }
  return map[status] || status
}
</script>

<template>
  <div class="profile-page">
    <div class="user-card">
      <img src="https://picsum.photos/seed/user-profile/60/60" alt="avatar" class="user-avatar" />
      <div class="user-info">
        <h3 class="user-name">{{ userStore.profile.nickname }}</h3>
        <p class="user-meta">{{ userStore.profile.studentId }} · {{ userStore.profile.college }}</p>
        <p class="user-meta">📍 {{ userStore.profile.campus }} · ⭐ 信用 {{ userStore.profile.credit }} 分</p>
      </div>
      <el-button size="small" round class="edit-btn" @click="router.push('/profile/edit')">编辑资料</el-button>
    </div>

    <el-row :gutter="12" class="stats-row">
      <el-col :span="8"><el-card shadow="never" body-style="text-align:center;padding:16px;">
        <div class="stat-value">{{ stats.posts }}</div><div class="stat-label">发布</div>
      </el-card></el-col>
      <el-col :span="8"><el-card shadow="never" body-style="text-align:center;padding:16px;">
        <div class="stat-value">{{ stats.favorites }}</div><div class="stat-label">收藏</div>
      </el-card></el-col>
      <el-col :span="8"><el-card shadow="never" body-style="text-align:center;padding:16px;">
        <div class="stat-value">{{ stats.reviews }}</div><div class="stat-label">评价</div>
      </el-card></el-col>
    </el-row>

    <el-tabs v-model="activeTab" class="profile-tabs">
      <el-tab-pane label="我的发布" name="publish">
        <div v-if="myPosts.length" class="post-list">
          <div v-for="(item, i) in myPosts" :key="i" class="post-card">
            <img :src="item.img" :alt="item.title" class="post-img" />
            <div class="post-body">
              <div class="post-title">{{ item.title }}</div>
              <div class="post-meta">¥{{ item.price }} · {{ item.date }}</div>
              <div class="post-bottom">
                <el-tag :type="statusTagType(item.status)" size="small" effect="plain">{{ statusLabel(item.status) }}</el-tag>
                <el-button size="small" text @click="openStatusDialog(item)">更新状态</el-button>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无发布" />
      </el-tab-pane>

      <el-tab-pane label="我的收藏" name="favorite">
        <div v-if="favoriteStore.favorites.length" class="fav-grid">
          <div v-for="item in favoriteStore.favorites" :key="`${item.type}-${item.id}`" class="fav-card">
            <div class="fav-info">
              <div class="fav-title">{{ item.title }}</div>
              <div class="fav-desc">{{ item.description || item.type }}</div>
            </div>
            <button class="fav-remove" @click="removeFavorite(item.type, item.id)">✕</button>
          </div>
        </div>
        <el-empty v-else description="暂无收藏" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="statusDialogVisible" title="更新状态" width="320px" align-center>
      <el-radio-group v-model="newStatus" class="status-radio-group">
        <el-radio value="ongoing">进行中</el-radio>
        <el-radio value="completed">已完成</el-radio>
        <el-radio value="closed">已关闭</el-radio>
      </el-radio-group>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmStatus">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.profile-page { display: flex; flex-direction: column; gap: 16px; }
.user-card { display: flex; align-items: center; gap: 16px; padding: 20px 16px; margin: -24px -32px 0; background: linear-gradient(135deg, #FFE8D6, #FFDCC0); }
.user-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.3); flex-shrink: 0; }
.user-info { flex: 1; min-width: 0; }
.user-name { font-size: 18px; font-weight: 600; margin: 0; color: #333; }
.user-meta { font-size: 12px; color: #666; margin: 2px 0 0; }
.edit-btn { flex-shrink: 0; }
.stats-row { margin: 0 -4px; }
.stat-value { font-size: 22px; font-weight: 700; color: #333; }
.stat-label { font-size: 12px; color: #999; margin-top: 4px; }
.profile-tabs { margin-top: 4px; }
.post-list { display: flex; flex-direction: column; gap: 10px; }
.post-card { display: flex; gap: 12px; padding: 12px; border: 1px solid #f0f0f0; border-radius: 12px; }
.post-img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
.post-body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.post-title { font-size: 14px; font-weight: 600; color: #333; }
.post-meta { font-size: 12px; color: #999; }
.post-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.fav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.fav-card { position: relative; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; cursor: pointer; }
.fav-img { width: 100%; aspect-ratio: 1; object-fit: cover; }
.fav-info { padding: 10px; }
.fav-title { font-size: 13px; font-weight: 500; color: #333; margin-bottom: 4px; }
.fav-desc { font-size: 12px; color: #999; }
.fav-remove { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border-radius: 50%; border: none; background: rgba(0,0,0,0.4); color: #fff; font-size: 12px; cursor: pointer; }
.status-radio-group { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
</style>
