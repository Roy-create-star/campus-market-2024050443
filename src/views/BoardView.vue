<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElRow, ElCol, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const stats = ref([
  { label: '总发布量', value: '45', detail: '累计发布商品与帖子总量' },
  { label: '收藏总量', value: '128', detail: '所有用户收藏总数' },
  { label: '消息总数', value: '256', detail: '站内即时消息总条数' },
  { label: '本周新增', value: '12', detail: '本周新增发布量' }
])

const hotItems = ref([
  { title: '高等数学第七版教材', views: 120, favorites: 45 },
  { title: '校园卡丢失寻回', views: 98, favorites: 32 },
  { title: '周末拼车去市区', views: 87, favorites: 28 },
  { title: '代取快递（南区）', views: 76, favorites: 22 },
  { title: '二手电动车转让', views: 65, favorites: 19 },
  { title: '英语四级真题全套', views: 54, favorites: 16 },
  { title: '羽毛球拍低价出', views: 48, favorites: 14 }
])

const pieChartRef = ref<HTMLDivElement>()
const barChartRef = ref<HTMLDivElement>()
const lineChartRef = ref<HTMLDivElement>()

let pieInstance: echarts.ECharts | null = null
let barInstance: echarts.ECharts | null = null
let lineInstance: echarts.ECharts | null = null

function initCharts() {
  if (pieChartRef.value) {
    pieInstance = echarts.init(pieChartRef.value)
    pieInstance.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
      legend: { bottom: 0, textStyle: { fontSize: 12, color: '#666' } },
      series: [{
        type: 'pie',
        radius: ['38%', '68%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, color: '#333' },
        emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold' } },
        data: [
          { value: 45, name: '二手', itemStyle: { color: '#FFE8D6' } },
          { value: 25, name: '失物', itemStyle: { color: '#E6F4EA' } },
          { value: 18, name: '拼单', itemStyle: { color: '#FFDCC0' } },
          { value: 12, name: '跑腿', itemStyle: { color: '#FFF0E3' } }
        ]
      }]
    })
  }

  if (barChartRef.value) {
    barInstance = echarts.init(barChartRef.value)
    barInstance.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '5%', right: '5%', bottom: '12%', top: '5%', containLabel: true },
      xAxis: { type: 'category', data: ['校本部', '东校区', '西校区', '南校区', '北校区'], axisLabel: { fontSize: 11, color: '#666' }, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }, axisLabel: { fontSize: 11, color: '#999' } },
      series: [{
        type: 'bar',
        barWidth: '45%',
        data: [28, 22, 18, 15, 12],
        itemStyle: { color: '#FFE8D6', borderRadius: [6, 6, 0, 0] },
        emphasis: { itemStyle: { color: '#f5cba7' } }
      }]
    })
  }

  if (lineChartRef.value) {
    lineInstance = echarts.init(lineChartRef.value)
    lineInstance.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '4%', right: '4%', bottom: '12%', top: '5%', containLabel: true },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], axisLabel: { fontSize: 11, color: '#666' }, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }, axisLabel: { fontSize: 11, color: '#999' } },
      series: [{
        type: 'line',
        smooth: true,
        data: [5, 8, 6, 10, 12, 7, 9],
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#FFE8D6', width: 3 },
        itemStyle: { color: '#FFE8D6' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255,232,214,0.45)' },
              { offset: 1, color: 'rgba(255,232,214,0.04)' }
            ]
          }
        }
      }]
    })
  }
}

function onStatClick(s: { label: string; value: string; detail: string }) {
  ElMessage.info(`${s.label}: ${s.value} · ${s.detail}`)
}

function onRowClick(row: { title: string }) {
  ElMessage.info(`查看详情: ${row.title}`)
}

function handleResize() {
  pieInstance?.resize()
  barInstance?.resize()
  lineInstance?.resize()
}

onMounted(async () => {
  await nextTick()
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  pieInstance?.dispose()
  barInstance?.dispose()
  lineInstance?.dispose()
})
</script>

<template>
  <div class="board-container">
    <!-- Header -->
    <div class="board-header">
      <h1 class="header-title">数据趋势看板</h1>
      <span class="header-subtitle">校园轻集市 · 管理后台</span>
    </div>

    <div class="board-body">
      <!-- Stats Row -->
      <el-row :gutter="24" class="mb-8">
        <el-col :span="6" v-for="s in stats" :key="s.label">
          <div class="stat-card" @click="onStatClick(s)">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </el-col>
      </el-row>

      <!-- Charts + Hot Items -->
      <el-row :gutter="24">
        <!-- Left: Charts -->
        <el-col :span="17">
          <!-- Pie + Bar -->
          <el-row :gutter="24" class="mb-6">
            <el-col :span="12">
              <div class="chart-card" style="height:380px;">
                <div class="section-title">业务类型分布</div>
                <div ref="pieChartRef" class="chart-box" style="width:100%;height:300px;"></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="chart-card" style="height:380px;">
                <div class="section-title">各校区发布量</div>
                <div ref="barChartRef" class="chart-box" style="width:100%;height:300px;"></div>
              </div>
            </el-col>
          </el-row>
          <!-- Line -->
          <div class="chart-card" style="height:380px;">
            <div class="section-title">近7日发布趋势</div>
            <div ref="lineChartRef" class="chart-box" style="width:100%;height:300px;"></div>
          </div>
        </el-col>

        <!-- Right: Hot Items Ranking -->
        <el-col :span="7">
          <div class="chart-card" style="min-height:788px;">
            <div class="section-title">热门排行</div>
            <el-table :data="hotItems" stripe size="small" style="width:100%;cursor:pointer;" :header-cell-style="{background:'#FFF9F3',color:'#333',fontWeight:600}" @row-click="onRowClick">
              <el-table-column label="排名" width="60">
                <template #default="{ $index }">
                  <span :class="$index < 3 ? 'rank-top' : 'rank-normal'">{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="标题" min-width="130" show-overflow-tooltip>
                <template #default="{ row }">{{ row.title }}</template>
              </el-table-column>
              <el-table-column label="浏览" width="65" align="center" prop="views"></el-table-column>
              <el-table-column label="收藏" width="65" align="center" prop="favorites"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.board-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  color: #333;
}

.board-header {
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

.board-body {
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 20px;
  border-top: 3px solid #FFE8D6;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 6px;
  letter-spacing: 0.3px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.chart-box {
  width: 100%;
  height: 300px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #FFE8D6;
}

.rank-top {
  color: #f56c6c;
  font-weight: 700;
  font-size: 16px;
}

.rank-normal {
  color: #999;
}

.mb-6 {
  margin-bottom: 24px;
}

.mb-8 {
  margin-bottom: 32px;
}
</style>
