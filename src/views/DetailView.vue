<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElTag, ElInput, ElButton, ElMessage, ElCarousel, ElCarouselItem, ElIcon } from 'element-plus'
import { getTradeById, type TradeItem } from '../api/trade'
import { getLostFoundById, type LostFoundItem } from '../api/lostFound'
import { getGroupBuyById, type GroupBuyItem } from '../api/groupBuy'
import { getErrandById, type ErrandItem } from '../api/errand'

const route = useRoute()
const router = useRouter()
const offerPrice = ref('')

const item = ref<{
  title: string
  price: string
  originalPrice: string
  description: string
  seller: string
  sellerAvatar: string
  tags: string[]
  type: string
  imageSeed: string
  condition?: string
  status?: string
} | null>(null)

function goBack() {
  router.back()
}

function sendOffer() {
  if (!offerPrice.value || Number(offerPrice.value) <= 0) {
    ElMessage.warning('请输入有效的出价金额')
    return
  }
  ElMessage.success(`已向发布者发送 ¥${offerPrice.value} 的出价请求`)
}

onMounted(async () => {
  const id = Number(route.params.id)
  const type = (route.query.type as string) || 'trade'

  try {
    if (type === 'trade') {
      const res = await getTradeById(id)
      const data = res.data
      item.value = {
        title: data.title,
        price: '¥' + data.price.toFixed(2),
        originalPrice: '',
        description: data.description,
        seller: data.publisher,
        sellerAvatar: 'avatar',
        tags: [data.category, data.condition, data.status],
        type: '二手',
        imageSeed: 'detail-trade-' + data.id,
        condition: data.condition,
        status: data.status === 'open' ? '在售' : '已关闭',
      }
    } else if (type === 'lostFound') {
      const res = await getLostFoundById(id)
      const data = res.data
      item.value = {
        title: data.title,
        price: '',
        originalPrice: '',
        description: data.description,
        seller: data.contact,
        sellerAvatar: 'avatar',
        tags: [data.type === 'lost' ? '寻物' : '招领', data.itemName],
        type: '失物',
        imageSeed: 'detail-lost-' + data.id,
        status: data.status === 'open' ? '待认领' : '已找回',
      }
    } else if (type === 'groupBuy') {
      const res = await getGroupBuyById(id)
      const data = res.data
      item.value = {
        title: data.title,
        price: '',
        originalPrice: '',
        description: data.description,
        seller: data.publisher,
        sellerAvatar: 'avatar',
        tags: [data.type, data.status],
        type: '拼单',
        imageSeed: 'detail-group-' + data.id,
        status: data.status === 'open' ? '拼单中' : '已结束',
      }
    } else if (type === 'errand') {
      const res = await getErrandById(id)
      const data = res.data
      item.value = {
        title: data.title,
        price: '¥' + data.reward.toFixed(2),
        originalPrice: '',
        description: data.description,
        seller: data.publisher,
        sellerAvatar: 'avatar',
        tags: [data.taskType, data.status],
        type: '跑腿',
        imageSeed: 'detail-errand-' + data.id,
        status: data.status === 'open' ? '进行中' : '已完成',
      }
    }
  } catch {
    ElMessage.error('未找到该物品')
  }
})
</script>

<template>
  <div class="detail-wrapper">
    <div class="detail-top-bar">
      <span class="back-btn" @click="goBack">← 返回</span>
    </div>
    <div v-if="!item" class="loading-state">加载中...</div>

    <template v-else>
    <div class="detail-layout">
      <div class="image-section">
        <ElCarousel height="420px" trigger="click" indicator-position="none" arrow="always" :interval="3000">
          <ElCarouselItem v-for="i in 6" :key="i">
            <img
              :src="`https://picsum.photos/seed/${item.imageSeed}-${i}/580/420`"
              :alt="`${item.title} ${i}`"
              class="carousel-image"
            />
          </ElCarouselItem>
        </ElCarousel>
      </div>

      <div class="info-section">
        <div class="title-row">
          <h1 class="item-title">{{ item.title }}</h1>
          <el-tag v-if="item.status" size="small" color="#FFE8D6" style="color:#333;border:1px solid #e8c8a0;">
            {{ item.status }}
          </el-tag>
        </div>

        <div v-if="item.price" class="price-row">
          <span class="price-current">{{ item.price }}</span>
          <span v-if="item.originalPrice" class="price-original">原价 {{ item.originalPrice }}</span>
        </div>

        <div class="seller-card">
          <img
            :src="`https://picsum.photos/seed/${item.sellerAvatar}/40/40`"
            :alt="item.seller"
            class="seller-avatar"
          />
          <div>
            <p class="seller-name">{{ item.seller }}</p>
            <p class="seller-meta">已认证卖家</p>
          </div>
        </div>

        <div class="meta-grid">
          <div><span class="meta-label">分类：</span>{{ item.type }}</div>
          <div><span class="meta-label">成色：</span>{{ item.condition || '-' }}</div>
        </div>

        <div class="desc-section">
          <h3 class="section-title">商品描述</h3>
          <p class="desc-text">{{ item.description }}</p>
        </div>

        <div class="tags-section">
          <el-tag v-for="tag in item.tags" :key="tag" size="small" class="tag-item">
            {{ tag }}
          </el-tag>
        </div>

        <div class="bargain-card">
          <h4 class="section-title" style="margin-bottom:8px;">💬 出价</h4>
          <div class="offer-row">
            <el-input v-model="offerPrice" class="bargain-input" size="small" placeholder="输入出价">
              <template #prefix><span style="color:#999;">¥</span></template>
            </el-input>
            <el-button size="small" class="offer-btn" @click="sendOffer">出价联系</el-button>
          </div>
        </div>

        <div class="security-card">
          <p class="security-title">🛡️ 安全交易提示</p>
          <p>建议当面交易，确认商品后再付款。请勿提前转账，谨防诈骗。</p>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<style scoped>
.detail-wrapper { width: 100%; }

.detail-top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.back-btn {
  cursor: pointer;
  font-size: 14px;
  color: #666;
  padding: 6px 14px;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
  user-select: none;
}

.back-btn:hover {
  background: #FFE8D6;
  color: #333;
}

.detail-layout { display: flex; flex-direction: column; gap: 24px; }

@media (min-width: 1024px) {
  .detail-layout { flex-direction: row; }
  .image-section { width: 580px; flex-shrink: 0; }
  .info-section { flex: 1; min-width: 0; }
}

.image-section :deep(.el-carousel__arrow) {
  background: rgba(0,0,0,0.35);
  font-size: 16px;
}

.image-section :deep(.el-carousel__arrow:hover) {
  background: rgba(0,0,0,0.6);
}

.carousel-image {
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 12px;
}

.title-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.item-title { font-size: 22px; font-weight: 700; color: #333; line-height: 1.3; }
.price-row { margin-bottom: 16px; }
.price-current { font-size: 28px; font-weight: 700; color: #e74c3c; }
.price-original { font-size: 14px; color: #666; text-decoration: line-through; margin-left: 8px; }
.seller-card { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px; border-radius: 12px; background: #FFF9F3; }
.seller-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.seller-name { font-weight: 500; font-size: 14px; margin: 0; }
.seller-meta { font-size: 12px; color: #666; margin: 2px 0 0; }
.meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 14px; color: #666; margin-bottom: 16px; }
.meta-label { color: #999; }
.desc-section { margin-bottom: 16px; }
.section-title { font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #333; }
.desc-text { font-size: 14px; color: #666; line-height: 1.7; margin: 0; }
.tags-section { margin-bottom: 16px; }
.tag-item { background: #FFE8D6; color: #333; border: none; margin-right: 6px; margin-bottom: 6px; }
.bargain-card { padding: 16px; border-radius: 12px; margin-bottom: 16px; background: #FFF9F3; border: 1px solid #f0e0d0; }
.offer-row { display: flex; align-items: center; gap: 12px; }
.bargain-input { width: 120px; }
.offer-btn { background: #FFE8D6; color: #333; border: none; }
.security-card { background: #fef8f0; border-left: 4px solid #f90; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #666; }
.security-title { font-weight: 500; font-size: 14px; margin-bottom: 4px; }
.loading-state { text-align: center; padding: 80px 0; color: #999; font-size: 16px; }
</style>
