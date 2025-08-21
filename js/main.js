import { analyzeMatrix } from './utils/chartAnalyzer.js'
import { ChartMatrix } from './components/ChartMatrix.js'

const state = {
  folders: [],
  files: [],
  selectedFolder: '',
  selectedFile: '',
  chartData: null,
  currentChart: null,
  chartInfo: null,
  stackRanges: [],
  matrixAnalysis: null
}

const app = document.getElementById('app')

init()

async function init() {
  app.innerHTML = ''
  const container = el('div', { class: 'container' })

  container.appendChild(renderControls())
  container.appendChild(renderMain())
  app.appendChild(container)

  await loadFolders()
  redraw()
}

function redraw() {
  const main = app.querySelector('#main')
  if (!main) return
  main.innerHTML = ''

  if (state.currentChart) {
    const layout = el('div', { class: 'layout' })
    const chartBox = el('div', { class: 'chart-box' })
    // Центрированный заголовок и матрица
    const area = el('div', { class: 'chart-area' })
    const chartTitle = getChartTitle()
    area.appendChild(ChartMatrix({ chart: state.currentChart, answers: state.currentChart.answers, title: chartTitle, onCellClick: onCellClick }))
    chartBox.appendChild(area)

    const infoBox = el('div', { class: 'info-box' })
    infoBox.appendChild(renderInfoPanel())
    infoBox.appendChild(renderActionsPanel())

    layout.appendChild(chartBox)
    layout.appendChild(infoBox)
    main.appendChild(layout)
  } else {
    main.appendChild(renderLoader())
  }
}

function renderControls() {
  const panel = el('div', { class: 'panel' })
  const header = el('div', { class: 'panel-header' })
  header.appendChild(el('h3', { text: 'Настройки стратегии' }))
  const body = el('div', { class: 'panel-body' })

  // Папки
  const folderGroup = el('div')
  folderGroup.appendChild(el('label', { text: 'Папка с чартами' }))
  const foldersWrap = el('div', { class: 'radio-group', id: 'folders' })
  folderGroup.appendChild(foldersWrap)
  body.appendChild(folderGroup)

  // Файлы
  const filesGroup = el('div')
  filesGroup.appendChild(el('label', { text: 'Файл чарта' }))
  const filesWrap = el('div', { class: 'radio-group', id: 'files' })
  filesGroup.appendChild(filesWrap)
  body.appendChild(filesGroup)

  // Диапазон стеков
  const rangeGroup = el('div')
  rangeGroup.appendChild(el('label', { text: 'Диапазон стеков' }))
  const select = el('select', { class: 'select', id: 'stackRange' })
  select.addEventListener('change', () => updateChartType())
  rangeGroup.appendChild(select)
  body.appendChild(rangeGroup)

  // Кнопки
  const actions = el('div', { class: 'actions' })
  const loadBtn = el('button', { class: 'button primary', text: 'Загрузить чарт' })
  loadBtn.addEventListener('click', () => loadChart())
  const exportBtn = el('button', { class: 'button success', text: 'Экспорт в Excel' })
  exportBtn.addEventListener('click', () => exportExcel())
  actions.appendChild(loadBtn)
  actions.appendChild(exportBtn)
  body.appendChild(actions)

  panel.appendChild(header)
  panel.appendChild(body)
  return panel
}

function renderMain() {
  const box = el('div', { id: 'main' })
  return box
}

function renderLoader() {
  const panel = el('div', { class: 'panel' })
  const body = el('div', { class: 'panel-body' })
  body.appendChild(el('p', { text: 'Выберите параметры и нажмите "Загрузить чарт"' }))
  panel.appendChild(body)
  return panel
}

function renderInfoPanel() {
  const panel = el('div', { class: 'panel' })
  const header = el('div', { class: 'panel-header' })
  header.appendChild(el('h3', { text: 'Информация о чарте' }))
  const body = el('div', { class: 'panel-body' })
  if (state.chartInfo) {
    body.appendChild(detail('Название:', state.chartInfo.title))
    body.appendChild(detail('Описание:', state.chartInfo.description))
    body.appendChild(detail('Игроков:', state.chartInfo.playersCount))
    body.appendChild(detail('Позиция:', state.chartInfo.position))
  }
  panel.appendChild(header)
  panel.appendChild(body)
  return panel
}

function renderActionsPanel() {
  const panel = el('div', { class: 'panel' })
  const header = el('div', { class: 'panel-header' })
  header.appendChild(el('h3', { text: 'Доступные действия' }))
  const body = el('div', { class: 'panel-body' })
  if (state.currentChart?.answers) {
    for (const a of state.currentChart.answers) {
      const row = el('div', { style: 'display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid #374151' })
      const color = el('div', { class: 'color-box' })
      color.style.backgroundColor = a.color.value
      row.appendChild(color)
      row.appendChild(el('span', { text: a.title }))
      body.appendChild(row)
    }
  }
  panel.appendChild(header)
  panel.appendChild(body)
  return panel
}

function detail(label, value){
  const row = el('div', { class: 'detail' })
  row.appendChild(el('span', { text: label }))
  const val = el('span')
  val.innerHTML = value
  row.appendChild(val)
  return row
}

async function loadFolders() {
  // 1) Пытаемся получить через PHP API
  let folders = null
  try {
    const apiRes = await fetch('./api/index.php?action=folders')
    if (apiRes && apiRes.ok) {
      folders = await apiRes.json()
    }
  } catch (e) {}

  // 2) Фолбек на статический корневой манифест
  if (!folders || !Array.isArray(folders) || folders.length === 0) {
    const res = await fetch('./pack_3408/manifest.json').catch(() => null)
    if (res && res.ok) {
      const data = await res.json()
      folders = data.folders || []
    }
  }

  state.folders = folders || []
  renderFolders()
}

function renderFolders() {
  const wrap = document.getElementById('folders')
  wrap.innerHTML = ''
  for (const folder of state.folders) {
    const item = el('label', { class: 'radio-item' })
    const input = el('input')
    input.type = 'radio'
    input.name = 'folder'
    input.value = folder
    input.addEventListener('change', () => onFolderChange(folder))
    item.appendChild(input)
    item.appendChild(el('span', { text: folder }))
    wrap.appendChild(item)
  }
}

async function onFolderChange(folder) {
  state.selectedFolder = folder
  state.selectedFile = ''
  state.files = []

  // Сбрасываем текущее состояние чарта и контрол
  state.chartData = null
  state.chartInfo = null
  state.stackRanges = []
  state.matrixAnalysis = null
  state.currentChart = null
  const select = document.getElementById('stackRange')
  if (select) select.innerHTML = ''
  redraw()

  // 1) Пробуем через PHP API
  let files = null
  try {
    const apiRes = await fetch(`./api/index.php?action=files&folder=${encodeURIComponent(folder)}`)
    if (apiRes && apiRes.ok) {
      files = await apiRes.json()
    }
  } catch (e) {}

  // 2) Фолбек: читаем из корневого манифеста filesByFolder
  if (!files || !Array.isArray(files) || files.length === 0) {
    const rootRes = await fetch('./pack_3408/manifest.json').catch(() => null)
    if (rootRes && rootRes.ok) {
      const data = await rootRes.json()
      files = (data.filesByFolder && data.filesByFolder[folder]) ? data.filesByFolder[folder] : []
    }
  }

  // 3) Дополнительный фолбек: локальный манифест папки, если есть
  if (!files || !Array.isArray(files) || files.length === 0) {
    const res = await fetch(`./pack_3408/${encodeURIComponent(folder)}/manifest.json`).catch(() => null)
    if (res && res.ok) {
      const data = await res.json()
      files = data.files || []
    }
  }

  state.files = files || []
  renderFiles()
}

function renderFiles() {
  const wrap = document.getElementById('files')
  wrap.innerHTML = ''
  for (const file of state.files) {
    const item = el('label', { class: 'radio-item' })
    const input = el('input')
    input.type = 'radio'
    input.name = 'file'
    input.value = file
    input.addEventListener('change', () => onFileChange(file))
    item.appendChild(input)
    item.appendChild(el('span', { text: file }))
    wrap.appendChild(item)
  }
}

async function onFileChange(file) {
  state.selectedFile = file
  // Очистим текущий чарт до загрузки нового
  state.currentChart = null
  redraw()
  await loadChartData()
}

async function loadChartData() {
  if (!state.selectedFolder || !state.selectedFile) return

  let chartData = null

  // 1) Пробуем через PHP API
  try {
    const apiRes = await fetch(`./api/index.php?action=chart&folder=${encodeURIComponent(state.selectedFolder)}&file=${encodeURIComponent(state.selectedFile)}`)
    if (apiRes && apiRes.ok) {
      chartData = await apiRes.json()
    }
  } catch (e) {}

  // 2) Фолбек: читаем статический JSON напрямую
  if (!chartData) {
    const res = await fetch(`./pack_3408/${encodeURIComponent(state.selectedFolder)}/${encodeURIComponent(state.selectedFile)}`).catch(() => null)
    if (res && res.ok) {
      chartData = await res.json()
    }
  }

  if (!chartData) return

  state.chartData = chartData
  state.chartInfo = chartData.chart
  state.stackRanges = chartData.chart.stackRanges

  const analysis = analyzeMatrix(chartData.chart)
  if (analysis) {
    state.matrixAnalysis = analysis
    const defaultId = analysis.defaultRange.id
    const select = document.getElementById('stackRange')
    select.innerHTML = ''
    state.stackRanges.forEach(r => {
      const opt = el('option', { text: `${r.rangeMin}-${r.rangeMax} BB` })
      opt.value = r.id
      if (r.id == defaultId) opt.selected = true
      select.appendChild(opt)
    })
  }
  loadChart()
}

function updateChartType() { loadChart() }

function loadChart() {
  if (!state.chartData) return
  const select = document.getElementById('stackRange')
  const rangeId = select.value || state.matrixAnalysis?.defaultRange?.id
  const range = state.stackRanges.find(r => r.id == rangeId)
  if (!range) {
    const fallbackId = state.matrixAnalysis?.defaultRange?.id
    if (fallbackId) {
      if (select) select.value = fallbackId
      const fallbackRange = state.stackRanges.find(r => r.id == fallbackId)
      if (!fallbackRange) {
        state.currentChart = null
        redraw()
        return
      }
      const fallbackChart = fallbackRange.charts[0]
      if (fallbackChart) {
        state.currentChart = { ...fallbackChart, analysis: state.matrixAnalysis?.analysis || {}, answers: fallbackChart.answers || state.chartData.chart?.answers || [], title: getChartTitle() }
        redraw()
      }
      return
    }
    state.currentChart = null
    redraw()
    return
  }
  const chart = range.charts[0]
  if (chart) {
    state.currentChart = { ...chart, analysis: state.matrixAnalysis?.analysis || {}, answers: chart.answers || state.chartData.chart?.answers || [], title: getChartTitle() }
  }
  redraw()
}

function onCellClick(payload) {
  console.log('Клик по ячейке:', payload)
}

function exportExcel() {
  alert('Экспорт Excel не реализован в статичной версии. Можно добавить позже через SheetJS.')
}

function el(tag, opts = {}) {
  const e = document.createElement(tag)
  if (opts.class) e.className = opts.class
  if (opts.id) e.id = opts.id
  if (opts.text) e.textContent = opts.text
  if (opts.style) e.setAttribute('style', opts.style)
  return e
}

function getChartTitle() {
  // Предпочтительно берём название из state.chartInfo.title, иначе из state.selectedFile
  if (state.chartInfo && state.chartInfo.title) return state.chartInfo.title
  if (state.selectedFile) return state.selectedFile
  return 'Чарт'
}


