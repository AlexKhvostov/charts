import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { pathToFileURL } from 'url'

const ROOT = process.cwd()
const SRC_DIR = path.join(ROOT, 'json_3408')
const OUT_DIR = path.join(ROOT, 'processed')
const OUT_FILE = path.join(OUT_DIR, 'processed.json')

function sha256(content){
	return crypto.createHash('sha256').update(content).digest('hex')
}

function ensureDir(dir){
	if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function parseActionsFromCellSpec(spec){
	if(!spec) return []
	return spec.split('-').map(part => {
		const code = part.split('(')[0]
		const m = part.match(/\((\d+)\)/)
		const percent = m ? parseInt(m[1], 10) : 100
		const item = { code, percent }
		if(code === 'r'){
			// factor может храниться в answers исходника; здесь опускаем
		}
		return item
	})
}

function buildCellsForRange(chart, range){
	const map = new Map()
	const charts = Array.isArray(range.charts) ? range.charts : []
	const valid = charts.filter(ch => ch && ch.secondAction === null)
	if(valid.length === 0) return map
	const base = valid[0]
	const parts = (base.combinations || '').split('#').filter(Boolean)
	for(const cell of parts){
		const [idxStr, isRandom, actionsSpec] = cell.split(',')
		const cellIndex = parseInt(idxStr, 10)
		map.set(cellIndex, parseActionsFromCellSpec(actionsSpec))
	}
	return map
}

function findDefaultRange(stackRanges){
	const sorted = [...stackRanges].sort((a,b)=>a.rangeMin-b.rangeMin)
	let def = sorted.find(r => r.rangeMin >= 15)
	if(!def){
		def = sorted.filter(r => r.rangeMax < 15).sort((a,b)=>b.rangeMax-a.rangeMax)[0]
	}
	return def || sorted[0]
}

async function analyze(chart){
	const analyzerPath = pathToFileURL(path.join(ROOT, 'js', 'utils', 'chartAnalyzer.js')).href
	const m = await import(analyzerPath)
	return m.analyzeMatrix(chart)
}

async function processFile(filePath){
	const raw = fs.readFileSync(filePath, 'utf8')
	const json = JSON.parse(raw)
	const { chart } = json
	const sourceHash = sha256(raw)

	const analysisRes = await analyze(chart)
	const defaultRange = analysisRes?.defaultRange
	const analysis = analysisRes?.analysis || {}

	let answers = chart.answers || []
	if(defaultRange){
		const firstChart = (defaultRange.charts||[]).find(ch => ch && ch.secondAction === null)
		if(firstChart && firstChart.answers) answers = firstChart.answers
	}

	const ranges = (chart.stackRanges||[]).map(r => ({ id: r.id, rangeMin: r.rangeMin, rangeMax: r.rangeMax }))

	const cells = []
	const rangeIdList = ranges.map(r=>r.id)
	const actionsByRangeMap = new Map()
	for(const r of chart.stackRanges||[]){
		const cellMap = buildCellsForRange(chart, r)
		actionsByRangeMap.set(r.id, cellMap)
	}
	for(let cellIndex=0; cellIndex<169; cellIndex++){
		const a = analysis[cellIndex] || { fold: null, call: null, allin: null, raise: null }
		const actionsByRange = {}
		for(const rid of rangeIdList){
			const m = actionsByRangeMap.get(rid)
			if(m && m.has(cellIndex)) actionsByRange[rid] = m.get(cellIndex)
		}
		cells.push({ cellIndex, analysis: a, actionsByRange })
	}

	return {
		version: '1',
		generatedAt: new Date().toISOString(),
		meta: {
			id: chart.id,
			title: chart.title,
			playersCount: chart.playersCount,
			position: chart.position,
			sourceHash
		},
		answers: (answers||[]).map(a=>({ value: a.value, title: a.title, color: { value: a.color?.value || '#ccc' } })),
		ranges,
		defaultRangeId: defaultRange?.id || null,
		cells
	}
}

async function main(){
	ensureDir(OUT_DIR)
	const manifestPath = path.join(SRC_DIR, 'manifest.json')
	const files = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
	const results = []
	for(const f of files){
		const fp = path.join(SRC_DIR, f)
		try {
			const item = await processFile(fp)
			results.push(item)
		} catch(e){
			console.error('Failed to process', f, e.message)
		}
	}
	fs.writeFileSync(OUT_FILE, JSON.stringify({ version: '1', generatedAt: new Date().toISOString(), charts: results }, null, 2), 'utf8')
	console.log('Processed written to', OUT_FILE)
}

main().catch(err=>{ console.error(err); process.exit(1) })
