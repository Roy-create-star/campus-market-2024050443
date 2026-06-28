<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElCard, ElButton, ElTag, ElRow, ElCol, ElBadge } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

interface QuickEntry {
  title: string
  desc: string
  imgKey: string
}

interface LatestPost {
  id: number
  title: string
  imgKey: string
  price: string
  location: string
  time: string
  type: string
  status: string
}

interface HotCollection {
  title: string
  count: number
}

const quickEntries = reactive<QuickEntry[]>([
  { title: '二手交易', desc: '闲置好物循环', imgKey: 'secondhand' },
  { title: '失物招领', desc: '寻找失主/物品', imgKey: 'lost-found' },
  { title: '拼单搭子', desc: '一起省钱快乐', imgKey: 'group-buy' },
  { title: '跑腿委托', desc: '便捷校园生活', imgKey: 'errand' }
])

const latestPosts = reactive<LatestPost[]>([
  { id: 1, title: 'MacBook Air M2 2023款', imgKey: 'macbook', price: '¥6,500', location: '东区食堂', time: '10分钟前', type: '二手', status: '在售' },
  { id: 2, title: '捡到学生证 - 李明', imgKey: 'student-id', price: '', location: '图书馆二楼', time: '25分钟前', type: '失物', status: '待认领' },
  { id: 3, title: '喜茶多肉葡萄拼单', imgKey: 'tea', price: '', location: '北门喜茶店', time: '1小时前', type: '拼单', status: '拼单中' },
  { id: 4, title: '代取中通/圆通快递', imgKey: 'package', price: '¥8', location: '菜鸟→东区宿舍', time: '45分钟前', type: '跑腿', status: '进行中' },
  { id: 5, title: '全新高等数学第七版', imgKey: 'math-book', price: '¥28', location: '西区超市', time: '2小时前', type: '二手', status: '在售' }
])

const hotCollections = reactive<HotCollection[]>([
  { title: '毕业季二手教材', count: 23 },
  { title: '校园周边美食拼单', count: 18 },
  { title: '最新失物信息汇总', count: 15 },
  { title: '周末运动搭子招募', count: 12 },
  { title: '考研资料互助专区', count: 10 }
])

const campusLabel = computed(() => `${userStore.profile.campus} · ${userStore.profile.college}`)

const navTo = (path: string) => {
  router.push(path)
}

const navToHotSearch = (title: string) => {
  router.push('/list?keyword=' + encodeURIComponent(title))
}
</script>

<template>
  <div class="home-page">
    <main class="main-content">
      <aside class="sidebar-left">
        <div class="sticky-sidebar">
          <ElCard shadow="never" class="user-card">
            <div class="user-card-body">
              <div class="avatar">
                <img class="avatar-img" src="https://picsum.photos/seed/avatar/80/80" alt="用户头像" width="80" height="80" style="object-fit: cover; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.12);" />
              </div>
              <h3 class="user-name">{{ userStore.profile.nickname }}</h3>
              <p class="user-campus">📍 {{ campusLabel }}</p>
              <div class="user-tags">
                <ElTag size="small" class="tag-credit">⭐ 信用 {{ userStore.profile.credit }} 分</ElTag>
              </div>
              <div class="user-stats">
                <div class="stat-item">
                  <p class="stat-value">12</p>
                  <p class="stat-label">发布</p>
                </div>
                <div class="stat-item">
                  <p class="stat-value">38</p>
                  <p class="stat-label">成交</p>
                </div>
                <div class="stat-item">
                  <p class="stat-value">96%</p>
                  <p class="stat-label">好评</p>
                </div>
              </div>
            </div>
          </ElCard>
        </div>
      </aside>

      <div class="content-center">
        <section class="quick-entries">
          <ElRow :gutter="20" align="middle">
            <ElCol :span="6" v-for="(item, index) in quickEntries" :key="index">
              <ElCard shadow="never" class="entry-card" :body-style="{ padding: '28px 16px' }" @click="navTo('/list')">
                <img class="entry-img" :src="'https://picsum.photos/seed/' + item.imgKey + '/56/56'" :alt="item.title" width="56" height="56" />
                <h4 class="entry-title">{{ item.title }}</h4>
                <p class="entry-desc">{{ item.desc }}</p>
              </ElCard>
            </ElCol>
          </ElRow>
        </section>

        <section class="latest-section">
          <div class="section-title">
            <span>📢 最新发布</span>
            <span class="more-link" @click="navTo('/list')">查看全部 →</span>
          </div>
          <ElCard shadow="never">
            <div v-for="(post, index) in latestPosts" :key="post.id" class="post-card" @click="navTo('/detail/' + post.id)">
              <img class="post-img" :src="'https://picsum.photos/seed/' + post.imgKey + '/80/80'" :alt="post.title" width="80" height="80" />
              <div class="post-info">
                <div class="post-header">
                  <h4 class="post-title">{{ post.title }}</h4>
                  <ElTag size="small" round class="tag-type">{{ post.type }}</ElTag>
                </div>
                <div class="post-meta">
                  <span v-if="post.price">{{ post.price }}</span>
                  <span>{{ post.location }}</span>
                  <span>{{ post.time }}</span>
                </div>
              </div>
              <ElTag size="small" :type="post.status === '进行中' || post.status === '拼单中' ? 'success' : 'warning'" effect="plain">
                {{ post.status }}
              </ElTag>
            </div>
          </ElCard>
        </section>

        <section class="hot-section">
          <div class="section-title">
            <span>🔥 热门收藏</span>
            <span class="more-link" @click="navTo('/list')">更多 →</span>
          </div>
          <ElCard shadow="never" :body-style="{ padding: '16px 20px' }">
            <div v-for="(item, index) in hotCollections" :key="index" class="hot-item" @click="navToHotSearch(item.title)">
              <div class="hot-item-left">
                <span class="hot-rank" :style="{ color: index < 3 ? '#cc9f7a' : '#333' }">{{ index + 1 }}.</span>
                <span class="hot-title">{{ item.title }}</span>
              </div>
              <ElTag size="small" class="tag-hot-count">{{ item.count }} 收藏</ElTag>
            </div>
          </ElCard>
        </section>
      </div>

      <aside class="sidebar-right">
        <div class="sticky-sidebar">
          <ElCard shadow="never" class="text-center" :body-style="{ padding: '20px 16px' }">
            <ElBadge :value="userStore.unreadTotal" :max="99" class="message-badge">
              <ElButton circle size="large" class="btn-message" @click="navTo('/message')">
                💬
              </ElButton>
            </ElBadge>
            <p class="msg-label">未读消息</p>
          </ElCard>

          <ElCard shadow="never" class="quick-actions-card" :body-style="{ padding: '16px' }">
            <p class="quick-actions-title">快捷操作</p>
            <div class="quick-actions-list">
              <ElButton size="small" round class="btn-action" @click="navTo('/profile')">📝 我的发布</ElButton>
              <ElButton size="small" round class="btn-action" @click="navTo('/profile')">⭐ 我的收藏</ElButton>
              <ElButton size="small" round class="btn-action" @click="navTo('/profile')">📋 历史记录</ElButton>
            </div>
          </ElCard>
        </div>
      </aside>
    </main>

    <div class="security-tip">
      <ElCard shadow="never" class="security-card" :body-style="{ padding: '14px 18px' }">
        <div class="security-content">
          <span class="security-icon">🛡️</span>
          <div>
            <p class="security-title">安全交易提醒</p>
            <p class="security-desc">请勿私下转账！<br>认准平台担保交易</p>
          </div>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: #f5f5f5;
  color: #333;
}

.main-content {
  display: flex;
  gap: 24px;
}

.sidebar-left {
  width: 256px;
  flex-shrink: 0;
}

.sticky-sidebar {
  position: sticky;
  top: 20px;
}

.user-card {
  background: #FFE8D6;
  border-radius: 12px;
  border: none;
}

.user-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-campus {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 12px;
}

.tag-credit {
  background: #FFF9F3;
  border-color: #FFF9F3;
  color: #cc9f7a;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0,0,0,0.08);
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #cc9f7a;
  margin: 0;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
}

.content-center {
  flex: 1;
  min-width: 0;
}

.quick-entries {
  margin-bottom: 32px;
}

.entry-card {
  border-radius: 12px;
  border: none;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(#FFF9F3, #FFF9F3) padding-box,
              linear-gradient(135deg, #FFE8D6, #E6F4EA) border-box;
  border: 2px solid transparent;
}

.entry-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.1);
}

.entry-img {
  width: 56px;
  height: 56px;
  display: block;
  margin: 0 auto 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.entry-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.entry-desc {
  font-size: 0.75rem;
  color: #666;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 2px solid #FFE8D6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.more-link {
  font-size: 13px;
  color: #666;
  font-weight: 400;
  cursor: pointer;
}

.more-link:hover {
  color: #cc9f7a;
}

.latest-section {
  margin-bottom: 32px;
}

.post-card {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: background 0.2s;
  cursor: pointer;
}

.post-card:last-child {
  border-bottom: none;
}

.post-card:hover {
  background: #FFF9F3;
}

.post-img {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.post-info {
  flex: 1;
  min-width: 0;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.post-title {
  font-size: 0.875rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 8px;
}

.tag-type {
  background: #FFE8D6;
  border-color: #FFE8D6;
  color: #8B6F5A;
  flex-shrink: 0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.75rem;
  color: #666;
}

.hot-section {
  margin-bottom: 32px;
}

.hot-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: color 0.2s;
}

.hot-item:hover {
  color: #cc9f7a;
}

.hot-item:last-child {
  border-bottom: none;
}

.hot-item-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hot-rank {
  font-size: 0.875rem;
  font-weight: 500;
}

.hot-title {
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}

.tag-hot-count {
  background: #FFE8D6;
  border-color: #FFE8D6;
  color: #8B6F5A;
}

.sidebar-right {
  width: 192px;
  flex-shrink: 0;
}

.message-badge {
  display: inline-block;
}

.message-badge :deep(.el-badge__content) {
  background-color: #E87373 !important;
}

.btn-message {
  background: #FFF9F3;
  border-color: #FFE8D6;
  font-size: 20px;
}

.msg-label {
  font-size: 0.75rem;
  margin-top: 12px;
  color: #666;
}

.quick-actions-card {
  margin-top: 16px;
  border-radius: 12px;
  border: none;
}

.quick-actions-title {
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #666;
}

.quick-actions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-action {
  background: #FFF9F3;
  border-color: #FFE8D6;
  color: #333;
  justify-content: flex-start;
  width: 100%;
}

.text-center {
  text-align: center;
}

.security-tip {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
  width: 220px;
}

.security-card {
  background: #FFF9F3;
  border: 1px solid #FFE8D6;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.security-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.security-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.security-title {
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
}

.security-desc {
  font-size: 0.75rem;
  color: #666;
  line-height: 1.5;
}
</style>
