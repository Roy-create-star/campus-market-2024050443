<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElCard, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({ ...userStore.profile })

const colleges = ['计算机学院', '外语学院', '体育系', '信电学院', '建筑学院', '数学学院', '物理学院', '化学学院', '医学院', '法学院']
const campuses = ['紫金港校区', '玉泉校区', '西溪校区', '华家池校区', '之江校区']

function handleSave() {
  userStore.updateProfile({ ...form })
  ElMessage.success('资料已保存')
  router.back()
}

function handleCancel() {
  router.back()
}
</script>

<template>
  <div class="edit-profile-page">
    <el-card shadow="never" class="edit-card">
      <div class="edit-title">编辑资料</div>
      <el-form label-width="80px" class="edit-form">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.studentId" placeholder="学号不可修改" disabled />
        </el-form-item>
        <el-form-item label="学院">
          <el-select v-model="form.college" placeholder="请选择学院" style="width:100%">
            <el-option v-for="c in colleges" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="校区">
          <el-select v-model="form.campus" placeholder="请选择校区" style="width:100%">
            <el-option v-for="c in campuses" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="form.bio" type="textarea" :rows="3" placeholder="介绍一下自己" />
        </el-form-item>
      </el-form>
      <div class="form-actions">
        <el-button round @click="handleCancel">取消</el-button>
        <el-button type="primary" round @click="handleSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.edit-profile-page { max-width: 560px; margin: 0 auto; }
.edit-card { border-radius: 12px; }
.edit-title { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 3px solid #FFE8D6; }
.edit-form { margin-top: 8px; }
.form-actions { display: flex; justify-content: center; gap: 16px; margin-top: 24px; }
.form-actions .el-button { min-width: 120px; }
</style>
