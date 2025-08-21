export function findDefaultRange(stackRanges) {
  if (!stackRanges || !stackRanges.length) return null
  const sorted = [...stackRanges].sort((a, b) => a.rangeMin - b.rangeMin)
  let def = sorted.find(r => r.rangeMin >= 15)
  if (!def) def = sorted.filter(r => r.rangeMax < 15).sort((a, b) => b.rangeMax - a.rangeMax)[0]
  return def || sorted[0]
}

export function parseCombinations(combinationsString) {
  const result = {}
  const cells = combinationsString.split('#').filter(cell => cell.trim())
  for (const cell of cells) {
    const [index, isRandom, actionWithPercent] = cell.split(',')
    // Разбираем все действия в сплите: например, "c(50)-a" → ["c", "a"]
    const actions = (actionWithPercent || '')
      .split('-')
      .map(part => part.split('(')[0])
      .filter(Boolean)
    const primary = actions[0] || null
    result[index] = { isRandom: isRandom === 'y', value: primary, actions }
  }
  return result
}

function getCellAction(combinations, cellIndex) {
  return combinations[cellIndex]?.value || null
}

function getCellActionsSet(combinations, cellIndex) {
  const actions = combinations[cellIndex]?.actions
  if (Array.isArray(actions) && actions.length > 0) {
    return new Set(actions)
  }
  const single = combinations[cellIndex]?.value
  return single ? new Set([single]) : new Set()
}

function gatherActionsFromAllCharts(combinationsArray, cellIndex) {
  // combinationsArray: Array<Record<cellIndex, {value:string}>>
  const set = new Set()
  for (const combos of combinationsArray || []) {
    const list = combos?.[cellIndex]?.actions
    if (Array.isArray(list)) {
      for (const v of list) set.add(v)
    } else {
      const v = combos?.[cellIndex]?.value
      if (v) set.add(v)
    }
  }
  return set
}

function analyzeCellDifferences(cellIndex, defaultRange, allRanges, combinationsFirstChartByRange, allChartsCombinationsByRange) {
  const baseCombos = combinationsFirstChartByRange[defaultRange.id]
  if (!baseCombos) return null
  const baseAction = getCellAction(baseCombos, cellIndex)
  const baseSet = getCellActionsSet(baseCombos, cellIndex)
  if (!baseAction && baseSet.size === 0) return null
  const differences = { raise: null, allin: null, fold: null, call: null }

  const upper = allRanges.filter(r => r.id !== defaultRange.id && r.rangeMin > defaultRange.rangeMin).sort((a, b) => a.rangeMin - b.rangeMin)
  const lower = allRanges.filter(r => r.id !== defaultRange.id && r.rangeMin < defaultRange.rangeMin).sort((a, b) => b.rangeMax - a.rangeMax)

  // Верхние подсказки (raise / all-in) временно отключены по требованию
  // for (const r of upper) {
  //   const actionsSet = gatherActionsFromAllCharts(allChartsCombinationsByRange[r.id], cellIndex)
  //   // Ищем ближайший верхний диапазон, где появляется raise/all-in и это отличается от базового действия
  //   if (!differences.raise && actionsSet.has('r') && baseAction !== 'r') differences.raise = r.rangeMin
  //   if (!differences.allin && actionsSet.has('a') && baseAction !== 'a') differences.allin = r.rangeMin
  //   if (differences.raise && differences.allin) {
  //     // если оба уже найдены ближайшими, можно не продолжать дальше по верхним
  //   }
  // }
  for (const r of lower) {
    const actionsSet = gatherActionsFromAllCharts(allChartsCombinationsByRange[r.id], cellIndex)
    // Если состав действий тот же, изменения нет
    let same = true
    if (actionsSet.size !== baseSet.size) {
      same = false
    } else {
      for (const v of actionsSet) { if (!baseSet.has(v)) { same = false; break } }
    }
    if (same) continue

    // Ищем ближайший нижний диапазон, где появляется новый вид действия относительно базового набора
    if (!differences.fold && actionsSet.has('f') && !baseSet.has('f')) differences.fold = r.rangeMax
    if (!differences.call && actionsSet.has('c') && !baseSet.has('c')) differences.call = r.rangeMax
    // Также учитываем all-in и raise в нижних уровнях, т.к. верхние отключены
    if (!differences.allin && actionsSet.has('a') && !baseSet.has('a')) differences.allin = r.rangeMax
    if (!differences.raise && actionsSet.has('r') && !baseSet.has('r')) differences.raise = r.rangeMax
    if (differences.fold && differences.call) {
      // оба найдены – можно не продолжать
    }
  }
  return differences
}

export function analyzeMatrix(chartData) {
  if (!chartData || !chartData.stackRanges) return null
  const defaultRange = findDefaultRange(chartData.stackRanges)
  if (!defaultRange) return null
  // combinations первого графа диапазона (для базового действия и совместимости с текущим отображением)
  const byRangeFirst = {}
  // combinations по всем графам диапазона (для поиска появлений действий при анализе)
  const byRangeAll = {}
  for (const r of chartData.stackRanges) {
    const charts = Array.isArray(r.charts) ? r.charts : []
    // берем ТОЛЬКО графы, у которых secondAction === null
    const valid = charts.filter(ch => ch && ch.secondAction === null)
    if (valid.length > 0) {
      byRangeFirst[r.id] = parseCombinations(valid[0].combinations)
      byRangeAll[r.id] = valid.map(ch => parseCombinations(ch.combinations))
    }
  }

  // Выбираем валидный дефолтный диапазон (около 15 BB), если исходный не имеет валидных графов
  let effectiveDefaultRange = defaultRange
  if (!byRangeFirst[defaultRange.id]) {
    // сначала ищем ближайший диапазон СВЕРХУ, затем СНИЗУ
    const above = chartData.stackRanges
      .filter(r => r.rangeMin >= defaultRange.rangeMin && byRangeFirst[r.id])
      .sort((a, b) => a.rangeMin - b.rangeMin)
    const below = chartData.stackRanges
      .filter(r => r.rangeMin < defaultRange.rangeMin && byRangeFirst[r.id])
      .sort((a, b) => b.rangeMin - a.rangeMin)
    if (above.length > 0) effectiveDefaultRange = above[0]
    else if (below.length > 0) effectiveDefaultRange = below[0]
    else return null
  }
  const matrix = {}
  for (let i = 0; i < 169; i++) {
    matrix[i] = analyzeCellDifferences(i, effectiveDefaultRange, chartData.stackRanges, byRangeFirst, byRangeAll)
  }
  return { defaultRange: effectiveDefaultRange, analysis: matrix }
}


