<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElCard, ElButton, ElTag, ElInput, ElSelect, ElOption,
  ElPagination, ElRow, ElCol, ElEmpty, ElCheckbox, ElProgress
} from 'element-plus'
import { getTrades, type TradeItem } from '../api/trade'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'
import { useFavoriteStore } from '../stores/favorite'

const router = useRouter()
const favoriteStore = useFavoriteStore()

interface CardItem {
  id: number
  title: string
  imgKey: string
  type: string
  dataType: string
  price?: string
  reward?: string
  campus: string
  time: string
  statusType: string
  statusText: string
  location: string
  foundDate?: string
  current?: number
  max?: number
}

interface Filters {
  keyword: string
  businessType: string
  campus: string
  status: string
  sortBy: string
  location: string
}

interface AuxFilters {
  secondhand: boolean
  lost: boolean
  groupBuy: boolean
  errand: boolean
}

interface PriceRange {
  min: number | null
  max: number | null
}

const typeColors: Record<string, string> = {
  '二手': '#4facfe',
  '失物': '#f6d365',
  '拼单': '#11998e',
  '跑腿': '#fa709a'
}

const getTypeColor = (type: string) => typeColors[type] || '#999'

const filters = reactive<Filters>({
  keyword: '',
  businessType: '',
  campus: '',
  status: '',
  sortBy: 'newest',
  location: ''
})

const auxFilters = reactive<AuxFilters>({
  secondhand: false,
  lost: false,
  groupBuy: false,
  errand: false
})

const priceRange = reactive<PriceRange>({
  min: null,
  max: null
})

const cards = reactive<CardItem[]>([])

onMounted(async () => {
  const [tradeRes, lostRes, groupRes, errandRes] = await Promise.all([
    getTrades(),
    getLostFounds(),
    getGroupBuys(),
    getErrands()
  ])

  const result: CardItem[] = []

  tradeRes.data.forEach((item: TradeItem) => {
    result.push({
      id: item.id!,
      title: item.title,
      imgKey: 'trade-' + item.id,
      type: '二手',
      dataType: 'trade',
      campus: item.location,
      time: item.publishTime,
      statusType: item.status === 'open' ? 'success' : 'info',
      statusText: item.status === 'open' ? '在售' : '已关闭',
      location: item.location,
    })
  })

  lostRes.data.forEach((item: LostFoundItem) => {
    result.push({
      id: item.id!,
      title: item.title,
      imgKey: 'lost-' + item.id,
      type: '失物',
      dataType: 'lostFound',
      campus: item.location,
      time: item.eventTime,
      statusType: 'warning',
      statusText: item.status === 'open' ? '待认领' : '已找回',
      foundDate: item.eventTime,
      location: item.location,
    })
  })

  groupRes.data.forEach((item: GroupBuyItem) => {
    result.push({
      id: item.id!,
      title: item.title,
      imgKey: 'group-' + item.id,
      type: '拼单',
      dataType: 'groupBuy',
      campus: item.location,
      time: item.deadline,
      statusType: 'primary',
      statusText: item.status === 'open' ? '拼单中' : '已结束',
      current: item.currentCount,
      max: item.targetCount,
      location: item.location,
    })
  })

  errandRes.data.forEach((item: ErrandItem) => {
    result.push({
      id: item.id!,
      title: item.title,
      imgKey: 'errand-' + item.id,
      type: '跑腿',
      dataType: 'errand',
      reward: '¥' + item.reward,
      campus: item.from + '→' + item.to,
      time: item.deadline,
      statusType: item.status === 'open' ? 'success' : 'info',
      statusText: item.status === 'open' ? '进行中' : '已完成',
      location: item.to,
    })
  })

  cards.splice(0, cards.length, ...result)
})

const currentPage = ref(1)
const pageSize = ref(12)
const viewMode = ref<'card' | 'list'>('card')

const parsePrice = (p?: string): number => {
  if (!p) return NaN
  return parseFloat(p.replace(/[¥,]/g, ''))
}

const filteredCards = computed(() => {
  let result = [...cards]

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    result = result.filter(c => c.title.toLowerCase().includes(kw))
  }

  if (filters.businessType) {
    result = result.filter(c => c.type === filters.businessType)
  }

  if (filters.campus) {
    result = result.filter(c => c.campus.includes(filters.campus))
  }

  if (filters.status) {
    if (filters.status === 'active') {
      result = result.filter(c => c.statusType === 'success' || c.statusType === 'primary' || c.statusType === 'warning')
    } else if (filters.status === 'done') {
      result = result.filter(c => c.statusType === 'info')
    } else if (filters.status === 'closed') {
      result = result.filter(c => c.statusType === 'danger')
    }
  }

  const activeTypes: string[] = []
  if (auxFilters.secondhand) activeTypes.push('二手')
  if (auxFilters.lost) activeTypes.push('失物')
  if (auxFilters.groupBuy) activeTypes.push('拼单')
  if (auxFilters.errand) activeTypes.push('跑腿')

  if (activeTypes.length > 0) {
    result = result.filter(c => activeTypes.includes(c.type))
  }

  if (priceRange.min !== null) {
    result = result.filter(c => {
      const price = parsePrice(c.price)
      return isNaN(price) || price >= priceRange.min!
    })
  }

  if (priceRange.max !== null) {
    result = result.filter(c => {
      const price = parsePrice(c.price)
      return isNaN(price) || price <= priceRange.max!
    })
  }

  if (filters.location) {
    result = result.filter(c => c.location === filters.location)
  }

  if (filters.sortBy === 'price_asc') {
    result.sort((a, b) => {
      const pa = parsePrice(a.price) || 999999
      const pb = parsePrice(b.price) || 999999
      return pa - pb
    })
  } else if (filters.sortBy === 'price_desc') {
    result.sort((a, b) => {
      const pa = parsePrice(a.price) || 0
      const pb = parsePrice(b.price) || 0
      return pb - pa
    })
  }

  return result
})

const totalCount = computed(() => filteredCards.value.length)

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  if (start >= filteredCards.value.length && filteredCards.value.length > 0) {
    currentPage.value = 1
    return filteredCards.value.slice(0, pageSize.value)
  }
  return filteredCards.value.slice(start, end)
})

const toggleFavorite = (card: CardItem) => {
  favoriteStore.toggleFavorite({
    id: card.id,
    type: card.dataType as 'trade' | 'lostFound' | 'groupBuy' | 'errand',
    title: card.title,
    description: '',
    location: card.location,
  })
}

const applyFilters = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  filters.keyword = ''
  filters.businessType = ''
  filters.campus = ''
  filters.status = ''
  filters.sortBy = 'newest'
  filters.location = ''
  auxFilters.secondhand = false
  auxFilters.lost = false
  auxFilters.groupBuy = false
  auxFilters.errand = false
  priceRange.min = null
  priceRange.max = null
  currentPage.value = 1
}

const navTo = (path: string) => {
  router.push(path)
}

const getProgressPercent = (current?: number, max?: number): number => {
  if (!current || !max) return 0
  return Math.round((current / max) * 100)
}
</script>

<template>
  <div class="list-page">
    <div class="filter-bar">
      <div class="filter-bar-inner">
        <ElRow :gutter="16" align="middle">
          <ElCol :span="6">
            <ElInput
              v-model="filters.keyword"
              placeholder="🔍 搜索商品、失物、拼单..."
              clearable
              size="default"
            />
          </ElCol>
          <ElCol :span="4">
            <ElSelect v-model="filters.businessType" placeholder="业务类型" clearable class="!w-full">
              <ElOption label="全部类型" value="" />
              <ElOption label="二手交易" value="二手" />
              <ElOption label="失物招领" value="失物" />
              <ElOption label="拼单搭子" value="拼单" />
              <ElOption label="跑腿委托" value="跑腿" />
            </ElSelect>
          </ElCol>
          <ElCol :span="4">
            <ElSelect v-model="filters.campus" placeholder="校区" clearable class="!w-full">
              <ElOption label="全部校区" value="" />
              <ElOption label="东校区" value="东校区" />
              <ElOption label="西校区" value="西校区" />
              <ElOption label="南校区" value="南校区" />
              <ElOption label="北校区" value="北校区" />
            </ElSelect>
          </ElCol>
          <ElCol :span="4">
            <ElSelect v-model="filters.status" placeholder="状态" clearable class="!w-full">
              <ElOption label="全部状态" value="" />
              <ElOption label="在售/进行中" value="active" />
              <ElOption label="已完成" value="done" />
              <ElOption label="已关闭" value="closed" />
            </ElSelect>
          </ElCol>
          <ElCol :span="4">
            <ElSelect v-model="filters.sortBy" placeholder="排序方式" class="!w-full">
              <ElOption label="最新发布" value="newest" />
              <ElOption label="最多热度" value="hot" />
              <ElOption label="价格从低到高" value="price_asc" />
              <ElOption label="价格从高到低" value="price_desc" />
            </ElSelect>
          </ElCol>
          <ElCol :span="2" class="filter-btn-col">
            <ElButton round class="btn-filter" @click="applyFilters">
              筛选
            </ElButton>
          </ElCol>
        </ElRow>
      </div>
    </div>

    <main class="main-content">
      <aside class="sidebar-filter">
        <div class="sticky-filter-sidebar">
          <ElCard shadow="never" class="filter-sidebar-card" :body-style="{ padding: '18px 16px' }">
            <div class="filter-group">
              <p class="filter-section-title">📂 业务分类</p>
              <div class="filter-checkbox-group">
                <ElCheckbox v-model="auxFilters.secondhand" label="二手交易" border size="small" />
                <ElCheckbox v-model="auxFilters.lost" label="失物招领" border size="small" />
                <ElCheckbox v-model="auxFilters.groupBuy" label="拼单搭子" border size="small" />
                <ElCheckbox v-model="auxFilters.errand" label="跑腿委托" border size="small" />
              </div>
            </div>

            <div class="filter-group">
              <p class="filter-section-title">💰 价格区间</p>
              <div class="price-range-group">
                <ElInput v-model="priceRange.min" placeholder="最低" size="small" class="price-input" />
                <span class="price-separator">—</span>
                <ElInput v-model="priceRange.max" placeholder="最高" size="small" class="price-input" />
              </div>
            </div>

            <div class="filter-group">
              <p class="filter-section-title">📍 交易地点</p>
              <ElSelect v-model="filters.location" placeholder="选择地点" clearable class="!w-full" size="small">
                <ElOption label="不限" value="" />
                <ElOption label="食堂" value="食堂" />
                <ElOption label="图书馆" value="图书馆" />
                <ElOption label="宿舍区" value="宿舍区" />
                <ElOption label="教学楼" value="教学楼" />
                <ElOption label="校门口" value="校门口" />
              </ElSelect>
            </div>

            <ElButton round class="btn-reset" @click="resetFilters">
              ↻ 重置筛选
            </ElButton>
          </ElCard>
        </div>
      </aside>

      <div class="content-main">
        <div class="results-header">
          <p class="results-count">
            共 <span class="count-num">{{ totalCount }}</span> 条结果
          </p>
          <div class="view-switcher">
            <span>视图：</span>
            <span class="view-btn" :class="{ 'view-btn-active': viewMode === 'card' }" @click="viewMode = 'card'">▦ 卡片</span>
            <span class="view-btn" :class="{ 'view-btn-active': viewMode === 'list' }" @click="viewMode = 'list'">☰ 列表</span>
          </div>
        </div>

        <div v-if="filteredCards.length > 0">
          <template v-if="viewMode === 'card'">
            <ElRow :gutter="20">
              <ElCol :span="8" v-for="card in paginatedCards" :key="card.id" class="card-col">
                <ElCard shadow="never" class="card-cube" :body-style="{ padding: '0' }" @click="navTo('/detail/' + card.id + '?type=' + card.dataType)">
                  <div class="card-cube-img">
                    <img :src="'https://picsum.photos/seed/' + card.imgKey + '/400/300'" :alt="card.title" loading="lazy" />
                    <span class="card-cube-badge" :style="{ background: getTypeColor(card.type) }">{{ card.type }}</span>
                  </div>
                  <div class="card-cube-body">
                    <h4 class="card-cube-title">{{ card.title }}</h4>
                    <p class="card-cube-campus">{{ card.campus }}</p>
                    <div class="card-cube-meta">
                      <span v-if="card.type === '二手'" class="card-price">{{ card.price }}</span>
                      <span v-else-if="card.type === '跑腿'" class="card-price">{{ card.reward }}</span>
                      <span v-else-if="card.type === '拼单'" class="card-grp-hint">{{ card.current }}/{{ card.max }} 人</span>
                      <span v-else-if="card.type === '失物'" class="card-grp-hint">{{ card.foundDate }}</span>
                      <span
                        class="heart-btn"
                        :class="{ favorited: favoriteStore.isFavorite(card.dataType as any, card.id) }"
                        @click.stop="toggleFavorite(card)"
                      >
                        {{ favoriteStore.isFavorite(card.dataType as any, card.id) ? '⭐' : '☆' }}
                      </span>
                    </div>
                    <div class="card-cube-footer">
                      <span class="card-time">{{ card.time }}</span>
                      <ElTag size="small" :type="card.statusType as any" effect="plain">{{ card.statusText }}</ElTag>
                    </div>
                  </div>
                </ElCard>
              </ElCol>
            </ElRow>
          </template>

          <template v-else>
            <div v-for="card in paginatedCards" :key="card.id" class="list-item-wrap">
              <ElCard shadow="never" class="list-item" :body-style="{ padding: '14px 18px' }" @click="navTo('/detail/' + card.id + '?type=' + card.dataType)">
                <div class="list-row">
                  <div class="list-img">
                    <img :src="'https://picsum.photos/seed/' + card.imgKey + '/120/120'" :alt="card.title" loading="lazy" />
                    <span class="list-badge" :style="{ background: getTypeColor(card.type) }">{{ card.type }}</span>
                  </div>
                  <div class="list-body">
                    <div class="list-body-top">
                      <h4 class="list-title">{{ card.title }}</h4>
                      <span
                        class="heart-btn heart-list"
                        :class="{ favorited: favoriteStore.isFavorite(card.dataType as any, card.id) }"
                        @click.stop="toggleFavorite(card)"
                      >
                        {{ favoriteStore.isFavorite(card.dataType as any, card.id) ? '⭐' : '☆' }}
                      </span>
                    </div>
                    <div class="list-campus">{{ card.campus }}</div>
                    <div class="list-extra">
                      <span v-if="card.type === '二手'" class="list-price">{{ card.price }}</span>
                      <span v-else-if="card.type === '跑腿'" class="list-price">{{ card.reward }}</span>
                      <span v-else-if="card.type === '拼单'" class="list-grp">需 {{ card.current }}/{{ card.max }} 人</span>
                      <span v-else-if="card.type === '失物'" class="list-grp">丢失日期 {{ card.foundDate }}</span>
                      <ElTag size="small" :type="card.statusType as any" effect="plain">{{ card.statusText }}</ElTag>
                      <span class="list-time">{{ card.time }}</span>
                    </div>
                  </div>
                </div>
              </ElCard>
            </div>
          </template>
        </div>

        <div v-else class="empty-state">
          <ElEmpty description="暂无匹配的信息" :image-size="160">
            <ElButton round class="btn-reset" @click="resetFilters">
              清除筛选条件
            </ElButton>
          </ElEmpty>
        </div>

        <div class="pagination-wrapper">
          <ElPagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="totalCount"
            layout="total, prev, pager, next, jumper"
            background
            small
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.list-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: #f5f5f5;
  color: #333;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.filter-bar {
  background: #FFE8D6;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  position: sticky;
  top: 64px;
  z-index: 30;
}

.filter-bar-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px 24px;
}

.filter-bar :deep(.el-input__wrapper) {
  background: #FFF9F3;
  box-shadow: none;
  border: 1px solid transparent;
}

.filter-bar :deep(.el-input__wrapper:hover),
.filter-bar :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
  border-color: #cc9f7a;
}

.filter-bar :deep(.el-select .el-input__wrapper) {
  background: #FFF9F3;
}

.filter-btn-col {
  display: flex;
  justify-content: flex-end;
}

.btn-filter {
  background: #FFF9F3;
  color: #333;
  border-color: #FFF9F3;
}

.main-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  gap: 24px;
  flex: 1;
}

.sidebar-filter {
  width: 224px;
  flex-shrink: 0;
}

.sticky-filter-sidebar {
  position: sticky;
  top: 140px;
}

.filter-sidebar-card {
  border-radius: 12px;
  border: none;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #FFE8D6;
}

.filter-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-checkbox-group :deep(.el-checkbox) {
  display: flex;
  margin-bottom: 8px;
}

.price-range-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-input {
  width: 80px;
}

.price-separator {
  font-size: 0.75rem;
  color: #666;
}

.btn-reset {
  width: 100%;
  background: #FFE8D6;
  border-color: #FFE8D6;
  color: #333;
}

.content-main {
  flex: 1;
  min-width: 0;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.results-count {
  font-size: 0.875rem;
  color: #666;
}

.count-num {
  font-weight: 600;
  color: #333;
}

.view-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #666;
}

.view-btn {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.view-btn:hover {
  background: #FFF9F3;
}

.view-btn-active {
  background: #FFE8D6;
  color: #333;
}

.card-col {
  margin-bottom: 24px;
}

.card-cube {
  border-radius: 12px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-cube:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.1);
}

.card-cube-img {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.card-cube-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.card-cube:hover .card-cube-img img {
  transform: scale(1.08);
}

.card-cube-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.card-cube-body {
  padding: 12px 14px 14px;
}

.card-cube-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-cube-campus {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.card-cube-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-price {
  font-size: 16px;
  font-weight: 700;
  color: #E87373;
}

.card-grp-hint {
  font-size: 12px;
  color: #666;
}

.card-cube-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.list-item-wrap {
  margin-bottom: 12px;
}

.list-item {
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.list-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.list-img {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
}

.list-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.list-badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  padding: 1px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
}

.list-body {
  flex: 1;
  min-width: 0;
}

.list-body-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.list-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-campus {
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.list-extra {
  display: flex;
  align-items: center;
  gap: 12px;
}

.list-price {
  font-size: 15px;
  font-weight: 700;
  color: #E87373;
}

.list-grp {
  font-size: 12px;
  color: #666;
}

.list-time {
  font-size: 12px;
  color: #bbb;
}

.heart-btn {
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: transform 0.2s;
  display: inline-flex;
}

.heart-btn:hover {
  transform: scale(1.25);
}

.heart-btn.favorited {
  transform: scale(1.1);
}

.heart-list {
  font-size: 20px;
}

.card-time {
  font-size: 0.75rem;
  color: #999;
}

.empty-state {
  padding: 80px 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 32px 0 48px;
}
</style>
