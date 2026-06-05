<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label"
        class="bg-white rounded-xl p-5 border border-slate-200">
        <div class="flex items-start justify-between mb-4">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center" :class="stat.iconBg">
            <component :is="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
          </div>
          <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="stat.changeBg">
            {{ stat.change }}
          </span>
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ stat.value }}</p>
        <p class="text-xs text-slate-400 mt-0.5">{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Recent Reservations -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 class="text-sm font-semibold text-slate-800">近期預約</h3>
          <RouterLink to="/reservations" class="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            查看全部
          </RouterLink>
        </div>
        <div class="divide-y divide-slate-50">
          <div v-for="res in recentReservations" :key="res.id"
            class="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition">
            <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <span class="text-xs font-semibold text-indigo-600">{{ res.name[0] }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-800 truncate">{{ res.name }}</p>
              <p class="text-xs text-slate-400">{{ res.space }} · {{ res.time }}</p>
            </div>
            <div class="text-right shrink-0">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="statusClass(res.status)">
                {{ res.status }}
              </span>
              <p class="text-xs text-slate-400 mt-0.5">{{ res.date }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Space Usage -->
      <div class="bg-white rounded-xl border border-slate-200">
        <div class="px-5 py-4 border-b border-slate-100">
          <h3 class="text-sm font-semibold text-slate-800">設備使用率</h3>
          <p class="text-xs text-slate-400 mt-0.5">本週統計</p>
        </div>
        <div class="px-5 py-4 space-y-4">
          <div v-for="space in spaceUsage" :key="space.name">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-medium text-slate-700">{{ space.name }}</span>
              <span class="text-xs font-semibold text-slate-800">{{ space.pct }}%</span>
            </div>
            <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700"
                :class="space.pct > 80 ? 'bg-red-400' : space.pct > 60 ? 'bg-amber-400' : 'bg-indigo-400'"
                :style="{ width: space.pct + '%' }">
              </div>
            </div>
          </div>
        </div>

        <!-- Today's schedule -->
        <div class="px-5 pb-5">
          <p class="text-xs font-medium text-slate-500 mb-3">今日時程</p>
          <div class="space-y-2">
            <div v-for="slot in todaySchedule" :key="slot.time"
              class="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50">
              <div class="w-1 h-8 rounded-full shrink-0" :class="slot.color"></div>
              <div>
                <p class="text-xs font-medium text-slate-700">{{ slot.space }}</p>
                <p class="text-xs text-slate-400">{{ slot.time }} · {{ slot.user }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { h } from 'vue'

const icon = (d) => () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d })
])

const stats = [
  {
    label: '本月總預約', value: '148',
    change: '+12%', changeBg: 'bg-green-50 text-green-600',
    icon: icon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'),
    iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600',
  },
  {
    label: '待審核', value: '12',
    change: '需處理', changeBg: 'bg-amber-50 text-amber-600',
    icon: icon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'),
    iconBg: 'bg-amber-50', iconColor: 'text-amber-600',
  },
  {
    label: '今日預約', value: '7',
    change: '進行中', changeBg: 'bg-blue-50 text-blue-600',
    icon: icon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'),
    iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
  },
  {
    label: '可用設備', value: '5',
    change: '共 8 台', changeBg: 'bg-slate-100 text-slate-500',
    icon: icon('M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'),
    iconBg: 'bg-green-50', iconColor: 'text-green-600',
  },
]

const recentReservations = [
  { id: 1, name: '陳宥廷', space: '掃描式電子顯微鏡', time: '10:00–12:00', date: '今天', status: '已核准' },
  { id: 2, name: '林佳穎', space: '高效能工作站 #1', time: '13:00–15:00', date: '今天', status: '待審核' },
  { id: 3, name: '王柏文', space: '原子力顯微鏡', time: '09:00–11:00', date: '明天', status: '待審核' },
  { id: 4, name: '張雅婷', space: '3D 列印機', time: '15:00–17:00', date: '明天', status: '已核准' },
  { id: 5, name: '劉承恩', space: '紅外線光譜儀', time: '10:00–12:00', date: '05/23', status: '已拒絕' },
]

const spaceUsage = [
  { name: '高效能工作站 #1', pct: 90 },
  { name: '掃描式電子顯微鏡', pct: 78 },
  { name: '高效能工作站 #2', pct: 85 },
  { name: '3D 列印機', pct: 67 },
  { name: '原子力顯微鏡', pct: 55 },
]

const todaySchedule = [
  { time: '10:00–12:00', space: '掃描式電子顯微鏡', user: '陳宥廷', color: 'bg-indigo-400' },
  { time: '13:00–15:00', space: '高效能工作站 #1', user: '林佳穎', color: 'bg-amber-400' },
  { time: '15:00–17:00', space: '3D 列印機', user: '張雅婷', color: 'bg-green-400' },
]

const statusClass = (s) => ({
  '已核准': 'bg-green-50 text-green-700',
  '待審核': 'bg-amber-50 text-amber-700',
  '已拒絕': 'bg-red-50 text-red-600',
}[s] || 'bg-slate-100 text-slate-500')


</script>
