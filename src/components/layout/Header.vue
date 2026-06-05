<template>
  <header class="h-14 bg-white border-b border-slate-200 flex items-center px-6">
    <div>
      <h1 class="text-base font-semibold text-slate-800">{{ pageTitle }}</h1>
      <p class="text-xs text-slate-400">{{ today }}</p>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const titleMap = {
  '/dashboard': '儀表板',
  '/reservations': '預約管理',
  '/spaces': '設備管理',
  '/users': '用戶管理',
  '/reports/students': '學生預約報表',
  '/reports/equipment-power': '設備使用電量',
  '/settings': '系統設定',
}
const pageTitle = computed(() => titleMap[route.path] || '儀表板')

const today = computed(() => {
  return new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
})
</script>
