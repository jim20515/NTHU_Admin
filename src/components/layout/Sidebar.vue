<template>
  <aside class="fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200 flex flex-col z-20">
    <!-- Logo -->
    <div class="px-6 py-5 border-b border-slate-200">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-800">清大預約系統</p>
          <p class="text-xs text-slate-400">NTHU Booking</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <p class="px-3 mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">主選單</p>
      <ul class="space-y-0.5">
        <template v-for="item in navItems" :key="item.name">
          <!-- 有子選單的項目 -->
          <li v-if="item.children">
            <button
              @click="toggleGroup(item.name)"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="isGroupActive(item.children)
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'"
            >
              <component :is="item.icon" class="w-5 h-5 shrink-0" />
              {{ item.label }}
              <svg class="w-4 h-4 ml-auto transition-transform duration-200 shrink-0"
                :class="openGroups[item.name] ? 'rotate-90' : ''"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <ul v-if="openGroups[item.name]" class="mt-0.5 ml-4 space-y-0.5 border-l border-slate-200 pl-3">
              <li v-for="child in item.children" :key="child.path">
                <RouterLink
                  :to="child.path"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="isActive(child.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'"
                >
                  <div class="w-1.5 h-1.5 rounded-full shrink-0"
                    :class="isActive(child.path) ? 'bg-indigo-500' : 'bg-slate-300'"></div>
                  {{ child.label }}
                </RouterLink>
              </li>
            </ul>
          </li>
          <!-- 一般項目 -->
          <li v-else>
            <RouterLink
              :to="item.path"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="isActive(item.path)
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'"
            >
              <component :is="item.icon" class="w-5 h-5 shrink-0" />
              {{ item.label }}
            </RouterLink>
          </li>
        </template>
      </ul>
    </nav>

    <!-- Bottom user info -->
    <div class="px-4 py-4 border-t border-slate-200">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
          <span class="text-xs font-semibold text-indigo-600">管</span>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium text-slate-800 truncate">管理員</p>
          <p class="text-xs text-slate-400 truncate">admin@nthu.edu.tw</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { h, reactive } from 'vue'

const route = useRoute()
const isActive = (path) => route.path === path
const isGroupActive = (children) => children.some(c => route.path === c.path)

const openGroups = reactive({ reports: false })
function toggleGroup(name) { openGroups[name] = !openGroups[name] }

const IconDashboard = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })
])
const IconCalendar = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
])
const IconBuilding = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
])
const IconUsers = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
])
const IconSettings = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
])

const IconChart = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])

const navItems = [
  { name: 'dashboard', path: '/dashboard', label: '儀表板', icon: IconDashboard },
  { name: 'reservations', path: '/reservations', label: '預約管理', icon: IconCalendar },
  { name: 'spaces', path: '/spaces', label: '設備管理', icon: IconBuilding },
  { name: 'users', path: '/users', label: '用戶管理', icon: IconUsers },
  {
    name: 'reports', label: '報表管理', icon: IconChart,
    children: [
      { path: '/reports/students', label: '學生預約報表' },
      { path: '/reports/equipment-power', label: '設備使用電量' },
    ],
  },
  { name: 'settings', path: '/settings', label: '系統設定', icon: IconSettings },
]
</script>
