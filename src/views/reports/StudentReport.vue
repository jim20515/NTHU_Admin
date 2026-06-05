<template>
  <div class="space-y-4">
    <!-- Filter Bar -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-end">
      <div class="flex-1 min-w-36">
        <label class="block text-xs font-medium text-slate-500 mb-1.5">學生姓名</label>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="filterName" type="text" placeholder="搜尋姓名..."
            class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
        </div>
      </div>
      <div class="flex-1 min-w-36">
        <label class="block text-xs font-medium text-slate-500 mb-1.5">學生證號</label>
        <input v-model="filterStudentId" type="text" placeholder="搜尋學號..."
          class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
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
      <span class="text-xs text-slate-400 self-center ml-auto">共 {{ filtered.length }} 位學生</span>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 text-xs font-medium text-slate-500">
            <th class="text-left px-5 py-3">學生</th>
            <th class="text-left px-4 py-3">學生證號</th>
            <th class="text-left px-4 py-3">系所</th>
            <th class="text-right px-4 py-3">總預約時數</th>
            <th class="text-right px-4 py-3">實際使用時數</th>
            <th class="text-right px-4 py-3">總使用費用</th>
            <th class="text-right px-5 py-3">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="s in filtered" :key="s.studentId" class="hover:bg-slate-50/50 transition">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  <span class="text-xs font-semibold text-indigo-600">{{ s.name[0] }}</span>
                </div>
                <p class="font-medium text-slate-800">{{ s.name }}</p>
              </div>
            </td>
            <td class="px-4 py-3.5 text-slate-500 font-mono text-xs">{{ s.studentId }}</td>
            <td class="px-4 py-3.5 text-slate-600 text-xs">{{ s.dept }}</td>
            <td class="px-4 py-3.5 text-right font-medium text-slate-700">{{ s.reservedHours }} 小時</td>
            <td class="px-4 py-3.5 text-right font-medium text-slate-700">{{ s.usedHours }} 小時</td>
            <td class="px-4 py-3.5 text-right">
              <span class="font-semibold" :class="s.totalFee > 0 ? 'text-slate-800' : 'text-slate-400'">
                NT$ {{ s.totalFee.toLocaleString() }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-right">
              <button @click="generateBillingForm(s)"
                class="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                產生收費表單
              </button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="7" class="text-center py-12 text-slate-400 text-sm">沒有符合條件的學生資料</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterName = ref('')
const filterStudentId = ref('')
const filterDateFrom = ref('')
const filterDateTo = ref('')

const equipmentRates = {
  '掃描式電子顯微鏡': 500,
  '原子力顯微鏡': 400,
  '紅外線光譜儀': 300,
  '高效能工作站 #1': 100,
  '高效能工作站 #2': 100,
  '視訊會議系統': 50,
  'X 光繞射儀': 600,
  '3D 列印機': 200,
}

const allReservations = [
  { studentId: '110410001', name: '陳宥廷', dept: '資訊工程學系', equipment: '掃描式電子顯微鏡', date: '2026-05-10', reservedHours: 2, usedHours: 2, status: '已核准' },
  { studentId: '110410001', name: '陳宥廷', dept: '資訊工程學系', equipment: '高效能工作站 #1', date: '2026-05-15', reservedHours: 3, usedHours: 3, status: '已核准' },
  { studentId: '110420023', name: '林佳穎', dept: '電機工程學系', equipment: '高效能工作站 #1', date: '2026-05-12', reservedHours: 2, usedHours: 1.5, status: '已核准' },
  { studentId: '110420023', name: '林佳穎', dept: '電機工程學系', equipment: '原子力顯微鏡', date: '2026-05-18', reservedHours: 2, usedHours: 2, status: '已核准' },
  { studentId: '109110045', name: '王柏文', dept: '物理學系', equipment: '原子力顯微鏡', date: '2026-05-08', reservedHours: 2, usedHours: 2, status: '已核准' },
  { studentId: '110230067', name: '張雅婷', dept: '材料科學系', equipment: '3D 列印機', date: '2026-05-14', reservedHours: 2, usedHours: 2, status: '已核准' },
  { studentId: '110230067', name: '張雅婷', dept: '材料科學系', equipment: '掃描式電子顯微鏡', date: '2026-05-20', reservedHours: 1, usedHours: 1, status: '已核准' },
  { studentId: '109110012', name: '劉承恩', dept: '物理學系', equipment: 'X 光繞射儀', date: '2026-05-16', reservedHours: 2, usedHours: 0, status: '已拒絕' },
  { studentId: '110420089', name: '吳冠廷', dept: '電機工程學系', equipment: '視訊會議系統', date: '2026-05-17', reservedHours: 2, usedHours: 2, status: '已核准' },
  { studentId: '110420089', name: '吳冠廷', dept: '電機工程學系', equipment: '高效能工作站 #2', date: '2026-05-19', reservedHours: 4, usedHours: 4, status: '已核准' },
  { studentId: '108410034', name: '黃子翔', dept: '資訊工程學系', equipment: '高效能工作站 #2', date: '2026-05-21', reservedHours: 4, usedHours: 4, status: '已核准' },
  { studentId: '110110056', name: '李芯儀', dept: '物理學系', equipment: 'X 光繞射儀', date: '2026-05-22', reservedHours: 2, usedHours: 2, status: '已核准' },
]

const students = computed(() => {
  const map = {}
  allReservations.forEach(r => {
    if (!map[r.studentId]) {
      map[r.studentId] = {
        studentId: r.studentId,
        name: r.name,
        dept: r.dept,
        reservedHours: 0,
        usedHours: 0,
        totalFee: 0,
        reservations: [],
      }
    }
    const s = map[r.studentId]
    s.reservedHours += r.reservedHours
    s.usedHours += r.usedHours
    s.totalFee += r.usedHours * (equipmentRates[r.equipment] || 0)
    s.reservations.push(r)
  })
  return Object.values(map)
})

const filtered = computed(() => students.value.filter(s => {
  if (filterName.value && !s.name.includes(filterName.value)) return false
  if (filterStudentId.value && !s.studentId.includes(filterStudentId.value)) return false
  if (filterDateFrom.value || filterDateTo.value) {
    const inRange = s.reservations.some(r => {
      if (filterDateFrom.value && r.date < filterDateFrom.value) return false
      if (filterDateTo.value && r.date > filterDateTo.value) return false
      return true
    })
    if (!inRange) return false
  }
  return true
}))

function resetFilters() {
  filterName.value = ''
  filterStudentId.value = ''
  filterDateFrom.value = ''
  filterDateTo.value = ''
}

function generateBillingForm(student) {
  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
  const rows = student.reservations.map(r => `
    <tr>
      <td>${r.date}</td>
      <td>${r.equipment}</td>
      <td style="text-align:right">${r.reservedHours} 小時</td>
      <td style="text-align:right">${r.usedHours} 小時</td>
      <td style="text-align:right">NT$ ${(equipmentRates[r.equipment] || 0).toLocaleString()}</td>
      <td style="text-align:right">NT$ ${(r.usedHours * (equipmentRates[r.equipment] || 0)).toLocaleString()}</td>
      <td style="text-align:center">
        <span style="padding:2px 8px;border-radius:9999px;font-size:11px;
          background:${r.status === '已核准' ? '#f0fdf4' : r.status === '已拒絕' ? '#fef2f2' : '#fffbeb'};
          color:${r.status === '已核准' ? '#15803d' : r.status === '已拒絕' ? '#dc2626' : '#b45309'}">
          ${r.status}
        </span>
      </td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="utf-8">
  <title>儀器設備使用費用明細 — ${student.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 48px; font-size: 13px; }
    .header { text-align: center; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 2px solid #e2e8f0; }
    .header h1 { font-size: 18px; font-weight: 700; letter-spacing: 2px; margin-bottom: 4px; }
    .header h2 { font-size: 14px; font-weight: 500; color: #64748b; }
    .doc-no { text-align: right; font-size: 11px; color: #94a3b8; margin-bottom: 24px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 28px; }
    .info-item label { display: block; font-size: 10px; color: #94a3b8; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-item span { font-size: 13px; font-weight: 600; color: #1e293b; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 12px; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    .total-row { background: #f8fafc; font-weight: 700; border-top: 2px solid #e2e8f0 !important; }
    .total-row td { padding: 12px; font-size: 13px; }
    .amount { font-size: 20px; font-weight: 800; color: #4f46e5; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
    .sig-box { text-align: center; }
    .sig-box .line { border-bottom: 1px solid #94a3b8; height: 48px; margin-bottom: 8px; }
    .sig-box label { font-size: 11px; color: #64748b; }
    .footer { text-align: center; margin-top: 32px; font-size: 10px; color: #94a3b8; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>國立清華大學</h1>
    <h2>儀器設備使用費用明細</h2>
  </div>
  <div class="doc-no">單據編號：NTHU-${student.studentId}-${Date.now().toString().slice(-6)} ｜ 產生日期：${today}</div>
  <div class="info-grid">
    <div class="info-item"><label>學生姓名</label><span>${student.name}</span></div>
    <div class="info-item"><label>學生證號</label><span style="font-family:monospace">${student.studentId}</span></div>
    <div class="info-item"><label>系所</label><span>${student.dept}</span></div>
    <div class="info-item"><label>總使用費用</label><span class="amount">NT$ ${student.totalFee.toLocaleString()}</span></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>使用日期</th>
        <th>設備名稱</th>
        <th style="text-align:right">預約時數</th>
        <th style="text-align:right">實際時數</th>
        <th style="text-align:right">單價（/時）</th>
        <th style="text-align:right">小計</th>
        <th style="text-align:center">狀態</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr class="total-row">
        <td colspan="2" style="text-align:left">合計</td>
        <td style="text-align:right">${student.reservedHours} 小時</td>
        <td style="text-align:right">${student.usedHours} 小時</td>
        <td></td>
        <td style="text-align:right" class="amount">NT$ ${student.totalFee.toLocaleString()}</td>
        <td></td>
      </tr>
    </tbody>
  </table>
  <div class="signatures">
    <div class="sig-box"><div class="line"></div><label>學生簽名</label></div>
    <div class="sig-box"><div class="line"></div><label>指導教授</label></div>
    <div class="sig-box"><div class="line"></div><label>設備管理人員</label></div>
  </div>
  <div class="footer">本表單由清華大學預約管理系統自動產生 · 如有疑問請洽設備管理組</div>
  <script>window.onload = () => window.print()<\/script>
</body>
</html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
}
</script>
