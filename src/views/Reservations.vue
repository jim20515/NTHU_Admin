<template>
  <div class="space-y-4">
    <!-- Filters Bar -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
      <div class="relative flex-1 min-w-48">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" type="text" placeholder="搜尋申請人或設備..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
      </div>

      <select v-model="filterStatus"
        class="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">全部狀態</option>
        <option value="已核准">已核准</option>
        <option value="待審核">待審核</option>
        <option value="已拒絕">已拒絕</option>
      </select>

      <select v-model="filterSpace"
        class="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">全部設備</option>
        <option>掃描式電子顯微鏡</option>
        <option>原子力顯微鏡</option>
        <option>紅外線光譜儀</option>
        <option>高效能工作站 #1</option>
        <option>高效能工作站 #2</option>
        <option>視訊會議系統</option>
        <option>X 光繞射儀</option>
        <option>3D 列印機</option>
      </select>

      <input v-model="filterDate" type="date"
        class="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />

      <span class="ml-auto text-xs text-slate-400">共 {{ filtered.length }} 筆</span>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <!-- Tab bar -->
      <div class="flex border-b border-slate-200">
        <button v-for="tab in tabs" :key="tab.key"
          @click="activeTab = tab.key"
          class="px-5 py-3 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === tab.key
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-700'">
          {{ tab.label }}
          <span class="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
            :class="activeTab === tab.key ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'">
            {{ countByStatus(tab.key) }}
          </span>
        </button>
      </div>

      <!-- Table Head -->
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 text-xs font-medium text-slate-500">
            <th class="text-left px-5 py-3">申請人</th>
            <th class="text-left px-4 py-3">學生證號</th>
            <th class="text-left px-4 py-3">設備</th>
            <th class="text-left px-4 py-3">日期</th>
            <th class="text-left px-4 py-3">時段</th>
            <th class="text-left px-4 py-3">用途</th>
            <th class="text-left px-4 py-3">狀態</th>
            <th class="text-right px-5 py-3">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="res in tabFiltered" :key="res.id" class="hover:bg-slate-50/50 transition">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  <span class="text-xs font-semibold text-indigo-600">{{ res.name[0] }}</span>
                </div>
                <div>
                  <p class="font-medium text-slate-800">{{ res.name }}</p>
                  <p class="text-xs text-slate-400">{{ res.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5 text-slate-500 font-mono text-xs">{{ res.studentId || '—' }}</td>
            <td class="px-4 py-3.5 text-slate-600">{{ res.space }}</td>
            <td class="px-4 py-3.5 text-slate-600">{{ res.date }}</td>
            <td class="px-4 py-3.5 text-slate-600">{{ res.time }}</td>
            <td class="px-4 py-3.5 text-slate-400 max-w-32 truncate">{{ res.purpose }}</td>
            <td class="px-4 py-3.5">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="statusClass(res.status)">
                {{ res.status }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1">
                <button v-if="res.status === '待審核'"
                  @click="updateStatus(res.id, '已核准')"
                  class="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition">
                  核准
                </button>
                <button v-if="res.status === '待審核'"
                  @click="openReject(res)"
                  class="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
                  拒絕
                </button>
                <button @click="viewDetail(res)"
                  class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="tabFiltered.length === 0">
            <td colspan="8" class="text-center py-12 text-slate-400 text-sm">
              沒有符合條件的預約紀錄
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Drawer -->
    <Transition name="slide">
      <div v-if="selected" class="fixed inset-0 z-40 flex">
        <div class="flex-1 bg-black/30" @click="selected = null"></div>
        <div class="w-96 bg-white h-full overflow-y-auto shadow-2xl">
          <div class="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
            <h3 class="text-base font-semibold text-slate-800">預約詳情</h3>
            <button @click="selected = null" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-5">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <span class="text-lg font-bold text-indigo-600">{{ selected.name[0] }}</span>
              </div>
              <div>
                <p class="font-semibold text-slate-800">{{ selected.name }}</p>
                <p class="text-sm text-slate-400">{{ selected.email }}</p>
                <p class="text-xs font-mono text-slate-400 mt-0.5">{{ selected.studentId || '—' }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-slate-50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1">預約設備</p>
                <p class="text-sm font-semibold text-slate-800">{{ selected.space }}</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1">日期</p>
                <p class="text-sm font-semibold text-slate-800">{{ selected.date }}</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1">時段</p>
                <p class="text-sm font-semibold text-slate-800">{{ selected.time }}</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1">狀態</p>
                <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="statusClass(selected.status)">
                  {{ selected.status }}
                </span>
              </div>
            </div>
            <div>
              <p class="text-xs text-slate-400 mb-2">用途說明</p>
              <p class="text-sm text-slate-700 bg-slate-50 rounded-xl p-4 leading-relaxed">
                {{ selected.purpose || '未填寫' }}
              </p>
            </div>
            <div v-if="selected.status === '已拒絕'" class="pt-2">
              <p class="text-xs text-slate-400 mb-2">拒絕原因</p>
              <p class="text-sm leading-relaxed rounded-xl p-4"
                :class="selected.rejectReason ? 'text-red-600 bg-red-50' : 'text-slate-400 bg-slate-50'">
                {{ selected.rejectReason || '未填寫' }}
              </p>
            </div>
            <div v-if="selected.status === '待審核'" class="flex gap-3 pt-2">
              <button @click="openReject(selected); selected = null"
                class="flex-1 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition">
                拒絕申請
              </button>
              <button @click="updateStatus(selected.id, '已核准'); selected = null"
                class="flex-1 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition">
                核准申請
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Reject Reason Modal -->
    <Transition name="fade">
      <div v-if="rejectTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40" @click="rejectTarget = null"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-base font-semibold text-slate-800">填寫拒絕原因</h3>
            <button @click="rejectTarget = null" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="px-6 py-5">
            <p class="text-sm text-slate-500 mb-3">
              拒絕 <span class="font-semibold text-slate-700">{{ rejectTarget.name }}</span> 的預約申請（{{ rejectTarget.space }}）
            </p>
            <label class="block text-xs font-medium text-slate-600 mb-1.5">拒絕原因 *</label>
            <textarea v-model="rejectReason" rows="4" placeholder="請說明拒絕此次申請的原因..."
              class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              :class="rejectError ? 'border-red-300' : 'border-slate-200'"></textarea>
            <p v-if="rejectError" class="text-xs text-red-500 mt-1">{{ rejectError }}</p>
          </div>
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button @click="rejectTarget = null"
              class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              取消
            </button>
            <button @click="confirmReject"
              class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">
              確認拒絕
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const filterStatus = ref('')
const filterSpace = ref('')
const filterDate = ref('')
const activeTab = ref('all')
const selected = ref(null)
const rejectTarget = ref(null)
const rejectReason = ref('')
const rejectError = ref('')

const tabs = [
  { key: 'all', label: '全部' },
  { key: '待審核', label: '待審核' },
  { key: '已核准', label: '已核准' },
  { key: '已拒絕', label: '已拒絕' },
]

const reservations = ref([
  { id: 1, name: '陳宥廷', email: 'yu-ting@nthu.edu.tw', studentId: '110410001', space: '掃描式電子顯微鏡', date: '2026-05-21', time: '10:00–12:00', purpose: '奈米材料表面分析', status: '已核准' },
  { id: 2, name: '林佳穎', email: 'chia-ying@nthu.edu.tw', studentId: '110420023', space: '高效能工作站 #1', date: '2026-05-21', time: '13:00–15:00', purpose: '分子動力學模擬', status: '待審核' },
  { id: 3, name: '王柏文', email: 'bo-wen@nthu.edu.tw', studentId: '109110045', space: '原子力顯微鏡', date: '2026-05-22', time: '09:00–11:00', purpose: '薄膜表面形貌量測', status: '待審核' },
  { id: 4, name: '張雅婷', email: 'ya-ting@nthu.edu.tw', studentId: '110230067', space: '3D 列印機', date: '2026-05-22', time: '15:00–17:00', purpose: '畢業專題模型製作', status: '已核准' },
  { id: 5, name: '劉承恩', email: 'cheng-en@nthu.edu.tw', studentId: '109110012', space: '紅外線光譜儀', date: '2026-05-23', time: '10:00–12:00', purpose: '有機樣品成分分析', status: '已拒絕', rejectReason: '該時段設備正進行例行維護，無法開放使用。' },
  { id: 6, name: '吳冠廷', email: 'kuan-ting@nthu.edu.tw', studentId: '110420089', space: '視訊會議系統', date: '2026-05-23', time: '14:00–16:00', purpose: '國際合作遠距會議', status: '待審核' },
  { id: 7, name: '黃子翔', email: 'zi-xiang@nthu.edu.tw', studentId: '108410034', space: '高效能工作站 #2', date: '2026-05-24', time: '13:00–17:00', purpose: '深度學習模型訓練', status: '已核准' },
  { id: 8, name: '李芯儀', email: 'xin-yi@nthu.edu.tw', studentId: '110110056', space: 'X 光繞射儀', date: '2026-05-24', time: '10:00–12:00', purpose: '晶體結構鑑定', status: '待審核' },
])

const filtered = computed(() => reservations.value.filter(r => {
  if (search.value && !r.name.includes(search.value) && !r.space.includes(search.value)) return false
  if (filterStatus.value && r.status !== filterStatus.value) return false
  if (filterSpace.value && r.space !== filterSpace.value) return false
  if (filterDate.value && r.date !== filterDate.value) return false
  return true
}))

const tabFiltered = computed(() => {
  if (activeTab.value === 'all') return filtered.value
  return filtered.value.filter(r => r.status === activeTab.value)
})

const countByStatus = (key) => {
  if (key === 'all') return reservations.value.length
  return reservations.value.filter(r => r.status === key).length
}

const statusClass = (s) => ({
  '已核准': 'bg-green-50 text-green-700',
  '待審核': 'bg-amber-50 text-amber-700',
  '已拒絕': 'bg-red-50 text-red-600',
}[s] || 'bg-slate-100 text-slate-500')

function updateStatus(id, status) {
  const r = reservations.value.find(r => r.id === id)
  if (r) r.status = status
}

function openReject(res) {
  rejectTarget.value = res
  rejectReason.value = ''
  rejectError.value = ''
}

function confirmReject() {
  if (!rejectReason.value.trim()) {
    rejectError.value = '請填寫拒絕原因'
    return
  }
  const r = reservations.value.find(r => r.id === rejectTarget.value.id)
  if (r) {
    r.status = '已拒絕'
    r.rejectReason = rejectReason.value.trim()
  }
  rejectTarget.value = null
}

function viewDetail(res) {
  selected.value = res
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
