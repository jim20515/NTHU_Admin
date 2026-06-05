<template>
  <div class="space-y-4">
    <!-- Filter Bar -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 flex gap-3 items-center">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" type="text" placeholder="搜尋用戶..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
      </div>
      <select v-model="filterRole"
        class="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">全部身份</option>
        <option>學生</option>
        <option>教職員</option>
        <option>管理員</option>
      </select>
      <button @click="showModal = true"
        class="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增用戶
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 text-xs font-medium text-slate-500">
            <th class="text-left px-5 py-3">用戶</th>
            <th class="text-left px-4 py-3">學生證號</th>
            <th class="text-left px-4 py-3">身份</th>
            <th class="text-left px-4 py-3">系所</th>
            <th class="text-left px-4 py-3">預約次數</th>
            <th class="text-left px-4 py-3">最後登入</th>
            <th class="text-left px-4 py-3">狀態</th>
            <th class="text-left px-4 py-3">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/50 transition">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  :class="avatarColor(user.name)">
                  {{ user.name[0] }}
                </div>
                <div>
                  <p class="font-medium text-slate-800">{{ user.name }}</p>
                  <p class="text-xs text-slate-400">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5 text-slate-500 font-mono text-xs">{{ user.studentId || '—' }}</td>
            <td class="px-4 py-3.5">
              <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="roleClass(user.role)">{{ user.role }}</span>
            </td>
            <td class="px-4 py-3.5 text-slate-500 text-xs">{{ user.dept }}</td>
            <td class="px-4 py-3.5 font-semibold text-slate-700">{{ user.count }}</td>
            <td class="px-4 py-3.5 text-slate-400 text-xs">{{ user.lastLogin }}</td>
            <td class="px-4 py-3.5">
              <span class="inline-flex items-center gap-1 text-xs">
                <span class="w-1.5 h-1.5 rounded-full" :class="user.active ? 'bg-green-500' : 'bg-slate-300'"></span>
                <span :class="user.active ? 'text-green-600' : 'text-slate-400'">{{ user.active ? '啟用' : '停用' }}</span>
              </span>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1.5">
                <button @click="openEdit(user)"
                  class="px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition">
                  編輯
                </button>
                <button @click="confirmDelete(user)"
                  class="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirm Modal -->
    <Transition name="fade">
      <div v-if="deleteTarget" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="deleteTarget = null">
        <div class="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
          <div class="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-slate-800 text-center mb-1">確認刪除用戶</h3>
          <p class="text-sm text-slate-400 text-center mb-6">
            確定要刪除 <span class="font-medium text-slate-700">{{ deleteTarget.name }}</span> 嗎？此操作無法復原。
          </p>
          <div class="flex gap-3">
            <button @click="deleteTarget = null"
              class="flex-1 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              取消
            </button>
            <button @click="deleteUser"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Add / Edit User Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="closeModal">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-xl">
          <div class="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 class="text-base font-semibold text-slate-800">{{ editingId ? '編輯用戶' : '新增用戶' }}</h2>
            <button @click="closeModal" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5">姓名 <span class="text-red-400">*</span></label>
                <input v-model="form.name" type="text" placeholder="輸入姓名"
                  class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  :class="errors.name ? 'border-red-300' : 'border-slate-200'" />
                <p v-if="errors.name" class="text-xs text-red-400 mt-1">{{ errors.name }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5">學生證號</label>
                <input v-model="form.studentId" type="text" placeholder="例：S110001"
                  class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-slate-600 mb-1.5">身份 <span class="text-red-400">*</span></label>
                <select v-model="form.role"
                  class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white transition"
                  :class="errors.role ? 'border-red-300' : 'border-slate-200'">
                  <option value="">選擇身份</option>
                  <option>學生</option>
                  <option>教職員</option>
                  <option>管理員</option>
                </select>
                <p v-if="errors.role" class="text-xs text-red-400 mt-1">{{ errors.role }}</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1.5">電子郵件 <span class="text-red-400">*</span></label>
              <input v-model="form.email" type="email" placeholder="example@nthu.edu.tw"
                class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                :class="errors.email ? 'border-red-300' : 'border-slate-200'" />
              <p v-if="errors.email" class="text-xs text-red-400 mt-1">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1.5">系所單位</label>
              <input v-model="form.dept" type="text" placeholder="例：資訊工程學系"
                class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1.5">帳號狀態</label>
              <div class="flex gap-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.active" :value="true" class="accent-indigo-600" />
                  <span class="text-sm text-slate-700">啟用</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.active" :value="false" class="accent-indigo-600" />
                  <span class="text-sm text-slate-700">停用</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex gap-3 px-6 pb-6">
            <button @click="closeModal"
              class="flex-1 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              取消
            </button>
            <button @click="submitUser"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
              {{ editingId ? '儲存變更' : '新增用戶' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const search = ref('')
const filterRole = ref('')
const showModal = ref(false)
const editingId = ref(null)
const deleteTarget = ref(null)

const form = reactive({ name: '', email: '', role: '', studentId: '', dept: '', active: true })
const errors = reactive({ name: '', email: '', role: '' })

const users = ref([
  { id: 1, name: '陳宥廷', email: 'yu-ting@nthu.edu.tw', role: '學生', studentId: '110410001', dept: '資訊工程學系', count: 12, lastLogin: '2 小時前', active: true },
  { id: 2, name: '林佳穎', email: 'chia-ying@nthu.edu.tw', role: '學生', studentId: '110420023', dept: '電機工程學系', count: 8, lastLogin: '昨天', active: true },
  { id: 3, name: '王柏文', email: 'bo-wen@nthu.edu.tw', role: '教職員', studentId: '', dept: '計算機科學系', count: 24, lastLogin: '1 天前', active: true },
  { id: 4, name: '張雅婷', email: 'ya-ting@nthu.edu.tw', role: '學生', studentId: '110230067', dept: '材料科學系', count: 5, lastLogin: '3 天前', active: true },
  { id: 5, name: '劉承恩', email: 'cheng-en@nthu.edu.tw', role: '學生', studentId: '109110012', dept: '物理學系', count: 3, lastLogin: '1 週前', active: false },
  { id: 6, name: '吳冠廷', email: 'kuan-ting@nthu.edu.tw', role: '教職員', studentId: '', dept: '化學系', count: 31, lastLogin: '今天', active: true },
  { id: 7, name: '管理員', email: 'admin@nthu.edu.tw', role: '管理員', studentId: '', dept: '學務處', count: 0, lastLogin: '剛剛', active: true },
])

const filteredUsers = computed(() => users.value.filter(u => {
  if (search.value && !u.name.includes(search.value) && !u.email.includes(search.value)) return false
  if (filterRole.value && u.role !== filterRole.value) return false
  return true
}))

function validate() {
  errors.name = form.name.trim() ? '' : '請輸入姓名'
  errors.email = form.email.trim()
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.email) ? '' : '請輸入有效的電子郵件'
    : '請輸入電子郵件'
  errors.role = form.role ? '' : '請選擇身份'
  return !errors.name && !errors.email && !errors.role
}

function openEdit(user) {
  editingId.value = user.id
  Object.assign(form, { name: user.name, email: user.email, role: user.role, studentId: user.studentId || '', dept: user.dept === '—' ? '' : user.dept, active: user.active })
  showModal.value = true
}

function confirmDelete(user) {
  deleteTarget.value = user
}

function deleteUser() {
  users.value = users.value.filter(u => u.id !== deleteTarget.value.id)
  deleteTarget.value = null
}

function submitUser() {
  if (!validate()) return
  if (editingId.value) {
    const u = users.value.find(u => u.id === editingId.value)
    if (u) Object.assign(u, { name: form.name.trim(), email: form.email.trim(), role: form.role, studentId: form.studentId.trim(), dept: form.dept.trim() || '—', active: form.active })
  } else {
    users.value.push({
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      studentId: form.studentId.trim(),
      dept: form.dept.trim() || '—',
      count: 0,
      lastLogin: '—',
      active: form.active,
    })
  }
  closeModal()
}

function closeModal() {
  showModal.value = false
  editingId.value = null
  Object.assign(form, { name: '', email: '', role: '', studentId: '', dept: '', active: true })
  Object.assign(errors, { name: '', email: '', role: '' })
}

const colors = ['bg-indigo-100 text-indigo-700', 'bg-purple-100 text-purple-700', 'bg-pink-100 text-pink-700', 'bg-sky-100 text-sky-700', 'bg-teal-100 text-teal-700']
const avatarColor = (name) => colors[name.charCodeAt(0) % colors.length]

const roleClass = (r) => ({
  '管理員': 'bg-indigo-100 text-indigo-700',
  '教職員': 'bg-blue-50 text-blue-700',
  '學生': 'bg-slate-100 text-slate-600',
}[r])
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
