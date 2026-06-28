import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const profile = reactive({
    nickname: '校园小达人',
    studentId: '20240101001',
    college: '计算机学院',
    campus: '紫金港校区',
    credit: 98,
    phone: '',
    bio: '',
  })

  const unreadTotal = ref(3)

  function updateProfile(data: Partial<typeof profile>) {
    Object.assign(profile, data)
  }

  function setUnreadTotal(n: number) {
    unreadTotal.value = n
  }

  return { profile, unreadTotal, updateProfile, setUnreadTotal }
})
