import { defineStore } from 'pinia'

export interface CurrentUser {
  id: number
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
  studentId: string
  phone: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: true,
    unreadTotal: 0,
    currentUser: {
      id: 1,
      name: '校园用户',
      college: '计算机学院',
      grade: '2023 级',
      avatar: '',
      bio: '热爱校园生活，喜欢分享闲置好物。',
      studentId: '2023001',
      phone: '138****0000',
    },
  }),

  getters: {
    displayName: (state) => state.currentUser.name,
    userDescription: (state) => {
      return `${state.currentUser.college} · ${state.currentUser.grade}`
    },
    profile: (state) => ({
      nickname: state.currentUser.name,
      campus: state.currentUser.college,
      college: state.currentUser.college,
      credit: 96,
      studentId: state.currentUser.studentId,
      phone: state.currentUser.phone,
      bio: state.currentUser.bio,
    }),
  },

  actions: {
    updateProfile(payload: Partial<CurrentUser>) {
      this.currentUser = {
        ...this.currentUser,
        ...payload,
      }
    },

    logout() {
      this.isLoggedIn = false
    },

    login() {
      this.isLoggedIn = true
    },

    setUnreadTotal(count: number) {
      this.unreadTotal = count
    },
  },
})
