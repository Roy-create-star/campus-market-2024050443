import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/list',
      name: 'List',
      component: () => import('../views/ListView.vue'),
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: () => import('../views/DetailView.vue'),
    },
    {
      path: '/publish',
      name: 'Publish',
      component: () => import('../views/PublishView.vue'),
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('../views/MessageView.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/profile/edit',
      name: 'EditProfile',
      component: () => import('../views/EditProfileView.vue'),
    },
    {
      path: '/profile/posts',
      redirect: '/profile?tab=publish',
    },
    {
      path: '/profile/favorites',
      redirect: '/profile?tab=favorite',
    },
    {
      path: '/settings',
      name: 'Settings',
      redirect: '/profile',
    },
    {
      path: '/board',
      name: 'Board',
      component: () => import('../views/BoardView.vue'),
    },
    {
      path: '/identity',
      name: 'Identity',
      component: () => import('../views/IdentityView.vue'),
    },
    {
      path: '/admin-review',
      name: 'AdminReview',
      component: () => import('../views/AdminReviewView.vue'),
    },
  ],
})

export default router