<template>
  <nav class="app-nav">
    <RouterLink to="/" class="nav-link" active-class="active">首页</RouterLink>
    <RouterLink to="/list" class="nav-link" active-class="active">集市</RouterLink>
    <RouterLink to="/publish" class="nav-link" active-class="active">发布</RouterLink>
    <RouterLink to="/message" class="nav-link" active-class="active">消息</RouterLink>
    <RouterLink to="/profile" class="nav-link" active-class="active">我的</RouterLink>
    <RouterLink to="/board" class="nav-link" active-class="active">看板</RouterLink>
  </nav>
</template>

<style scoped>
.app-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  font-size: 14px;
  color: #374151;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #4facfe;
}

.nav-link.active {
  background: #eff6ff;
  color: #4facfe;
  font-weight: 600;
}
</style>
