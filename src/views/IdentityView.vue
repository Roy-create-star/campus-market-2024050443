<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

/* 【迁移说明】此页面由 identity.html 迁移，表单数据提交封装至 api.ts */

const form = reactive({
  nickname: '',
  college: '',
  campus: 'main',
  role: '',
  bio: ''
})

const loading = ref(false)
const identityFormRef = ref<FormInstance>()
const showRoleError = ref(false)

const rules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 12, message: '昵称长度在 2 到 12 个字符', trigger: 'blur' }
  ],
  college: [
    { required: true, message: '请选择学院', trigger: 'change' }
  ],
  campus: [
    { required: true, message: '请选择校区', trigger: 'change' }
  ],
  role: [
    { required: true, message: '请填写身份标签', trigger: 'blur' }
  ]
}

function handleEnter() {
  showRoleError.value = false
  if (!identityFormRef.value) return
  identityFormRef.value.validate((valid) => {
    if (valid) {
      if (!form.role.trim()) {
        showRoleError.value = true
        return
      }
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage.success('身份创建成功，欢迎进入校园集市！（静态演示）')
      }, 1200)
    } else {
      if (!form.role.trim()) {
        showRoleError.value = true
      }
      ElMessage.warning('请完善身份信息')
    }
  })
}
</script>

<template>
  <!-- 顶部导航 -->
  <nav class="navbar">
    <div class="navbar-inner">
      <div class="brand">🏫 校园轻集市</div>
      <div class="navbar-actions">
        <span>📞 帮助中心</span>
        <span style="cursor:pointer;">登录 / 注册</span>
      </div>
    </div>
  </nav>

  <!-- 主体内容 -->
  <div class="page-body">
    <!-- 左侧表单 -->
    <div class="form-section">
      <h1 class="section-title">🆔 创建校园身份</h1>
      <p class="section-desc">完善个人信息，开启你的校园集市之旅</p>

      <!-- 信用积分预览卡片 -->
      <div class="credit-card">
        <div class="credit-score">
          <span class="num">100</span>
          <span class="label">信用分</span>
        </div>
        <div class="credit-info">
          <h4>🌟 信用体系预览</h4>
          <p>初始信用分 100，完成实名认证 +20，发布商品 +5/次，违规行为将扣除信用分。</p>
        </div>
      </div>
      <!-- 【此处封装 api.ts】 信用分接口 -->

      <el-form ref="identityFormRef" :model="form" label-position="top" size="large" :rules="rules">
        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="你的校园昵称（2-12个字符）" prefix-icon="Edit" maxlength="12" show-word-limit />
        </el-form-item>

        <!-- 学院 -->
        <el-form-item label="学院" prop="college">
          <el-select v-model="form.college" placeholder="请选择你的学院" style="width:100%;">
            <el-option label="计算机科学与技术学院" value="cs" />
            <el-option label="电子信息工程学院" value="ee" />
            <el-option label="经济管理学院" value="em" />
            <el-option label="人文社会科学学院" value="hs" />
            <el-option label="外国语学院" value="fl" />
            <el-option label="数学与统计学院" value="ms" />
            <el-option label="艺术与设计学院" value="ad" />
            <el-option label="材料科学与工程学院" value="mse" />
          </el-select>
        </el-form-item>

        <!-- 校区 -->
        <el-form-item label="校区" prop="campus">
          <el-radio-group v-model="form.campus">
            <el-radio value="main">🏛️ 主校区</el-radio>
            <el-radio value="east">🌳 东校区</el-radio>
            <el-radio value="west">🌅 西校区</el-radio>
            <el-radio value="south">🌸 南校区</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 角色 -->
        <el-form-item label="身份标签" prop="role">
          <el-input v-model="form.role" placeholder="如：大三计科生 / 研一通信 / 大二外院" prefix-icon="CollectionTag" />
          <span class="error-text" v-if="showRoleError">请填写你的身份标签</span>
        </el-form-item>

        <!-- 个性签名 -->
        <el-form-item label="个性签名（选填）">
          <el-input v-model="form.bio" type="textarea" :rows="3" placeholder="介绍一下自己吧～" maxlength="60" show-word-limit />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="enter-btn" @click="handleEnter" :loading="loading">🚀 进入集市</el-button>
        </el-form-item>
      </el-form>

      <div class="form-footer-links">
        <span>⏩ 稍后完善 · 跳过此步</span>
        <a href="javascript:void(0)">已有身份？直接登录 →</a>
      </div>
    </div>

    <!-- 右侧插画占位（校园图书馆） -->
    <div class="illustration-section">
      <div class="illustration-box">
        <div class="emoji-display">📚</div>
        <h3>校园图书馆</h3>
        <p>
          在熟悉的校园里<br>
          交易闲置 · 寻找丢失的物品<br>
          找到一起拼单的伙伴<br>
          让校园生活更便捷
        </p>
        <div class="tag-wrap">
          <span class="tag-item">📦 二手</span>
          <span class="tag-item">🔍 失物</span>
          <span class="tag-item">🤝 拼单</span>
          <span class="tag-item">🏃 跑腿</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  background: #FFE8D6;
  padding: 0 40px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.navbar-inner {
  max-width: 1440px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.page-body {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 48px;
  align-items: flex-start;
}

@media (max-width: 1024px) {
  .page-body {
    flex-direction: column;
    align-items: center;
  }
}

.form-section {
  flex: 1;
  max-width: 560px;
}

.illustration-section {
  width: 380px;
  position: sticky;
  top: 40px;
}

@media (max-width: 1024px) {
  .illustration-section {
    display: none;
  }
}

.section-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
}

.section-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}

.credit-card {
  background: #FFE8D6;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.credit-score {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.credit-score .num {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.credit-score .label {
  font-size: 10px;
  color: #999;
}

.credit-info h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.credit-info p {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.enter-btn {
  width: 100%;
  height: 48px;
  font-size: 17px;
  font-weight: 600;
  background: linear-gradient(135deg, #FFE8D6 0%, #FFD9B3 100%) !important;
  border: none !important;
  color: #333 !important;
  letter-spacing: 2px;
}

.enter-btn:hover {
  background: linear-gradient(135deg, #FFD9B3 0%, #FFC999 100%) !important;
}

.illustration-box {
  background: linear-gradient(135deg, #FFF9F3 0%, #FFE8D6 100%);
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
}

.illustration-box .emoji-display {
  font-size: 120px;
  margin-bottom: 16px;
}

.illustration-box h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.illustration-box p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.error-text {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  display: block;
}

.form-footer-links {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 13px;
  color: #999;
}

.form-footer-links a {
  color: #666;
  text-decoration: none;
}

.form-footer-links a:hover {
  color: #333;
}

.tag-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tag-item {
  background: rgba(255,255,255,0.7);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}
</style>
