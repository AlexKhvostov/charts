// Источник processed.json
const URL_PROCESSED = 'http://charts.redparty.ru/processed/processed.json';
const SHEET_NAME = 'charts';

// Размеры внутренних ячеек блока (2 колонки x 3 строки)
const CELL_WIDTH_PX = 20; // все столбцы будем делать 20px

// Параметры сетки чарта
const CHART_COLS = 26; // 13*2
const CHART_ROWS = 39; // матрица 13*3 без строки заголовка
const H_SPACING_COLS = 1; // отступ между чатрами по горизонтали
const V_SPACING_ROWS = 2; // отступ между рядами чартов по вертикали
const CHARTS_PER_ROW = 4;

// Цвета для углов
const CORNER_COLORS = {
	raise: '#7986CB', // верхний левый
	allin: '#4CAF50', // верхний правый
	fold:  '#E0E0E0', // нижний левый
	call:  '#FFB74D'  // нижний правый
};

// Позиции углов внутри блока 2x3
const CORNER_ORDER = [
	{ name: 'raise', rOffset: 0, cOffset: 0 }, // top-left
	{ name: 'allin', rOffset: 0, cOffset: 1 }, // top-right
	{ name: 'fold',  rOffset: 2, cOffset: 0 }, // bottom-left
	{ name: 'call',  rOffset: 2, cOffset: 1 }  // bottom-right
];

// Порядок комбинаций как на фронтенде (индекс 0..168)
const POKER_COMBINATIONS = [
	'AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
	'AKo', 'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
	'AQo', 'KQo', 'QQ', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s',
	'AJo', 'KJo', 'QJo', 'JJ', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s',
	'ATo', 'KTo', 'QTo', 'JTo', 'TT', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s',
	'A9o', 'K9o', 'Q9o', 'J9o', 'T9o', '99', '98s', '97s', '96s', '95s', '94s', '93s', '92s',
	'A8o', 'K8o', 'Q8o', 'J8o', 'T8o', '98o', '88', '87s', '86s', '85s', '84s', '83s', '82s',
	'A7o', 'K7o', 'Q7o', 'J7o', 'T7o', '97o', '87o', '77', '76s', '75s', '74s', '73s', '72s',
	'A6o', 'K6o', 'Q6o', 'J6o', 'T6o', '96o', '86o', '76o', '66', '65s', '64s', '63s', '62s',
	'A5o', 'K5o', 'Q5o', 'J5o', 'T5o', '95o', '85o', '75o', '65o', '55', '54s', '53s', '52s',
	'A4o', 'K4o', 'Q4o', 'J4o', 'T4o', '94o', '84o', '74o', '64o', '54o', '44', '43s', '42s',
	'A3o', 'K3o', 'Q3o', 'J3o', 'T3o', '93o', '83o', '73o', '63o', '53o', '43o', '33', '32s',
	'A2o', 'K2o', 'Q2o', 'J2o', 'T2o', '92o', '82o', '72o', '62o', '52o', '42o', '32o', '22'
];

function main() {
	const ss = SpreadsheetApp.getActive();
	let sheet = ss.getSheetByName(SHEET_NAME);
	if (sheet) ss.deleteSheet(sheet);
	sheet = ss.insertSheet(SHEET_NAME);

	const processed = fetchProcessed();
	const charts = processed.charts || [];
	if (!charts.length) return;

	// Сделаем ширину всех доступных на листе столбцов 20px (и при необходимости расширим)
	ensureColumnsRange(sheet, 1, CHARTS_PER_ROW * (CHART_COLS + H_SPACING_COLS), CELL_WIDTH_PX);
	// Отключим перенос по всему листу, чтобы не росла высота строк
	sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
		.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

	// Раскладываем по 4 в ряд
	for (let i = 0; i < charts.length; i++) {
		const rowGroup = Math.floor(i / CHARTS_PER_ROW);
		const colInRow = i % CHARTS_PER_ROW;
		const startRow = 1 + rowGroup * (1 + CHART_ROWS + V_SPACING_ROWS); // 1 строка заголовка + матрица + отступ
		const startCol = 1 + colInRow * (CHART_COLS + H_SPACING_COLS);
		drawChart(sheet, charts[i], startRow, startCol);
		// Явно фиксируем высоту строки заголовка (например, 20 px)
		sheet.setRowHeight(startRow, 20);
	}
	SpreadsheetApp.flush();
}

// Запускать отдельно на уже заполненном листе для коррекции размеров
function fixChartSizes() {
	const ss = SpreadsheetApp.getActive();
	const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
	const lastRow = sheet.getLastRow();
	const lastCol = sheet.getLastColumn();
	if (lastCol > 0) sheet.setColumnWidths(1, lastCol, CELL_WIDTH_PX);
	if (lastRow > 0 && lastCol > 0) sheet.getRange(1, 1, lastRow, lastCol).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
	SpreadsheetApp.flush();
	// Сначала всем строкам выставим 12 px (базовый)
	if (lastRow > 0) sheet.setRowHeights(1, lastRow, 12);
	SpreadsheetApp.flush();
	// Затем пройдём по блокам и повысим заголовки до 20, а центральные строки каждого блока до 16
	let headerRow = 1;
	while (headerRow <= lastRow) {
		// Заголовок
		sheet.setRowHeight(headerRow, 20);
		// Центры 13 блоков: headerRow + 1 + (r*3 + 1)
		for (let r = 0; r < 13; r++) {
			const centerRow = headerRow + 1 + (r * 3 + 1);
			if (centerRow > lastRow) break;
			sheet.setRowHeight(centerRow, 16);
		}
		headerRow += (1 + CHART_ROWS + V_SPACING_ROWS); // шаг 42
	}
	SpreadsheetApp.flush();
}

function fetchProcessed() {
	const res = UrlFetchApp.fetch(URL_PROCESSED, { muteHttpExceptions: true });
	if (res.getResponseCode() !== 200) {
		throw new Error('Не удалось загрузить processed.json: ' + res.getResponseCode());
	}
	return JSON.parse(res.getContentText());
}

function drawChart(sheet, chartItem, startRow, startCol) {
	// Обеспечим колонки и их ширины для текущего блока
	ensureColumnsRange(sheet, startCol, CHART_COLS, CELL_WIDTH_PX);

	// Заголовок (объединение на 26 колонок начиная с startCol)
	ensureRows(sheet, startRow); // нужна хотя бы эта строка
	const titleRange = sheet.getRange(startRow, startCol, 1, CHART_COLS);
	titleRange.merge();
	titleRange
		.setValue(chartItem.meta?.title || String(chartItem.meta?.id || ''))
		.setHorizontalAlignment('center')
		.setVerticalAlignment('middle')
		.setFontWeight('bold')
		.setBackground('#1f2937')
		.setFontColor('#f9fafb')
		.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

	// База для матрицы
	const baseRow = startRow + 1;
	const needEndRow = baseRow + CHART_ROWS - 1;
	ensureRows(sheet, needEndRow);

	const defaultRangeId = chartItem.defaultRangeId || (chartItem.ranges?.[0]?.id);
	const cells = chartItem.cells || [];

	// Быстрый доступ к analysis
	const analysisMap = {};
	for (const cell of cells) analysisMap[cell.cellIndex] = cell.analysis || { fold:null, call:null, allin:null, raise:null };

	// 13x13 блоков (row-major индекс 0..168)
	for (let i = 0; i < 169; i++) {
		const r13 = Math.floor(i / 13);
		const c13 = i % 13;

		const blockTop = baseRow + r13 * 3;
		const blockLeft = startCol + c13 * 2;

		// Высоты 3 строк блока: верх 12px, центр 16px (жирный текст), низ 12px
		sheet.setRowHeight(blockTop, 12);
		sheet.setRowHeight(blockTop + 1, 16);
		sheet.setRowHeight(blockTop + 2, 12);

		// Данные ячейки
		const cellData = cells.find(c => c.cellIndex === i) || { actionsByRange: {} };
		const actions = cellData.actionsByRange?.[defaultRangeId] || [];

		// Базовый цвет (основное действие)
		const mainAction = pickPrimaryAction(actions);
		const baseColor = mainAction ? pickColorForCode(mainAction.code, chartItem.answers) : '#f8f9fa';

		// Заливаем весь блок 2x3 базовым цветом
		const blockRange = sheet.getRange(blockTop, blockLeft, 3, 2);
		blockRange.setBackground(baseColor)
			.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
		// Внутренние границы — базового цвета
		blockRange.setBorder(false, false, false, false, true, true, baseColor, SpreadsheetApp.BorderStyle.SOLID);
		// Периметр — чёрный (чуть толще)
		blockRange.setBorder(true, true, true, true, false, false, '#000000', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

		// Центр: объединяем 1x2 (средняя строка, 2 колонки)
		const center = sheet.getRange(blockTop + 1, blockLeft, 1, 2);
		try { center.breakApart(); } catch(e) {}
		center.merge();
		center
			.setHorizontalAlignment('center')
			.setVerticalAlignment('middle')
			.setFontSize(9)
			.setFontWeight('bold')
			.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)
			.setValue(getCombinationLabel(i));

		// Уголки: верхняя и нижняя строки, шрифт 6
		const an = analysisMap[i] || {};
		for (const corner of CORNER_ORDER) {
			const val = an[corner.name];
			const rng = sheet.getRange(blockTop + corner.rOffset, blockLeft + corner.cOffset);
			rng.setHorizontalAlignment('center')
				.setVerticalAlignment('middle')
				.setFontSize(6)
				.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
			if (val != null) {
				rng.setBackground(CORNER_COLORS[corner.name]).setValue(val);
			} else {
				rng.setBackground(baseColor).setValue('');
			}
		}
	}

	// Финальная фиксация высот строк для текущего чарта (перебьем любые авто-изменения)
	for (let r = 0; r < 13; r++) {
		const top = baseRow + r * 3;
		sheet.setRowHeight(top, 12);
		sheet.setRowHeight(top + 1, 16);
		sheet.setRowHeight(top + 2, 12);
	}
	SpreadsheetApp.flush();
}

function ensureColumnsRange(sheet, startCol, count, widthPx) {
	const needCol = startCol + count - 1;
	const lastCol = sheet.getMaxColumns();
	if (lastCol < needCol) sheet.insertColumnsAfter(lastCol, needCol - lastCol);
	for (let c = startCol; c <= needCol; c++) sheet.setColumnWidth(c, widthPx);
}

function ensureRows(sheet, needRow) {
	const lastRow = sheet.getMaxRows();
	if (lastRow < needRow) sheet.insertRowsAfter(lastRow, needRow - lastRow);
}

function pickPrimaryAction(actions) {
	if (!actions || !actions.length) return null;
	let best = actions[0];
	for (const a of actions) if ((a.percent || 0) > (best.percent || 0)) best = a;
	return best;
}

function pickColorForCode(code, answers) {
	if (Array.isArray(answers)) {
		const found = answers.find(a => a.value === code);
		if (found?.color?.value) return found.color.value;
	}
	switch (code) {
		case 'f': return '#E0E0E0';
		case 'c': return '#FFB74D';
		case 'a': return '#4CAF50';
		case 'r': return '#7986CB';
		default:  return '#CCCCCC';
	}
}

function getCombinationLabel(index) {
	return POKER_COMBINATIONS[index] || '';
}
