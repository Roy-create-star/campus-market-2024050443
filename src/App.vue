<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const activeIndex = ref('/home')

watch(() => route.path, (path) => {
  activeIndex.value = path
}, { immediate: true })

function handleSelect(index: string) {
  router.push(index)
}

const navItems = [
  { path: '/home', label: '首页' },
  { path: '/list', label: '集市' },
  { path: '/publish', label: '发布' },
  { path: '/message', label: '消息' },
  { path: '/board', label: '看板' },
  { path: '/profile', label: '我的' },
]
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <div class="brand" @click="router.push('/home')">
          <span class="brand-icon">🎒</span>
          <span class="brand-text">校园轻集市</span>
        </div>
        <nav class="nav-links">
          <span
            v-for="item in navItems"
            :key="item.path"
            :class="['nav-link', { active: route.path.startsWith(item.path) }]"
            @click="router.push(item.path)"
          >{{ item.label }}</span>
        </nav>
        <div class="header-actions">
          <el-button size="small" round @click="router.push('/publish')">发布信息</el-button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #FFF9F3;
  color: #333;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #FFE8D6, #FFDCC0);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.brand-icon {
  font-size: 28px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.nav-link {
  padding: 8px 16px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-link:hover {
  background: rgba(255,255,255,0.5);
  color: #333;
}

.nav-link.active {
  background: rgba(255,255,255,0.7);
  color: #333;
  font-weight: 600;
}

.header-actions {
  flex-shrink: 0;
}

.app-main {
  flex: 1;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 32px;
  width: 100%;
}
</style>
