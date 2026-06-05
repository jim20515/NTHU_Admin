<template>
  <div class="min-h-screen bg-slate-50 flex">
    <Sidebar />
    <div class="ml-60 flex-1 flex flex-col min-h-screen">
      <Header @new-reservation="showModal = true" />
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>

    <!-- New Reservation Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal = false">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-xl">
          <div class="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 class="text-base font-semibold text-slate-800">新增預約</h2>
            <button @click="showModal = false" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1.5">申請人</label>
              <input v-model="form.name" type="text" placeholder="輸入申請人姓名"
                class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1.5">預約空間</label>
              <select v-model="form.space"
                class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white">
                <option value="">選擇空間...</option>
                <option value="會議室A">會議室 A (10人)</option>
                <option value="會議室B">會議室 B (20人)</option>
                <option value="演講廳">演講廳 (100人)</option>
                <option value="討論室1">討論室 1 (6人)</option>
                <option value="討論室2">討論室 2 (6人)</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5">日期</label>
                <input v-model="form.date" type="date"
                  class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5">時段</label>
                <select v-model="form.time"
                  class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white">
                  <option value="">選擇時段</option>
                  <option>08:00–10:00</option>
                  <option>10:00–12:00</option>
                  <option>13:00–15:00</option>
                  <option>15:00–17:00</option>
                  <option>17:00–19:00</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1.5">用途說明</label>
              <textarea v-model="form.purpose" rows="2" placeholder="簡述使用目的..."
                class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none"></textarea>
            </div>
          </div>
          <div class="flex gap-3 px-6 pb-6">
            <button @click="showModal = false"
              class="flex-1 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              取消
            </button>
            <button @click="submitReservation"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
              送出申請
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'

const showModal = ref(false)
const form = ref({ name: '', space: '', date: '', time: '', purpose: '' })

function submitReservation() {
  if (!form.value.name || !form.value.space || !form.value.date || !form.value.time) return
  showModal.value = false
  form.value = { name: '', space: '', date: '', time: '', purpose: '' }
}
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
