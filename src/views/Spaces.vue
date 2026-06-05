<template>
  <div class="space-y-4">
    <!-- Filter Bar -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
      <div class="relative flex-1 min-w-48">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" type="text" placeholder="搜尋設備名稱或編號..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
      </div>
      <select v-model="filterType"
        class="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">全部類型</option>
        <option>分析儀器</option>
        <option>量測設備</option>
        <option>電腦設備</option>
        <option>視聽設備</option>
        <option>製造設備</option>
      </select>
      <select v-model="filterStatus"
        class="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">全部狀態</option>
        <option>可預約</option>
        <option>維修中</option>
        <option>停用</option>
      </select>
      <span class="text-xs text-slate-400">共 {{ filtered.length }} 台</span>
      <button @click="openAdd"
        class="ml-auto flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增設備
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 text-xs font-medium text-slate-500">
            <th class="text-left px-5 py-3">設備</th>
            <th class="text-left px-4 py-3">類型</th>
            <th class="text-left px-4 py-3">所在位置</th>
            <th class="text-left px-4 py-3">管理人</th>
            <th class="text-left px-4 py-3">最後維護日</th>
            <th class="text-left px-4 py-3">狀態</th>
            <th class="text-left px-4 py-3">本週預約率</th>
            <th class="text-right px-5 py-3">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="eq in filtered" :key="eq.id" class="hover:bg-slate-50/50 transition">
            <td class="px-5 py-3.5">
              <p class="font-medium text-slate-800">{{ eq.name }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ eq.code }}</p>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">{{ eq.type }}</span>
            </td>
            <td class="px-4 py-3.5 text-slate-600">{{ eq.location }}</td>
            <td class="px-4 py-3.5 text-slate-600">{{ eq.manager }}</td>
            <td class="px-4 py-3.5 text-slate-500">{{ eq.lastMaintained }}</td>
            <td class="px-4 py-3.5">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="statusClass(eq.status)">
                {{ eq.status }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-16">
                  <div class="h-full rounded-full bg-indigo-400 transition-all duration-700"
                    :style="{ width: eq.weeklyRate + '%' }"></div>
                </div>
                <span class="text-xs font-semibold text-slate-700 w-8 text-right">{{ eq.weeklyRate }}%</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1">
                <button @click="openEdit(eq)"
                  class="px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition">
                  編輯
                </button>
                <button @click="confirmDelete(eq)"
                  class="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
                  刪除
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="8" class="text-center py-12 text-slate-400 text-sm">
              沒有符合條件的設備
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-base font-semibold text-slate-800">{{ editingId ? '編輯設備' : '新增設備' }}</h3>
            <button @click="closeModal" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="px-6 py-5 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-xs font-medium text-slate-600 mb-1.5">設備名稱 *</label>
                <input v-model="form.name" type="text" placeholder="例：掃描式電子顯微鏡"
                  class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  :class="errors.name ? 'border-red-300' : 'border-slate-200'" />
                <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5">設備編號 *</label>
                <input v-model="form.code" type="text" placeholder="例：EQ-001"
                  class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  :class="errors.code ? 'border-red-300' : 'border-slate-200'" />
                <p v-if="errors.code" class="text-xs text-red-500 mt-1">{{ errors.code }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5">設備類型 *</label>
                <select v-model="form.type"
                  class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  :class="errors.type ? 'border-red-300' : 'border-slate-200'">
                  <option value="">請選擇類型</option>
                  <option>分析儀器</option>
                  <option>量測設備</option>
                  <option>電腦設備</option>
                  <option>視聽設備</option>
                  <option>製造設備</option>
                </select>
                <p v-if="errors.type" class="text-xs text-red-500 mt-1">{{ errors.type }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5">所在位置</label>
                <input v-model="form.location" type="text" placeholder="例：工程一館 B102"
                  class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5">管理人</label>
                <input v-model="form.manager" type="text" placeholder="負責管理的人員"
                  class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5">最後維護日</label>
                <input v-model="form.lastMaintained" type="date"
                  class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-slate-600 mb-2">狀態</label>
                <div class="flex gap-5">
                  <label v-for="s in ['可預約', '維修中', '停用']" :key="s"
                    class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" :value="s" v-model="form.status" class="accent-indigo-600" />
                    <span class="text-sm text-slate-700">{{ s }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              取消
            </button>
            <button @click="submitEquipment"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
              {{ editingId ? '儲存變更' : '新增設備' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirm Modal -->
    <Transition name="fade">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40" @click="deleteTarget = null"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <h3 class="text-base font-semibold text-slate-800 mb-2">確認刪除</h3>
          <p class="text-sm text-slate-500 mb-5">確定要刪除設備「<span class="font-semibold text-slate-700">{{ deleteTarget.name }}</span>」嗎？此操作無法還原。</p>
          <div class="flex justify-end gap-3">
            <button @click="deleteTarget = null"
              class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
              取消
            </button>
            <button @click="deleteEquipment"
              class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const search = ref('')
const filterType = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const editingId = ref(null)
const deleteTarget = ref(null)

const form = reactive({ name: '', code: '', type: '', location: '', manager: '', lastMaintained: '', status: '可預約' })
const errors = reactive({ name: '', code: '', type: '' })

const equipment = ref([
  { id: 1, name: '掃描式電子顯微鏡', code: 'EQ-001', type: '分析儀器', location: '工程一館 B102', manager: '張志明', lastMaintained: '2026-04-10', status: '可預約', weeklyRate: 78 },
  { id: 2, name: '原子力顯微鏡', code: 'EQ-002', type: '分析儀器', location: '工程一館 B103', manager: '張志明', lastMaintained: '2026-03-25', status: '可預約', weeklyRate: 55 },
  { id: 3, name: '紅外線光譜儀', code: 'EQ-003', type: '量測設備', location: '化學館 214', manager: '林怡君', lastMaintained: '2026-05-01', status: '維修中', weeklyRate: 0 },
  { id: 4, name: '高效能工作站 #1', code: 'EQ-004', type: '電腦設備', location: '資訊館 401', manager: '王建宇', lastMaintained: '2026-04-20', status: '可預約', weeklyRate: 90 },
  { id: 5, name: '高效能工作站 #2', code: 'EQ-005', type: '電腦設備', location: '資訊館 401', manager: '王建宇', lastMaintained: '2026-04-20', status: '可預約', weeklyRate: 85 },
  { id: 6, name: '視訊會議系統', code: 'EQ-006', type: '視聽設備', location: '行政大樓 301', manager: '陳美玲', lastMaintained: '2026-02-15', status: '可預約', weeklyRate: 42 },
  { id: 7, name: 'X 光繞射儀', code: 'EQ-007', type: '分析儀器', location: '材料館 B205', manager: '吳宗翰', lastMaintained: '2026-05-10', status: '停用', weeklyRate: 0 },
  { id: 8, name: '3D 列印機', code: 'EQ-008', type: '製造設備', location: '創客空間 102', manager: '劉芸菁', lastMaintained: '2026-05-05', status: '可預約', weeklyRate: 67 },
])

const filtered = computed(() => equipment.value.filter(eq => {
  if (search.value && !eq.name.includes(search.value) && !eq.code.includes(search.value)) return false
  if (filterType.value && eq.type !== filterType.value) return false
  if (filterStatus.value && eq.status !== filterStatus.value) return false
  return true
}))

const statusClass = (s) => ({
  '可預約': 'bg-green-50 text-green-700',
  '維修中': 'bg-amber-50 text-amber-700',
  '停用': 'bg-slate-100 text-slate-500',
}[s] || 'bg-slate-100 text-slate-500')

function openAdd() {
  editingId.value = null
  showModal.value = true
}

function openEdit(eq) {
  editingId.value = eq.id
  Object.assign(form, { name: eq.name, code: eq.code, type: eq.type, location: eq.location, manager: eq.manager, lastMaintained: eq.lastMaintained, status: eq.status })
  showModal.value = true
}

function confirmDelete(eq) { deleteTarget.value = eq }

function deleteEquipment() {
  equipment.value = equipment.value.filter(e => e.id !== deleteTarget.value.id)
  deleteTarget.value = null
}

function validate() {
  errors.name = form.name.trim() ? '' : '請輸入設備名稱'
  errors.code = form.code.trim() ? '' : '請輸入設備編號'
  errors.type = form.type ? '' : '請選擇設備類型'
  return !errors.name && !errors.code && !errors.type
}

function submitEquipment() {
  if (!validate()) return
  if (editingId.value) {
    const eq = equipment.value.find(e => e.id === editingId.value)
    if (eq) Object.assign(eq, { name: form.name.trim(), code: form.code.trim(), type: form.type, location: form.location.trim(), manager: form.manager.trim(), lastMaintained: form.lastMaintained, status: form.status })
  } else {
    equipment.value.push({ id: Date.now(), name: form.name.trim(), code: form.code.trim(), type: form.type, location: form.location.trim(), manager: form.manager.trim(), lastMaintained: form.lastMaintained, status: form.status, weeklyRate: 0 })
  }
  closeModal()
}

function closeModal() {
  showModal.value = false
  editingId.value = null
  Object.assign(form, { name: '', code: '', type: '', location: '', manager: '', lastMaintained: '', status: '可預約' })
  Object.assign(errors, { name: '', code: '', type: '' })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
