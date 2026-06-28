<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableInstance } from 'element-plus'

/* 【迁移说明】此页面由 admin-review.html 迁移，表格与抽屉数据管理可迁移至 Pinia 状态管理 */

interface ReviewItem {
  id: number
  title: string
  type: string
  publisher: string
  publishTime: string
  status: 'pending' | 'approved' | 'rejected'
  price?: string
  description: string
  images: string[]
  campus: string
  contact: string
}

const activeTab = ref('all')
const searchQuery = ref('')
const dateRange = ref<[Date, Date] | null>(null)
const drawerVisible = ref(false)
const currentItem = ref<ReviewItem | null>(null)
const currentPage = ref(1)
const pageSize = ref(5)
const tableRef = ref<TableInstance>()

const allData = ref<ReviewItem[]>([
  { id: 1, title: '高等数学第七版教材', type: '二手', publisher: '张同学', publishTime: '2024-01-15 14:30', status: 'approved', price: '25.00', description: '高等数学第七版上册教材，九成新，内页有少量笔记，不影响使用。价格可小刀，校本部自取。', images: ['https://via.placeholder.com/100/f5cba7/333?text=Book'], campus: '校本部', contact: '138****5678' },
  { id: 2, title: '校园卡丢失（一卡通）', type: '失物', publisher: '李同学', publishTime: '2024-01-15 10:20', status: 'pending', description: '在东校区食堂丢失校园卡一张，卡号2023****78，捡到请联系，谢谢！', images: ['https://via.placeholder.com/100/E6F4EA/333?text=Card'], campus: '东校区', contact: '159****2345' },
  { id: 3, title: '周末拼车去市中心', type: '拼单', publisher: '王同学', publishTime: '2024-01-14 18:00', status: 'pending', description: '周六下午拼车去市中心万达广场，已有2人，再找2位，人均15元。', images: ['https://via.placeholder.com/100/FFDCC0/333?text=Car'], campus: '西校区', contact: '177****8901' },
  { id: 4, title: '代取快递（南区宿舍）', type: '跑腿', publisher: '赵同学', publishTime: '2024-01-14 16:45', status: 'approved', description: '可代取南区菜鸟驿站快递，送到宿舍楼下，每单3元，量大优惠。', images: ['https://via.placeholder.com/100/FFF0E3/333?text=Package'], campus: '南校区', contact: '136****4321' },
  { id: 5, title: '二手电动车低价转让', type: '二手', publisher: '陈同学', publishTime: '2024-01-14 09:15', status: 'rejected', price: '800.00', description: '毕业离校转让电动车，使用两年，电池续航良好，价格可议。', images: ['https://via.placeholder.com/100/f5cba7/333?text=E-Bike'], campus: '校本部', contact: '188****6789' },
  { id: 6, title: '英语四级真题试卷全套', type: '二手', publisher: '刘同学', publishTime: '2024-01-13 20:30', status: 'approved', price: '15.00', description: '2023年12月四级真题全套，含听力光盘，几乎全新。', images: ['https://via.placeholder.com/100/f5cba7/333?text=Exam'], campus: '东校区', contact: '155****3456' },
  { id: 7, title: '寻物启事：黑色钱包', type: '失物', publisher: '吴同学', publishTime: '2024-01-13 12:00', status: 'pending', description: '在图书馆三楼丢失黑色短款钱包，内有身份证和学生证，非常重要！', images: ['https://via.placeholder.com/100/E6F4EA/333?text=Purse'], campus: '校本部', contact: '166****7890' },
  { id: 8, title: '周末羽毛球局招募', type: '拼单', publisher: '郑同学', publishTime: '2024-01-12 15:20', status: 'approved', description: '周日下午2-5点打羽毛球，场馆已订，缺3人，费用AA约20元/人。', images: ['https://via.placeholder.com/100/FFDCC0/333?text=Sports'], campus: '西校区', contact: '199****0123' },
  { id: 9, title: '代买早餐（北区食堂）', type: '跑腿', publisher: '孙同学', publishTime: '2024-01-12 07:40', status: 'rejected', description: '每天早上7:30-8:00可代买北区食堂早餐，送到教学楼。', images: ['https://via.placeholder.com/100/FFF0E3/333?text=Food'], campus: '北校区', contact: '137****5678' },
  { id: 10, title: '计算机二级教材+题库', type: '二手', publisher: '周同学', publishTime: '2024-01-11 22:10', status: 'pending', price: '30.00', description: '计算机二级MS Office教材附题库光盘，全新未使用。', images: ['https://via.placeholder.com/100/f5cba7/333?text=Computer'], campus: '校本部', contact: '150****2345' }
])

const filteredData = computed(() => {
  let data = allData.value
  if (activeTab.value !== 'all') {
    data = data.filter(item => item.status === activeTab.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    data = data.filter(item => item.title.toLowerCase().includes(q))
  }
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const start = dateRange.value[0].getTime()
    const end = dateRange.value[1].getTime()
    data = data.filter(item => {
      const t = new Date(item.publishTime.replace(' ', 'T')).getTime()
      return t >= start && t <= end + 86400000
    })
  }
  return data
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const selectedCount = computed(() => {
  if (!tableRef.value) return 0
  return tableRef.value.getSelectionRows().length
})

watch([activeTab, searchQuery, dateRange], () => {
  currentPage.value = 1
})

function onTabChange() {
  currentPage.value = 1
}

function tagType(type: string) {
  const map: Record<string, string> = { '二手': '', '失物': 'danger', '拼单': 'warning', '跑腿': 'info' }
  return map[type] || ''
}

function statusColor(status: string) {
  const map: Record<string, string> = { pending: '#f39c12', approved: '#67c23a', rejected: '#f56c6c' }
  return map[status] || '#909399'
}

function statusLabel(status: string) {
  const map: Record<string, string> = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
  return map[status] || status
}

function handleRowClick(row: ReviewItem) {
  currentItem.value = row
  drawerVisible.value = true
}

function viewDetail(row: ReviewItem) {
  currentItem.value = row
  drawerVisible.value = true
}

function approveItem(item: ReviewItem) {
  item.status = 'approved'
  ElMessage.success('已通过：' + item.title)
}

function rejectItem(item: ReviewItem) {
  item.status = 'rejected'
  ElMessage.warning('已拒绝：' + item.title)
}

function batchApprove() {
  const rows = tableRef.value ? tableRef.value.getSelectionRows() as ReviewItem[] : []
  if (rows.length === 0) {
    ElMessage.info('请先选择需要操作的数据')
    return
  }
  rows.forEach(r => { r.status = 'approved' })
  ElMessage.success('批量通过 ' + rows.length + ' 条')
}

function batchReject() {
  const rows = tableRef.value ? tableRef.value.getSelectionRows() as ReviewItem[] : []
  if (rows.length === 0) {
    ElMessage.info('请先选择需要操作的数据')
    return
  }
  rows.forEach(r => { r.status = 'rejected' })
  ElMessage.warning('已批量拒绝 ' + rows.length + ' 条')
}

const pendingCount = computed(() => allData.value.filter(i => i.status === 'pending').length)
const todayCount = '3'
</script>

<template>
  <div class="review-container">
    <!-- Header -->
    <div class="review-header">
      <h1 class="header-title">信息审核</h1>
      <span class="header-subtitle">校园轻集市 · 管理后台</span>
    </div>

    <div class="review-body">
      <!-- Stats summary -->
      <div class="stat-bar">
        <span>待审核 <strong class="count-warning">{{ pendingCount }}</strong> 条</span>
        <span class="sep">|</span>
        <span>今日新增 <strong class="count-warning">{{ todayCount }}</strong> 条</span>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <el-row :gutter="16" align="middle">
          <el-col :span="14">
            <el-tabs v-model="activeTab" @tab-change="onTabChange" class="review-tabs">
              <el-tab-pane label="全部" name="all"></el-tab-pane>
              <el-tab-pane label="待审核" name="pending"></el-tab-pane>
              <el-tab-pane label="已通过" name="approved"></el-tab-pane>
              <el-tab-pane label="已拒绝" name="rejected"></el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="10" class="text-right">
            <el-input v-model="searchQuery" placeholder="搜索标题..." style="width:180px;margin-right:12px;" size="small" clearable>
              <template #prefix>
                <span style="color:#999;">🔍</span>
              </template>
            </el-input>
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" size="small" style="width:220px;" clearable></el-date-picker>
          </el-col>
        </el-row>
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <el-table
          :data="pagedData"
          stripe
          @row-click="handleRowClick"
          ref="tableRef"
          :header-cell-style="{background:'#FFF9F3',color:'#333',fontWeight:600}"
          style="width:100%;">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="标题" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">{{ row.title }}</template>
          </el-table-column>
          <el-table-column label="类型" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="tagType(row.type)" size="small" effect="plain">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布人" width="110" align="center" prop="publisher"></el-table-column>
          <el-table-column label="发布时间" width="170" align="center" prop="publishTime"></el-table-column>
          <el-table-column label="状态" width="110" align="center">
            <template #default="{ row }">
              <el-tag :color="statusColor(row.status)" size="small" style="color:#fff;border:none;border-radius:4px;">{{ statusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click.stop="viewDetail(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- Bottom bar -->
        <el-row :gutter="16" class="bottom-bar" align="middle">
          <el-col :span="12">
            <el-button type="success" size="small" plain @click="batchApprove">批量通过</el-button>
            <el-button type="danger" size="small" plain @click="batchReject">批量拒绝</el-button>
            <span class="selected-text">已选择 {{ selectedCount }} 项</span>
          </el-col>
          <el-col :span="12" class="text-right">
            <el-pagination
              v-model:page-size="pageSize"
              v-model:current-page="currentPage"
              :total="filteredData.length"
              layout="total, prev, pager, next"
              small>
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- Detail Drawer -->
    <el-drawer v-model="drawerVisible" title="信息详情" size="480px" :close-on-click-modal="false">
      <template #default>
        <div v-if="currentItem" class="drawer-body">
          <div class="image-list">
            <div v-for="(img, i) in currentItem.images" :key="i" class="image-item">
              <img :src="img" alt="preview">
            </div>
          </div>

          <div class="detail-label">标题</div>
          <div class="detail-value title-value">{{ currentItem.title }}</div>

          <el-row :gutter="16">
            <el-col :span="12">
              <div class="detail-label">类型</div>
              <div class="detail-value">{{ currentItem.type }}</div>
            </el-col>
            <el-col :span="12">
              <div class="detail-label">校区</div>
              <div class="detail-value">{{ currentItem.campus || '校本部' }}</div>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :span="12">
              <div class="detail-label">发布人</div>
              <div class="detail-value">{{ currentItem.publisher }}</div>
            </el-col>
            <el-col :span="12">
              <div class="detail-label">发布时间</div>
              <div class="detail-value">{{ currentItem.publishTime }}</div>
            </el-col>
          </el-row>

          <el-row :gutter="16" v-if="currentItem.price">
            <el-col :span="12">
              <div class="detail-label">价格</div>
              <div class="detail-value price-value">¥{{ currentItem.price }}</div>
            </el-col>
            <el-col :span="12">
              <div class="detail-label">状态</div>
              <div class="detail-value">
                <el-tag :color="statusColor(currentItem.status)" size="small" style="color:#fff;border:none;">{{ statusLabel(currentItem.status) }}</el-tag>
              </div>
            </el-col>
          </el-row>

          <div class="detail-label">联系方式</div>
          <div class="detail-value">{{ currentItem.contact || '138****5678' }}</div>

          <div class="detail-label">描述</div>
          <div class="detail-value desc-value">{{ currentItem.description }}</div>

          <div class="action-bar">
            <el-button type="success" @click="approveItem(currentItem)" :disabled="currentItem.status !== 'pending'" style="flex:1;">通过</el-button>
            <el-button type="danger" @click="rejectItem(currentItem)" :disabled="currentItem.status !== 'pending'" style="flex:1;">拒绝</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
.review-container {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  color: #333;
}

.review-header {
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FFE8D6;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  letter-spacing: 0.5px;
}

.header-subtitle {
  font-size: 14px;
  color: #666;
}

.review-body {
  padding: 32px;
  max-width: 1920px;
  margin: 0 auto;
}

.stat-bar {
  background-color: #FFF9F3;
  border-radius: 10px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.count-warning {
  color: #f39c12;
}

.sep {
  color: #ddd;
}

.filter-bar {
  background: #fff;
  border-radius: 12px;
  padding: 8px 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

.table-wrap {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.bottom-bar {
  margin-top: 20px;
}

.selected-text {
  font-size: 14px;
  color: #666;
  margin-left: 12px;
}

.detail-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;
}

.title-value {
  font-size: 16px;
  font-weight: 600;
}

.price-value {
  color: #f56c6c;
  font-weight: 600;
}

.desc-value {
  line-height: 1.7;
  background: #fafafa;
  padding: 12px;
  border-radius: 8px;
  color: #555;
}

.image-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.image-item {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.action-bar {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.drawer-body {
  padding: 0 8px;
}

.text-right {
  text-align: right;
}
</style>
