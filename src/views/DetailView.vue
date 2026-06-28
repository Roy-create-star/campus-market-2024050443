<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElTag, ElInput, ElButton, ElMessage, ElCarousel, ElCarouselItem, ElIcon } from 'element-plus'

const route = useRoute()
const router = useRouter()
const offerPrice = ref('')

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

interface MockItem {
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
}

const mockItems: Record<string, MockItem> = {
  '1': {
    title: 'MacBook Air M2 2023款',
    price: '¥6,500.00',
    originalPrice: '¥8,999.00',
    description: '2023款MacBook Air M2芯片，8GB+256GB，银色外观完好，电池循环仅58次。因升级设备转让，附原装充电器。东区食堂当面验货。',
    seller: '校园小达人',
    sellerAvatar: 'xiaoda',
    tags: ['笔记本', '苹果', 'MacBook', '二手'],
    type: '二手',
    imageSeed: 'macbook',
    condition: '九成新',
    status: '在售'
  },
  '2': {
    title: '捡到学生证 - 李明',
    price: '',
    originalPrice: '',
    description: '在图书馆二楼自习区捡到学生证一张，姓名李明，学号202401234。请失主联系认领，到图书馆服务台即可。',
    seller: '热心同学',
    sellerAvatar: 'rexin',
    tags: ['失物招领', '学生证', '图书馆'],
    type: '失物',
    imageSeed: 'student-id',
    status: '待认领'
  },
  '3': {
    title: '喜茶多肉葡萄拼单',
    price: '',
    originalPrice: '',
    description: '喜茶多肉葡萄买一送一活动，一起拼单更划算！北门喜茶店集合，下午4点前下单。目前已有3人，再凑2人满5人可享团购价。',
    seller: '奶茶达人',
    sellerAvatar: 'naicha',
    tags: ['拼单', '喜茶', '多肉葡萄', '团购'],
    type: '拼单',
    imageSeed: 'tea',
    status: '拼单中'
  },
  '4': {
    title: '代取中通/圆通快递',
    price: '¥8.00',
    originalPrice: '',
    description: '每天下午5-6点去菜鸟驿站，可以帮带快递到东区宿舍。中通/圆通均可，大件另议。当天送达，安全可靠。',
    seller: '跑腿小王',
    sellerAvatar: 'paotui',
    tags: ['跑腿', '快递', '代取', '中通', '圆通'],
    type: '跑腿',
    imageSeed: 'package',
    status: '进行中'
  },
  '5': {
    title: '全新高等数学第七版',
    price: '¥28.00',
    originalPrice: '¥48.00',
    description: '全新高等数学第七版上册，买来后几乎没翻过，适合大一新生。西区超市旁面交，可小刀。',
    seller: '学霸学长',
    sellerAvatar: 'xueba',
    tags: ['教材', '高数', '高等数学', '全新'],
    type: '二手',
    imageSeed: 'math-book',
    condition: '全新',
    status: '在售'
  },
  '6': {
    title: '蓝色水杯（南教203捡到）',
    price: '',
    originalPrice: '',
    description: '在南教203教室捡到蓝色水杯一个，杯身有"Keep"字样。请失主到南教一楼失物招领处认领。',
    seller: '保洁阿姨',
    sellerAvatar: 'ayi',
    tags: ['失物招领', '水杯', '南教'],
    type: '失物',
    imageSeed: 'cup',
    status: '待认领'
  },
  '7': {
    title: '周末羽毛球拼单',
    price: '',
    originalPrice: '',
    description: '周末体育馆羽毛球场已预约，缺2人拼单。每人AA场地费15元，自带球拍，球我来提供。欢迎高手新手一起玩！',
    seller: '运动达人',
    sellerAvatar: 'sport',
    tags: ['拼单', '羽毛球', '运动', '周末'],
    type: '拼单',
    imageSeed: 'badminton',
    status: '拼单中'
  },
  '8': {
    title: '代取外卖送到宿舍',
    price: '¥3.00',
    originalPrice: '',
    description: '北门外卖柜代取送到宿舍楼下，每单3元。高峰期11:30-12:30接单，下单后30分钟内送达。',
    seller: '跑腿小王',
    sellerAvatar: 'paotui',
    tags: ['跑腿', '外卖', '代取', '送餐'],
    type: '跑腿',
    imageSeed: 'food',
    status: '进行中'
  },
  '9': {
    title: '雅思词汇书（9成新）',
    price: '¥15.00',
    originalPrice: '¥39.00',
    description: '雅思词汇书（乱序版），9成新，内页干净无涂写。附赠雅思备考资料电子版。东校区面交。',
    seller: '校园小达人',
    sellerAvatar: 'xiaoda',
    tags: ['教材', '雅思', '词汇书', '英语'],
    type: '二手',
    imageSeed: 'ielts',
    condition: '九成新',
    status: '在售'
  },
  '10': {
    title: '自行车钥匙（钥匙串）',
    price: '',
    originalPrice: '',
    description: '在东区停车场捡到自行车钥匙一把（带红色钥匙串）。失主请到东区保安室认领。',
    seller: '保安大叔',
    sellerAvatar: 'security',
    tags: ['失物招领', '钥匙', '自行车'],
    type: '失物',
    imageSeed: 'key',
    status: '待认领'
  },
  '11': {
    title: '咖啡拼单（瑞幸9.9）',
    price: '',
    originalPrice: '',
    description: '瑞幸9.9元咖啡拼单！校内瑞幸店自取，目前1人，还差2人成团。生椰拿铁/标准美式均可，下午2点前下单。',
    seller: '咖啡达人',
    sellerAvatar: 'coffee',
    tags: ['拼单', '咖啡', '瑞幸', '9.9'],
    type: '拼单',
    imageSeed: 'coffee',
    status: '拼单中'
  },
  '12': {
    title: '代取京东/顺丰大件',
    price: '¥10.00',
    originalPrice: '',
    description: '专业代取京东/顺丰大件快递，可帮忙搬上宿舍。菜鸟驿站→西区宿舍，每单10元，大件家电/箱子均可。',
    seller: '跑腿小王',
    sellerAvatar: 'paotui',
    tags: ['跑腿', '京东', '顺丰', '大件'],
    type: '跑腿',
    imageSeed: 'delivery',
    status: '进行中'
  }
}

const itemId = route.params.id as string
const item = computed(() => mockItems[itemId] || mockItems['1']!)
</script>

<template>
  <div class="detail-wrapper">
    <div class="detail-top-bar">
      <span class="back-btn" @click="goBack">← 返回</span>
    </div>
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
</style>
