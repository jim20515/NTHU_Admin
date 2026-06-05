<template>
  <div class="space-y-4">
    <!-- Filter Bar -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-end">
      <div class="flex-1 min-w-48">
        <label class="block text-xs font-medium text-slate-500 mb-1.5">設備名稱</label>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="filterName" type="text" placeholder="搜尋設備名稱..."
            class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1.5">開始日期</label>
        <input v-model="filterDateFrom" type="date"
          class="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1.5">結束日期</label>
        <input v-model="filterDateTo" type="date"
          class="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <button @click="resetFilters"
        class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
        清除篩選
      </button>
      <span class="text-xs text-slate-400 self-center ml-auto">共 {{ filtered.length }} 台設備</span>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 text-xs font-medium text-slate-500">
            <th class="text-left px-5 py-3">設備</th>
            <th class="text-left px-4 py-3">用電功率</th>
            <th class="text-right px-4 py-3">使用次數</th>
            <th class="text-right px-4 py-3">總使用時數</th>
            <th class="text-right px-4 py-3">總用電量</th>
            <th class="text-right px-5 py-3">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="eq in filtered" :key="eq.code" class="hover:bg-slate-50/50 transition">
            <td class="px-5 py-3.5">
              <p class="font-medium text-slate-800">{{ eq.name }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ eq.code }}</p>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md font-medium">
                {{ eq.powerKw }} kW
              </span>
            </td>
            <td class="px-4 py-3.5 text-right font-medium text-slate-700">{{ eq.usageCount }} 次</td>
            <td class="px-4 py-3.5 text-right font-medium text-slate-700">{{ eq.totalHours }} 小時</td>
            <td class="px-4 py-3.5 text-right">
              <div class="flex items-center justify-end gap-2">
                <div class="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-amber-400 transition-all duration-700"
                    :style="{ width: Math.min(eq.totalKwh / maxKwh * 100, 100) + '%' }"></div>
                </div>
                <span class="font-semibold text-slate-800 w-16 text-right">{{ eq.totalKwh.toFixed(1) }} kWh</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-right">
              <button @click="openDetail(eq)"
                class="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                查看詳細
              </button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="6" class="text-center py-12 text-slate-400 text-sm">沒有符合條件的設備資料</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Drawer -->
    <Transition name="slide">
      <div v-if="selected" class="fixed inset-0 z-40 flex">
        <div class="flex-1 bg-black/30" @click="selected = null"></div>
        <div class="w-[480px] bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
          <div class="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
            <div>
              <h3 class="text-base font-semibold text-slate-800">{{ selected.name }}</h3>
              <p class="text-xs text-slate-400 mt-0.5">用電明細 · {{ selected.code }}</p>
            </div>
            <button @click="selected = null" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-3 gap-3 p-6 border-b border-slate-100">
            <div class="bg-slate-50 rounded-xl p-4 text-center">
              <p class="text-xs text-slate-400 mb-1">用電功率</p>
              <p class="text-base font-bold text-amber-600">{{ selected.powerKw }} kW</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-4 text-center">
              <p class="text-xs text-slate-400 mb-1">總使用時數</p>
              <p class="text-base font-bold text-slate-800">{{ selected.totalHours }} 時</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-4 text-center">
              <p class="text-xs text-slate-400 mb-1">總用電量</p>
              <p class="text-base font-bold text-indigo-600">{{ selected.totalKwh.toFixed(1) }} kWh</p>
            </div>
          </div>

          <!-- Usage Records -->
          <div class="flex-1 p-6">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">租借明細</p>
            <div class="space-y-2">
              <div v-for="r in selectedRecords" :key="r.date + r.user"
                class="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  <span class="text-xs font-semibold text-indigo-600">{{ r.user[0] }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-800">{{ r.user }}</p>
                  <p class="text-xs text-slate-400">{{ r.date }} · {{ r.hours }} 小時</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-sm font-semibold text-amber-600">{{ (r.hours * selected.powerKw).toFixed(1) }} kWh</p>
                  <span class="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    :class="r.status === '已核准' ? 'bg-green-50 text-green-700' : r.status === '已拒絕' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'">
                    {{ r.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterName = ref('')
const filterDateFrom = ref('')
const filterDateTo = ref('')
const selected = ref(null)

const usageRecords = [
  // 掃描式電子顯微鏡
  { equipment: '掃描式電子顯微鏡', user: '陳宥廷', date: '2026-04-03', hours: 2, status: '已核准' },
  { equipment: '掃描式電子顯微鏡', user: '李芯儀', date: '2026-04-11', hours: 1, status: '已核准' },
  { equipment: '掃描式電子顯微鏡', user: '王柏文', date: '2026-04-22', hours: 2, status: '已拒絕' },
  { equipment: '掃描式電子顯微鏡', user: '張雅婷', date: '2026-05-07', hours: 1.5, status: '已核准' },
  { equipment: '掃描式電子顯微鏡', user: '陳宥廷', date: '2026-05-10', hours: 2, status: '已核准' },
  { equipment: '掃描式電子顯微鏡', user: '林佳穎', date: '2026-05-16', hours: 1, status: '待審核' },
  { equipment: '掃描式電子顯微鏡', user: '張雅婷', date: '2026-05-20', hours: 1, status: '已核准' },
  // 原子力顯微鏡
  { equipment: '原子力顯微鏡', user: '黃子翔', date: '2026-04-05', hours: 2, status: '已核准' },
  { equipment: '原子力顯微鏡', user: '王柏文', date: '2026-04-18', hours: 2, status: '已核准' },
  { equipment: '原子力顯微鏡', user: '劉承恩', date: '2026-04-29', hours: 1.5, status: '已核准' },
  { equipment: '原子力顯微鏡', user: '林佳穎', date: '2026-05-06', hours: 2, status: '已核准' },
  { equipment: '原子力顯微鏡', user: '王柏文', date: '2026-05-08', hours: 2, status: '已核准' },
  { equipment: '原子力顯微鏡', user: '李芯儀', date: '2026-05-18', hours: 1, status: '待審核' },
  // 紅外線光譜儀
  { equipment: '紅外線光譜儀', user: '劉承恩', date: '2026-04-08', hours: 2, status: '已核准' },
  { equipment: '紅外線光譜儀', user: '吳冠廷', date: '2026-04-15', hours: 1.5, status: '已核准' },
  { equipment: '紅外線光譜儀', user: '陳宥廷', date: '2026-04-27', hours: 2, status: '已拒絕' },
  { equipment: '紅外線光譜儀', user: '劉承恩', date: '2026-05-23', hours: 2, status: '已拒絕' },
  // 高效能工作站 #1
  { equipment: '高效能工作站 #1', user: '黃子翔', date: '2026-04-02', hours: 4, status: '已核准' },
  { equipment: '高效能工作站 #1', user: '林佳穎', date: '2026-04-09', hours: 2, status: '已核准' },
  { equipment: '高效能工作站 #1', user: '吳冠廷', date: '2026-04-17', hours: 3, status: '已核准' },
  { equipment: '高效能工作站 #1', user: '陳宥廷', date: '2026-04-24', hours: 4, status: '已核准' },
  { equipment: '高效能工作站 #1', user: '林佳穎', date: '2026-05-12', hours: 1.5, status: '已核准' },
  { equipment: '高效能工作站 #1', user: '陳宥廷', date: '2026-05-15', hours: 3, status: '已核准' },
  { equipment: '高效能工作站 #1', user: '黃子翔', date: '2026-05-19', hours: 4, status: '待審核' },
  // 高效能工作站 #2
  { equipment: '高效能工作站 #2', user: '張雅婷', date: '2026-04-06', hours: 3, status: '已核准' },
  { equipment: '高效能工作站 #2', user: '黃子翔', date: '2026-04-14', hours: 4, status: '已核准' },
  { equipment: '高效能工作站 #2', user: '林佳穎', date: '2026-04-21', hours: 2, status: '已核准' },
  { equipment: '高效能工作站 #2', user: '吳冠廷', date: '2026-05-05', hours: 4, status: '已核准' },
  { equipment: '高效能工作站 #2', user: '吳冠廷', date: '2026-05-19', hours: 4, status: '已核准' },
  { equipment: '高效能工作站 #2', user: '黃子翔', date: '2026-05-21', hours: 4, status: '已核准' },
  // 視訊會議系統
  { equipment: '視訊會議系統', user: '王柏文', date: '2026-04-10', hours: 1, status: '已核准' },
  { equipment: '視訊會議系統', user: '吳冠廷', date: '2026-04-20', hours: 2, status: '已核准' },
  { equipment: '視訊會議系統', user: '張雅婷', date: '2026-04-28', hours: 1, status: '已核准' },
  { equipment: '視訊會議系統', user: '吳冠廷', date: '2026-05-17', hours: 2, status: '已核准' },
  { equipment: '視訊會議系統', user: '陳宥廷', date: '2026-05-21', hours: 1, status: '待審核' },
  // X 光繞射儀
  { equipment: 'X 光繞射儀', user: '王柏文', date: '2026-04-07', hours: 2, status: '已核准' },
  { equipment: 'X 光繞射儀', user: '李芯儀', date: '2026-04-16', hours: 1.5, status: '已核准' },
  { equipment: 'X 光繞射儀', user: '劉承恩', date: '2026-04-25', hours: 2, status: '已拒絕' },
  { equipment: 'X 光繞射儀', user: '王柏文', date: '2026-05-13', hours: 2, status: '已核准' },
  { equipment: 'X 光繞射儀', user: '李芯儀', date: '2026-05-22', hours: 2, status: '已核准' },
  // 3D 列印機
  { equipment: '3D 列印機', user: '林佳穎', date: '2026-04-04', hours: 2, status: '已核准' },
  { equipment: '3D 列印機', user: '張雅婷', date: '2026-04-13', hours: 3, status: '已核准' },
  { equipment: '3D 列印機', user: '陳宥廷', date: '2026-04-23', hours: 2, status: '已核准' },
  { equipment: '3D 列印機', user: '劉承恩', date: '2026-05-03', hours: 1.5, status: '已核准' },
  { equipment: '3D 列印機', user: '張雅婷', date: '2026-05-14', hours: 2, status: '已核准' },
  { equipment: '3D 列印機', user: '林佳穎', date: '2026-05-20', hours: 2, status: '待審核' },
]

const equipmentList = [
  { name: '掃描式電子顯微鏡', code: 'EQ-001', powerKw: 5.0 },
  { name: '原子力顯微鏡',     code: 'EQ-002', powerKw: 3.0 },
  { name: '紅外線光譜儀',     code: 'EQ-003', powerKw: 2.0 },
  { name: '高效能工作站 #1',  code: 'EQ-004', powerKw: 1.5 },
  { name: '高效能工作站 #2',  code: 'EQ-005', powerKw: 1.5 },
  { name: '視訊會議系統',     code: 'EQ-006', powerKw: 0.5 },
  { name: 'X 光繞射儀',      code: 'EQ-007', powerKw: 8.0 },
  { name: '3D 列印機',       code: 'EQ-008', powerKw: 1.0 },
]

const aggregated = computed(() => equipmentList.map(eq => {
  const records = usageRecords.filter(r => {
    if (r.equipment !== eq.name) return false
    if (filterDateFrom.value && r.date < filterDateFrom.value) return false
    if (filterDateTo.value && r.date > filterDateTo.value) return false
    return true
  })
  const approvedRecords = records.filter(r => r.status === '已核准')
  const totalHours = approvedRecords.reduce((sum, r) => sum + r.hours, 0)
  return {
    ...eq,
    usageCount: approvedRecords.length,
    totalHours,
    totalKwh: totalHours * eq.powerKw,
  }
}))

const filtered = computed(() =>
  aggregated.value.filter(eq =>
    !filterName.value || eq.name.includes(filterName.value)
  )
)

const maxKwh = computed(() => Math.max(...aggregated.value.map(e => e.totalKwh), 1))

const selectedRecords = computed(() => {
  if (!selected.value) return []
  return usageRecords.filter(r => {
    if (r.equipment !== selected.value.name) return false
    if (filterDateFrom.value && r.date < filterDateFrom.value) return false
    if (filterDateTo.value && r.date > filterDateTo.value) return false
    return true
  })
})

function openDetail(eq) { selected.value = eq }

function resetFilters() {
  filterName.value = ''
  filterDateFrom.value = ''
  filterDateTo.value = ''
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
