const xlsx = require('../lib/xlsx.style.js');
//excel列转换
const convertDSTo26BS = function(num) {
	var code = '';
	var reg = /^\d+$/g;
	if (!reg.test(num)) {
		return code;
	}
	while (num > 0) {
		m = num % 26
		if (m == 0) {
			m = 26;
		}
		code = String.fromCharCode(64 + parseInt(m)) + code;
		num = (num - m) / 26;
	}
	return code;
}
const convert26BSToDS = function(code) {
	var num = -1;
	var reg = /^[A-Z]+$/g;
	if (!reg.test(code)) {
		return num;
	}
	num = 0;
	for (var i = code.length - 1, j = 1; i >= 0; i--, j *= 26) {
		num += (code[i].charCodeAt() - 64) * j;
	}
	return num;
}
//读取base64xlsx数据
const readXlsx = function(base64, options = []) {
	let result = {};
	let xlsxInfo = xlsx.read(base64);
	const readSheetsIndex = [];
	options.forEach(item => {
		if (item.index === -1) {
			item.index = xlsxInfo.Workbook.WBView[0].activeTab
		}
		readSheetsIndex.push(item.index)
	})
	let sheets = xlsxInfo.Sheets;
	let list = [];
	if (xlsxInfo.Workbook.Sheets.length > 0) {
		for (var i = 0; i < xlsxInfo.Workbook.Sheets.length; i++) {
			const key = xlsxInfo.Workbook.Sheets[i].name
			const currentOption = options.find(item =>{
				return item.autoKey && item.index === i
			})
			let autoKey;
			if(currentOption){
				autoKey = currentOption.autoKey
			}
			if (readSheetsIndex.indexOf(i) === -1) {
				list.push({
					name: key,
					data: []
				})
				continue;
			}
			let sheet = [];
			let item = sheets[key];
			for (let k in item) {
				let ritem = item[k];
				let btn = true
				if (k === '!ref') {
					let strArr = ritem.split(':');
					let startRowIndex = Number(strArr[0].replace(/[^\d]/g, '')) - 1;
					let endRowIndex = Number(strArr[1].replace(/[^\d]/g, '')) - 1;
					let rowsCount = endRowIndex - startRowIndex + 1;
					let startColIndex = 1;
					let endColIndex = 1;
					startColIndex = convert26BSToDS(strArr[0].replace(/[0-9]+/g, ''));
					endColIndex = convert26BSToDS(strArr[1].replace(/[0-9]+/g, ''));
					endColIndex -= 1;
					startColIndex -= 1;
					let colsCount = endColIndex - startColIndex + 1;
					//let sheetArr = [];
					for (var ri = startRowIndex; ri <= endRowIndex; ri++) {
						let row = ri + 1;
						let rowArr = [];
						for (var ci = startColIndex; ci <= endColIndex; ci++) {
							let col = convertDSTo26BS(ci + 1);
							if (item[col + row]) {
								if (item[col + row].t === 's') {
									rowArr.push(item[col + row].v);
								} else if (item[col + row].t === 'n') {
									var reg = /^[0-9,/:-\s]+$/;
									if (!isNaN(Date.parse(new Date(item[col + row].w.replace(/-/g,
											'/')))) && isNaN(
											item[col + row].w) && reg.test(item[col + row].w)) {
										rowArr.push(item[col + row].w);
									} else {
										rowArr.push(item[col + row].v);
									}
								}
							} else {
								if(autoKey && item[col+ Number(currentOption.keysIndex+1)].v === autoKey){
									btn = false
									break;
								}
								rowArr.push('');
							}
						}
						if(btn){
							sheet.push(rowArr);
						}else{
							break;
						}
					}
				}
			}
			list.push({
				name: key,
				data: sheet
			})
		}
		return list
	}
	return []
}


const formatExcelToJsonOptions = function(configArr = []) {
	let defaultConfig = {
		"index": 0,
		"keysIndex": 0,
		"startIndex": 1,
		"endIndex": -1
	}
	if (configArr && configArr.length > 0) {
		return configArr.map(item => {
			return {
				...defaultConfig,
				...item
			}
		})
	} else {
		return [defaultConfig]
	}
}


exports.convertDSTo26BS = convertDSTo26BS
exports.convert26BSToDS = convert26BSToDS
exports.readXlsx = readXlsx
exports.formatExcelToJsonOptions = formatExcelToJsonOptions