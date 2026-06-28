<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ElButton, ElInput, ElSelect, ElOption,
  ElForm, ElFormItem,
  ElUpload, ElDatePicker, ElInputNumber,
  ElTabs, ElTabPane,
  ElIcon, ElRadioGroup, ElRadioButton,
  ElAlert
} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('second-hand')

function goBack() {
  router.push('/')
}

const secondHandForm = reactive({
  title: '',
  campus: '',
  location: '',
  description: '',
  price: 0,
  condition: 5,
  tags: '',
  images: [] as string[]
})

const lostForm = reactive({
  title: '',
  type: 'lost',
  campus: '',
  location: '',
  description: '',
  happenTime: '',
  features: '',
  contact: ''
})

const groupForm = reactive({
  title: '',
  campus: '',
  location: '',
  description: '',
  targetCount: 2,
  deadline: '',
  contact: ''
})

const errandForm = reactive({
  title: '',
  campus: '',
  location: '',
  description: '',
  reward: 0,
  completionTime: '',
  contact: ''
})

const uploadedPreviews = ref([
  { id: 1, gradient: 'linear-gradient(135deg, #f5d0b0, #FFE8D6, #fff9f3)', label: '商品图1' },
  { id: 2, gradient: 'linear-gradient(135deg, #e8dcc8, #f0e8d8, #fff9f3)', label: '商品图2' }
])

function handleUpload() {
  ElMessage.info('模拟：打开文件选择器上传图片')
}

function removePreview(id: number) {
  uploadedPreviews.value = uploadedPreviews.value.filter(p => p.id !== id)
  ElMessage.success('已移除图片')
}

function handleSubmit() {
  ElMessage.success('发布成功！')
}

function handleReset() {
  Object.assign(secondHandForm, {
    title: '', campus: '', location: '', description: '',
    price: 0, condition: 5, tags: '', images: []
  })
  Object.assign(lostForm, {
    title: '', type: 'lost', campus: '', location: '', description: '',
    happenTime: '', features: '', contact: ''
  })
  Object.assign(groupForm, {
    title: '', campus: '', location: '', description: '',
    targetCount: 2, deadline: '', contact: ''
  })
  Object.assign(errandForm, {
    title: '', campus: '', location: '', description: '',
    reward: 0, completionTime: '', contact: ''
  })
  ElMessage.success('所有表单已重置')
}
</script>

<template>
  <div class="page-container">
    <div class="top-bar">
      <span class="back-btn" @click="goBack">&lt;</span>
      <span>发布信息</span>
    </div>

    <div class="content-area">
      <div class="form-card">
        <ElTabs v-model="activeTab" class="publish-tabs" :stretch="true">
          <ElTabPane label="二手交易" name="second-hand">
            <ElForm label-position="top" :model="secondHandForm" class="publish-form">
              <ElFormItem label="标题">
                <template #label><span>标题<span class="required-star">*</span></span></template>
                <ElInput v-model="secondHandForm.title" placeholder="请输入商品标题" />
              </ElFormItem>
              <ElFormItem label="所属校区">
                <ElSelect v-model="secondHandForm.campus" placeholder="请选择校区">
                  <ElOption label="校本部" value="main" />
                  <ElOption label="东校区" value="east" />
                  <ElOption label="西校区" value="west" />
                  <ElOption label="南校区" value="south" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem label="交易地点">
                <ElInput v-model="secondHandForm.location" placeholder="如：图书馆一楼大厅" />
              </ElFormItem>
              <ElFormItem label="商品描述">
                <ElInput v-model="secondHandForm.description" type="textarea" :rows="4" placeholder="请详细描述商品信息、使用情况等" />
              </ElFormItem>
              <ElFormItem label="价格（元）">
                <ElInputNumber v-model="secondHandForm.price" :min="0" :precision="2" style="width:200px;" />
              </ElFormItem>
              <ElFormItem label="成色评分（1-10）">
                <ElInputNumber v-model="secondHandForm.condition" :min="1" :max="10" style="width:200px;" />
                <div class="form-hint">1 = 较差, 10 = 全新</div>
              </ElFormItem>
              <ElFormItem label="标签">
                <ElInput v-model="secondHandForm.tags" placeholder="如：教材, 九成新, 可议价（用逗号分隔）" />
              </ElFormItem>
              <ElFormItem label="上传图片">
                <div class="upload-area" @click="handleUpload">
                  <div class="upload-icon">
                    <div class="upload-plus-icon" style="background: linear-gradient(135deg, #f5d0b0, #FFE8D6);">+</div>
                  </div>
                  <div>点击或拖拽上传图片</div>
                  <div class="upload-tip">支持 JPG/PNG，最多 6 张</div>
                </div>
                <div class="preview-list">
                  <div
                    v-for="item in uploadedPreviews"
                    :key="item.id"
                    class="preview-item"
                    :style="{ background: item.gradient }"
                    @click="removePreview(item.id)"
                    :title="'点击移除' + item.label"
                  >
                    <span class="preview-label">{{ item.label }}</span>
                  </div>
                </div>
              </ElFormItem>
            </ElForm>
          </ElTabPane>

          <ElTabPane label="失物招领" name="lost-found">
            <ElForm label-position="top" :model="lostForm" class="publish-form">
              <ElFormItem label="类型">
                <ElRadioGroup v-model="lostForm.type">
                  <ElRadioButton value="lost">寻物启事</ElRadioButton>
                  <ElRadioButton value="found">失物招领</ElRadioButton>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem label="标题">
                <template #label><span>标题<span class="required-star">*</span></span></template>
                <ElInput v-model="lostForm.title" placeholder="如：寻找黑色钱包 / 拾获学生卡一张" />
              </ElFormItem>
              <ElFormItem label="所属校区">
                <ElSelect v-model="lostForm.campus" placeholder="请选择校区">
                  <ElOption label="校本部" value="main" />
                  <ElOption label="东校区" value="east" />
                  <ElOption label="西校区" value="west" />
                  <ElOption label="南校区" value="south" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem label="地点">
                <ElInput v-model="lostForm.location" placeholder="丢失/拾获的具体位置" />
              </ElFormItem>
              <ElFormItem label="发生时间">
                <ElDatePicker v-model="lostForm.happenTime" type="datetime" placeholder="选择时间" style="width:100%;" />
              </ElFormItem>
              <ElFormItem label="特征描述">
                <ElInput v-model="lostForm.features" type="textarea" :rows="3" placeholder="物品的颜色、品牌、型号等特征" />
              </ElFormItem>
              <ElFormItem label="详细描述">
                <ElInput v-model="lostForm.description" type="textarea" :rows="3" placeholder="补充说明" />
              </ElFormItem>
              <ElFormItem label="联系方式">
                <ElInput v-model="lostForm.contact" placeholder="手机号 / 微信 / QQ" />
              </ElFormItem>
            </ElForm>
          </ElTabPane>

          <ElTabPane label="拼单搭子" name="group-order">
            <ElForm label-position="top" :model="groupForm" class="publish-form">
              <ElFormItem label="标题">
                <template #label><span>标题<span class="required-star">*</span></span></template>
                <ElInput v-model="groupForm.title" placeholder="如：奶茶第二杯半价求拼" />
              </ElFormItem>
              <ElFormItem label="所属校区">
                <ElSelect v-model="groupForm.campus" placeholder="请选择校区">
                  <ElOption label="校本部" value="main" />
                  <ElOption label="东校区" value="east" />
                  <ElOption label="西校区" value="west" />
                  <ElOption label="南校区" value="south" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem label="地点">
                <ElInput v-model="groupForm.location" placeholder="交易/自取地点" />
              </ElFormItem>
              <ElFormItem label="目标人数">
                <ElInputNumber v-model="groupForm.targetCount" :min="2" :max="50" style="width:200px;" />
                <div class="form-hint">达到此人数后自动成团</div>
              </ElFormItem>
              <ElFormItem label="截止时间">
                <ElDatePicker v-model="groupForm.deadline" type="datetime" placeholder="选择截止时间" style="width:100%;" />
              </ElFormItem>
              <ElFormItem label="详细描述">
                <ElInput v-model="groupForm.description" type="textarea" :rows="4" placeholder="描述拼单内容、价格分摊方式等" />
              </ElFormItem>
              <ElFormItem label="联系方式">
                <ElInput v-model="groupForm.contact" placeholder="手机号 / 微信 / QQ" />
              </ElFormItem>
            </ElForm>
          </ElTabPane>

          <ElTabPane label="跑腿委托" name="errand">
            <ElForm label-position="top" :model="errandForm" class="publish-form">
              <ElFormItem label="标题">
                <template #label><span>标题<span class="required-star">*</span></span></template>
                <ElInput v-model="errandForm.title" placeholder="如：代取韵达快递到海韵公寓" />
              </ElFormItem>
              <ElFormItem label="所属校区">
                <ElSelect v-model="errandForm.campus" placeholder="请选择校区">
                  <ElOption label="校本部" value="main" />
                  <ElOption label="东校区" value="east" />
                  <ElOption label="西校区" value="west" />
                  <ElOption label="南校区" value="south" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem label="地点">
                <ElInput v-model="errandForm.location" placeholder="取件/办事地点" />
              </ElFormItem>
              <ElFormItem label="报酬（元）">
                <ElInputNumber v-model="errandForm.reward" :min="0" :precision="2" style="width:200px;" />
              </ElFormItem>
              <ElFormItem label="完成时限">
                <ElDatePicker v-model="errandForm.completionTime" type="datetime" placeholder="期望完成时间" style="width:100%;" />
              </ElFormItem>
              <ElFormItem label="详细描述">
                <ElInput v-model="errandForm.description" type="textarea" :rows="4" placeholder="跑腿任务的具体要求、取件码、联系人等" />
              </ElFormItem>
              <ElFormItem label="联系方式">
                <ElInput v-model="errandForm.contact" placeholder="手机号 / 微信 / QQ" />
              </ElFormItem>
            </ElForm>
          </ElTabPane>
        </ElTabs>

        <div class="btn-group">
          <button class="btn-submit" @click="handleSubmit">提交发布</button>
          <button class="btn-reset" @click="handleReset">重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --main: #FFE8D6;
  --secondary: #FFF9F3;
  --text-primary: #333;
  --text-secondary: #666;
}

.page-container {
  width: 100%;
}

.top-bar {
  background: var(--main);
  padding: 16px 48px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  font-weight: 600;
}

.back-btn {
  font-size: 22px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  line-height: 1;
}

.content-area {
  padding: 40px 80px;
}

.form-card {
  background: #fff;
  border: 2px solid var(--main);
  border-radius: 20px;
  padding: 48px 56px;
  max-width: 800px;
  margin: 0 auto;
}

.publish-tabs {
  margin-bottom: 8px;
}

.publish-form {
  margin-top: 24px;
}

.publish-form .el-form-item {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

.required-star {
  color: #f56c6c;
  margin-left: 2px;
}

.form-hint {
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 4px;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
  width: 100%;
}

.upload-area:hover {
  border-color: var(--main);
}

.upload-icon {
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
}

.upload-plus-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #7a6a5a;
}

.upload-tip {
  font-size: 12px;
  margin-top: 4px;
}

.preview-list {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.preview-item {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #5a4a3a;
  border: 1px solid #e0d0c0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.preview-item:hover {
  opacity: 0.7;
}

.preview-label {
  background: rgba(255,255,255,0.7);
  padding: 2px 6px;
  border-radius: 4px;
}

.btn-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
}

.btn-submit {
  background: linear-gradient(135deg, #FFE8D6, #f5d0b0);
  border: none;
  color: var(--text-primary);
  font-weight: 600;
  padding: 12px 48px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
}

.btn-submit:hover { opacity: 0.85; }

.btn-reset {
  background: #e0e0e0;
  border: none;
  color: var(--text-secondary);
  font-weight: 500;
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.btn-reset:hover { background: #d0d0d0; }

@media (max-width: 768px) {
  .top-bar { padding: 16px; }
  .content-area { padding: 24px 16px; }
  .form-card { padding: 24px 20px; }
}
</style>
