export function ChartCell({ combination, cellData, analysis, answers, onClick }) {
  const el = document.createElement('div')
  el.className = 'cell'
  el.title = buildTooltip()
  el.textContent = combination

  applyBackground()
  renderCorners()

  el.addEventListener('click', () => {
    el.classList.toggle('selected')
    onClick && onClick({ combination, cellData })
  })

  return el

  function applyBackground() {
    if (!cellData) return
    const colors = cellData.colors
    const get = (action) => {
      const clean = action.split('(')[0]
      const ans = answers.find(a => a.value === clean)
      return ans ? ans.color.value : '#ccc'
    }
    if (cellData.isSplit && colors.length > 1) {
      const c1 = get(colors[0])
      const c2 = get(colors[1])
      el.style.background = `linear-gradient(90deg, ${c1} 50%, ${c2} 50%)`
    } else {
      el.style.backgroundColor = get(colors[0])
    }
  }

  function renderCorners() {
    if (!analysis) return
    const mk = (cls, text) => {
      const c = document.createElement('div')
      c.className = `corner ${cls}`
      c.textContent = text
      el.appendChild(c)
    }
    if (analysis.raise) mk('tp', analysis.raise)
    if (analysis.allin) mk('tr', analysis.allin)
    if (analysis.fold) mk('dl', analysis.fold)
    if (analysis.call) mk('dr', analysis.call)
  }

  function buildTooltip() {
    if (!cellData) return `${combination}: Нет данных`
    const actions = cellData.colors.map(color => {
      const answer = answers.find(a => a.value === color.split('(')[0])
      return answer ? answer.title : color
    })
    let tip = `${combination}: ${actions.join(' + ')}`
    if (analysis) {
      if (analysis.raise) tip += `\nRaise на ${analysis.raise}BB`
      if (analysis.allin) tip += `\nAll-in на ${analysis.allin}BB`
      if (analysis.fold) tip += `\nFold на ${analysis.fold}BB`
      if (analysis.call) tip += `\nCall на ${analysis.call}BB`
    }
    return tip
  }
}


