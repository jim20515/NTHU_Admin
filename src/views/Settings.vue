<template>
  <div class="space-y-4">
  <div class="flex justify-end">
    <button class="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
      儲存設定
    </button>
  </div>
  <div class="grid grid-cols-2 gap-4 items-start">
    <div v-for="section in leftSections" :key="section.title" class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
        <div class="w-1 h-8 rounded-full bg-indigo-500 shrink-0"></div>
        <div>
          <h3 class="text-sm font-bold text-slate-900 tracking-wide">{{ section.title }}</h3>
          <p class="text-xs text-slate-400 mt-0.5">{{ section.desc }}</p>
        </div>
      </div>
      <div class="divide-y divide-slate-50">
        <div v-for="item in section.items" :key="item.key" class="flex items-center justify-between px-5 py-4">
          <div>
            <p class="text-sm font-medium text-slate-700">{{ item.label }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ item.desc }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer" v-if="item.type === 'toggle'">
            <input type="checkbox" v-model="settings[item.key]" class="sr-only peer" />
            <div class="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors"></div>
            <div class="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-all peer-checked:translate-x-4"></div>
          </label>
          <select v-else-if="item.type === 'select'" v-model="settings[item.key]"
            class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            <option v-for="opt in item.options" :key="opt">{{ opt }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Right column -->
    <div class="space-y-4">
      <div v-for="section in rightSections" :key="section.title" class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div class="w-1 h-8 rounded-full bg-indigo-500 shrink-0"></div>
          <div>
            <h3 class="text-sm font-bold text-slate-900 tracking-wide">{{ section.title }}</h3>
            <p class="text-xs text-slate-400 mt-0.5">{{ section.desc }}</p>
          </div>
        </div>
        <div class="divide-y divide-slate-50">
          <div v-for="item in section.items" :key="item.key" class="flex items-center justify-between px-5 py-4">
            <div>
              <p class="text-sm font-medium text-slate-700">{{ item.label }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ item.desc }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer" v-if="item.type === 'toggle'">
              <input type="checkbox" v-model="settings[item.key]" class="sr-only peer" />
              <div class="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors"></div>
              <div class="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-all peer-checked:translate-x-4"></div>
            </label>
            <select v-else-if="item.type === 'select'" v-model="settings[item.key]"
              class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
              <option v-for="opt in item.options" :key="opt">{{ opt }}</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const settings = reactive({
  emailNotify: true,
  autoApprove: false,
  requirePurpose: true,
  maxDaysAhead: '30 天',
  maxDuration: '4 小時',
  allowRepeat: true,
  maintenanceMode: false,
})

const sections = [
  {
    title: '預約規則',
    desc: '設定預約申請的基本規則',
    items: [
      { key: 'requirePurpose', label: '要求填寫用途', desc: '申請預約時必須填寫使用目的', type: 'toggle' },
      { key: 'autoApprove', label: '自動核准申請', desc: '新申請自動核准，無需人工審核', type: 'toggle' },
      { key: 'allowRepeat', label: '允許重複預約', desc: '同一用戶可在相同時段預約不同空間', type: 'toggle' },
      { key: 'maxDaysAhead', label: '最遠可預約天數', desc: '用戶可提前預約的最長時間', type: 'select', options: ['7 天', '14 天', '30 天', '60 天'] },
      { key: 'maxDuration', label: '單次最長使用時數', desc: '每次預約的最長使用時間', type: 'select', options: ['1 小時', '2 小時', '4 小時', '8 小時'] },
    ],
  },
  {
    title: '通知設定',
    desc: '控制系統發送通知的方式',
    items: [
      { key: 'emailNotify', label: '電子郵件通知', desc: '預約狀態變更時自動發送郵件', type: 'toggle' },
    ],
  },
  {
    title: '系統維護',
    desc: '進階系統設定',
    items: [
      { key: 'maintenanceMode', label: '維護模式', desc: '開啟後一般用戶無法使用系統', type: 'toggle' },
    ],
  },
]

const leftSections = computed(() => sections.slice(0, 1))
const rightSections = computed(() => sections.slice(1))
</script>
