import { POKER_COMBINATIONS } from '../utils/combinations.js'
import { ChartCell } from './ChartCell.js'

export function ChartMatrix({ chart, answers, title, onCellClick }) {
  const outer = document.createElement('div')
  outer.className = 'matrix-wrap'

  // Заголовок как компактная строка шириной матрицы
  const titleEl = document.createElement('div')
  titleEl.className = 'matrix-title'
  titleEl.textContent = title || 'Чарт'
  outer.appendChild(titleEl)

  // Сама матрица
  const wrapper = document.createElement('div')
  wrapper.className = 'matrix'

  for (let index = 0; index < POKER_COMBINATIONS.length; index++) {
    const combination = POKER_COMBINATIONS[index]
    const cellData = getCellData(chart, index)
    const analysis = chart.analysis?.[index]
    const cell = ChartCell({ combination, cellData, analysis, answers, onClick: onCellClick })
    wrapper.appendChild(cell)
  }

  outer.appendChild(wrapper)
  return outer
}

function getCellData(chart, index) {
  if (!chart || !chart.combinations) return null
  const cells = chart.combinations.split('#').filter(c => c.trim())
  for (const cell of cells) {
    const parts = cell.split(',')
    if (parts[0] == index) {
      return {
        isSplit: parts[1] === 'y',
        colors: parts[2].split('-'),
        percentages: parts[2].includes('(') ? (parts[2].match(/\((\d+)\)/g).map(p => parseInt(p.slice(1, -1)))) : [100]
      }
    }
  }
  return null
}


