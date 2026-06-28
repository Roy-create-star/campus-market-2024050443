<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElInput, ElBadge, ElButton,
} from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const mockConversations = [
  { id: 1, name: '小李同学', avatar: '', itemId: 101, itemName: '微积分教材', lastMsg: '好的，那就45元成交吧', lastMsgType: 'price', lastTime: '14:32', unread: 2 },
  { id: 2, name: '张学姐', avatar: '', itemId: 102, itemName: '台灯', lastMsg: '没问题，明天下午3点图书馆见', lastMsgType: 'text', lastTime: '昨天', unread: 0 },
  { id: 3, name: '王学长', avatar: '', itemId: 103, itemName: '机械键盘', lastMsg: '还能便宜一点吗？', lastMsgType: 'text', lastTime: '昨天', unread: 1 },
  { id: 4, name: '大二-陈', avatar: '', itemId: 104, itemName: '英语四级真题', lastMsg: '好的，我已经付款了', lastMsgType: 'text', lastTime: '周三', unread: 0 },
  { id: 5, name: '赵同学', avatar: '', itemId: 105, itemName: '瑜伽垫', lastMsg: '还在吗？', lastMsgType: 'text', lastTime: '周一', unread: 3 },
  { id: 6, name: '刘学姐', avatar: '', itemId: 106, itemName: '画板套装', lastMsg: '30元可以吗？', lastMsgType: 'price', lastTime: '2025-06-20', unread: 0 },
]

const mockItems: Record<number, { id: number; name: string; price: number; status: string }> = {
  101: { id: 101, name: '微积分教材', price: 45, status: '在售' },
  102: { id: 102, name: '台灯', price: 20, status: '已售' },
  103: { id: 103, name: '机械键盘', price: 120, status: '在售' },
  104: { id: 104, name: '英语四级真题', price: 25, status: '在售' },
  105: { id: 105, name: '瑜伽垫', price: 35, status: '在售' },
  106: { id: 106, name: '画板套装', price: 50, status: '在售' },
}

interface Message {
  type: string
  text: string
  isMine: boolean
  time: string
  amount?: number
  showActions?: boolean
  showDate?: boolean
  dateLabel?: string
}

const mockMessages: Record<number, Message[]> = {
  1: [
    { type: 'text', text: '你好，请问微积分教材还在吗？', isMine: false, time: '13:45' },
    { type: 'text', text: '在的，昨天刚整理的，基本全新', isMine: true, time: '13:46' },
    { type: 'text', text: '太好了，价格可以便宜一点吗？', isMine: false, time: '13:48' },
    { type: 'price', text: '最低50元可以吗？', amount: 50, isMine: true, time: '13:50', showActions: false },
    { type: 'price', text: '45元行不行？我下午就能来拿', amount: 45, isMine: false, time: '14:02', showActions: true },
    { type: 'text', text: '好吧，那就45元，下午3点图书馆见', isMine: true, time: '14:30' },
    { type: 'text', text: '好的，那就45元成交吧', isMine: false, time: '14:32' },
  ],
  3: [
    { type: 'text', text: '你好，机械键盘还在吗？', isMine: false, time: '15:20' },
    { type: 'text', text: '在的，用了两个月', isMine: true, time: '15:21' },
    { type: 'text', text: '还能便宜一点吗？', isMine: false, time: '15:25' },
  ],
}

const searchQuery = ref('')
const conversations = ref(mockConversations)
const activeConversation = ref<(typeof mockConversations)[number] | null>(null)
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) return conversations.value
  const q = searchQuery.value.trim().toLowerCase()
  return conversations.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.itemName.toLowerCase().includes(q) ||
    c.lastMsg.toLowerCase().includes(q)
  )
})

const currentItem = computed(() => {
  if (!activeConversation.value) return { name: '', price: 0, status: '' }
  return mockItems[activeConversation.value.itemId] || { name: '未知商品', price: 0, status: '未知' }
})

const currentMessages = computed(() => {
  if (!activeConversation.value) return []
  return mockMessages[activeConversation.value.id] || []
})

function goBack() {
  router.back()
}

function syncUnread() {
  const total = conversations.value.reduce((s, c) => s + c.unread, 0)
  userStore.setUnreadTotal(total)
}

function selectConversation(conv: (typeof mockConversations)[number]) {
  activeConversation.value = conv
  conv.unread = 0
  syncUnread()
  nextTick(() => { scrollToBottom() })
}

function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || !activeConversation.value) return
  const convId = activeConversation.value.id
  if (!mockMessages[convId]) {
    mockMessages[convId] = []
  }
  mockMessages[convId].push({
    type: 'text',
    text,
    isMine: true,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  })
  newMessage.value = ''
  activeConversation.value.lastMsg = text
  activeConversation.value.lastMsgType = 'text'
  activeConversation.value.lastTime = '刚刚'
  nextTick(() => { scrollToBottom() })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<template>
  <div class="message-page">
    <div class="left-panel">
      <div class="panel-header">
        <div class="panel-header-top">
          <span class="back-btn" @click="goBack">← 返回</span>
          <h2>消息中心</h2>
        </div>
        <div class="subtitle">共 {{ conversations.length }} 个会话</div>
      </div>
      <div class="search-box">
        <ElInput v-model="searchQuery" placeholder="搜索消息或用户" :prefix-icon="Search" clearable size="default" />
      </div>
      <div class="conversation-list">
        <div
          v-for="conv in filteredConversations"
          :key="conv.id"
          class="conversation-item"
          :class="{ active: activeConversation && activeConversation.id === conv.id }"
          @click="selectConversation(conv)"
        >
          <div class="avatar-wrap">
            <img
              :src="`https://picsum.photos/seed/${conv.name}/48/48`"
              :alt="conv.name"
              style="object-fit: cover; width: 48px; height: 48px; border-radius: 50%;"
            />
          </div>
          <div class="info">
            <div class="top">
              <span class="name">{{ conv.name }}</span>
              <div class="top-right">
                <span class="time">{{ conv.lastTime }}</span>
                <span v-if="conv.unread > 0" class="unread-badge">{{ conv.unread > 99 ? '99+' : conv.unread }}</span>
              </div>
            </div>
            <div class="last-msg">
              <span v-if="conv.lastMsgType === 'price'" class="price-highlight">{{ conv.lastMsg }}</span>
              <span v-else>{{ conv.lastMsg }}</span>
            </div>
          </div>
        </div>
        <div v-if="filteredConversations.length === 0" class="empty-conv">
          <div class="empty-icon">💬</div>
          <p>暂无会话</p>
        </div>
      </div>
    </div>

    <div class="right-panel">
      <template v-if="!activeConversation">
        <div class="empty-state">
          <div class="empty-icon">💬</div>
          <p>从左侧列表选择消息开始聊天</p>
        </div>
      </template>

      <template v-else>
        <div class="item-info-card">
          <div class="item-thumb">
            <img
              :src="`https://picsum.photos/seed/${activeConversation.itemName}/56/56`"
              :alt="currentItem.name"
              style="object-fit: cover; width: 56px; height: 56px; border-radius: 8px;"
            />
          </div>
          <div class="item-detail">
            <div class="title">{{ currentItem.name }}</div>
            <div class="price">¥{{ currentItem.price }}</div>
            <div class="status">{{ currentItem.status }}</div>
          </div>
          <div class="action-btn">
            <ElButton size="small" round>查看商品</ElButton>
          </div>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div v-for="(msg, idx) in currentMessages" :key="idx">
            <div class="msg-row" :class="msg.isMine ? 'my' : 'their'">
              <div class="msg-avatar">
                <img
                  v-if="!msg.isMine"
                  :src="`https://picsum.photos/seed/${activeConversation.name}/36/36`"
                  :alt="activeConversation.name"
                  style="object-fit: cover; width: 36px; height: 36px; border-radius: 50%;"
                />
                <img
                  v-else
                  src="https://picsum.photos/seed/me/36/36"
                  alt="我"
                  style="object-fit: cover; width: 36px; height: 36px; border-radius: 50%;"
                />
              </div>
              <div v-if="msg.type === 'price'" class="bubble price-offer">
                <div class="offer-label">报价</div>
                <div class="offer-amount">¥{{ msg.amount }}</div>
                <div style="font-size:13px;color:#666;">{{ msg.text }}</div>
                <div class="offer-actions" v-if="msg.showActions">
                  <ElButton size="small" round style="background:#FFE8D6;border-color:#FFE8D6;color:#333;">接受</ElButton>
                  <ElButton size="small" round plain>拒绝</ElButton>
                  <ElButton size="small" round plain>还价</ElButton>
                </div>
                <span class="msg-time">{{ msg.time }}</span>
              </div>
              <div v-else class="bubble">
                {{ msg.text }}
                <span class="msg-time">{{ msg.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <ElInput
            v-model="newMessage"
            placeholder="输入消息..."
            size="default"
            clearable
            @keyup.enter="sendMessage"
            style="flex:1;"
          />
          <button class="send-btn" @click="sendMessage">发送</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.message-page {
  height: calc(100vh - 112px);
  display: flex;
}

.left-panel {
  width: 380px;
  min-width: 380px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.panel-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.panel-header-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.panel-header-top h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.panel-header .subtitle {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.search-box {
  padding: 12px 24px;
}

.search-box :deep(.el-input__wrapper) {
  background: #f5f5f5;
  border-radius: 20px;
  box-shadow: none !important;
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-list::-webkit-scrollbar {
  width: 4px;
}

.conversation-list::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 2px;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f8f8f8;
}

.conversation-item:hover {
  background: #fafafa;
}

.conversation-item.active {
  background: #FFE8D6;
}

.conversation-item .avatar-wrap {
  margin-right: 12px;
  flex-shrink: 0;
  line-height: 0;
}

.conversation-item .info {
  flex: 1;
  min-width: 0;
}

.conversation-item .info .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conversation-item .info .top .name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.conversation-item .info .top .top-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.conversation-item .info .top .time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.unread-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #E74C3C;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.conversation-item .info .last-msg {
  font-size: 13px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-item .info .last-msg .price-highlight {
  color: #E74C3C;
  font-weight: 500;
}

.empty-conv {
  text-align: center;
  padding: 48px 24px;
  color: #bbb;
}

.empty-conv .empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin: 0 auto 12px;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #FFF9F3;
  min-width: 0;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bbb;
}

.empty-state .empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFE8D6, #f5d5b8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 16px;
  font-weight: 500;
  color: #999;
  margin-top: 12px;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 13px;
  color: #bbb;
}

.item-info-card {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  gap: 14px;
  flex-shrink: 0;
}

.item-info-card .item-thumb {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  flex-shrink: 0;
  overflow: hidden;
  line-height: 0;
}

.item-info-card .item-detail {
  flex: 1;
  min-width: 0;
}

.item-info-card .item-detail .title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.item-info-card .item-detail .price {
  font-size: 16px;
  font-weight: 600;
  color: #E74C3C;
  margin-top: 2px;
}

.item-info-card .item-detail .status {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.item-info-card .action-btn {
  flex-shrink: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 2px;
}

.msg-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 70%;
}

.msg-row.my {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-row.their {
  align-self: flex-start;
}

.msg-row .msg-avatar {
  flex-shrink: 0;
  margin-top: 4px;
  line-height: 0;
}

.msg-row .bubble {
  padding: 10px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  position: relative;
}

.msg-row.my .bubble {
  background: #FFE8D6;
  color: #333;
  border-bottom-right-radius: 4px;
}

.msg-row.their .bubble {
  background: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}

.msg-row .bubble.price-offer {
  background: #fff !important;
  border: 1.5px solid #FFE8D6;
  padding: 12px 16px;
}

.msg-row .bubble.price-offer .offer-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.msg-row .bubble.price-offer .offer-amount {
  font-size: 20px;
  font-weight: 700;
  color: #E74C3C;
  margin-bottom: 6px;
}

.msg-row .bubble.price-offer .offer-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.msg-row .bubble .msg-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  display: block;
}

.msg-row.my .bubble .msg-time {
  text-align: right;
}

.chat-divider {
  text-align: center;
  font-size: 12px;
  color: #bbb;
  padding: 8px 0;
  position: relative;
}

.chat-divider::before,
.chat-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #eee;
}

.chat-divider::before {
  left: 0;
}

.chat-divider::after {
  right: 0;
}

.chat-input {
  padding: 14px 24px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.chat-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  background: #f5f5f5;
  box-shadow: none !important;
}

.chat-input .send-btn {
  background: #FFE8D6;
  border: none;
  color: #333;
  border-radius: 20px;
  padding: 8px 22px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  font-weight: 500;
}

.chat-input .send-btn:hover {
  background: #f5d5b8;
}

.back-btn {
  cursor: pointer;
  font-size: 14px;
  color: #666;
  padding: 4px 10px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  user-select: none;
  flex-shrink: 0;
}

.back-btn:hover {
  background: #FFE8D6;
  color: #333;
}
</style>
