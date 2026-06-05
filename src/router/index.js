import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
  { path: '/reservations', name: 'Reservations', component: () => import('@/views/Reservations.vue') },
  { path: '/spaces', name: 'Spaces', component: () => import('@/views/Spaces.vue') },
  { path: '/users', name: 'Users', component: () => import('@/views/Users.vue') },
  { path: '/reports/students', name: 'ReportStudents', component: () => import('@/views/reports/StudentReport.vue') },
  { path: '/reports/equipment-power', name: 'ReportEquipmentPower', component: () => import('@/views/reports/EquipmentPower.vue') },
  { path: '/settings', name: 'Settings', component: () => import('@/views/Settings.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
