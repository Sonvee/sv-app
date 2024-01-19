const xlsx = require('./lib/xlsx.style.js');
const {
	convertDSTo26BS,
	convert26BSToDS,
	readXlsx,
	formatExcelToJsonOptions
} = require('./util/index.js')
module.exports = {
	excelToarray: async function(base64) {
		return readXlsx(base64);
	},
	excelTojson: async function() {
		const args = arguments
		let base64 = args[0],options = formatExcelToJsonOptions(args[1]);
		const sheetList = readXlsx(base64, options);
		let data = [],
			allKeys = [];
		options.forEach(sheetItem => {
			let keys = [];
			try {
				if (sheetItem.keys && sheetItem.keys.length > 0) {
					keys = sheetItem.keys;
					allKeys = allKeys.concat(keys);
				} else {
					keys = sheetList[sheetItem.index].data.find((item, rowIndex) => {
						return rowIndex === sheetItem.keysIndex;
					});
					allKeys = keys;
				}
				sheetList[sheetItem.index].data.forEach((rowItem, rowIndex) => {
					if (rowIndex < sheetItem.startIndex) return false;
					if (rowIndex > sheetItem.endIndex && sheetItem.endIndex !== -1)
						throw new Error('end forEach');
					let obj = {};
					rowItem.forEach((colItem, colIndex) => {
						if (keys[colIndex]) {
							obj[keys[colIndex]] = colItem;
						}
					})
					data.push(obj)
				})
			} catch (e) {
				//throw new Error(e);
			}
		})
		let set = new Set(allKeys);
		allKeys = Array.from(set);
		return {
			keys: allKeys,
			data,
			sheetListName: sheetList.map(item => {
				return item.name
			})
		}
	},
	jsonToexcel: async function() {
		let data = [],
			options = {
				title: "未命名",
				mapping: {},
				type: "base64",
				merges: [],
				appendHeaderData: []
			}
		const args = arguments
		if (args.length === 5) {
			data = args[0]
			options = {
				...options,
				...args[4]
			}
			options.title = args[1]
			options.mapping = args[2]
			options.type = args[3]
		} else if (args.length === 2) {
			data = args[0]
			options = {
				...options,
				...args[1]
			}
		} else if (args.length === 1) {
			data = args[0].data
			options = {
				...options,
				...args[0]
			}
		}
		let {
			title,
			mapping,
			type,
			merges,
			appendHeaderData
		} = options
		if (data.length === 0) return {
			code: 'no data'
		};
		let header = [];
		for (let key in data[0]) {
			if (!mapping[key]) {
				mapping[key] = key;
			}
			header.push(key);
		}

		let newData = [mapping, ...data];
		if (appendHeaderData && appendHeaderData.length > 0) {
			newData.unshift(...appendHeaderData)
		}
		const worksheet = xlsx.utils.json_to_sheet(newData, {
			header: header,
			skipHeader: true
		});
		var workbook = xlsx.utils.book_new();
		worksheet['!merges'] = options.merges.map(item => {
			return {
				s: {
					r: item.start[0],
					c: item.start[1]
				},
				e: {
					r: item.end[0],
					c: item.end[1]
				}
			}
		})
		xlsx.utils.book_append_sheet(workbook, worksheet, "sheet1");
		let xlsxData = xlsx.write(workbook, {
			type: "base64"
		});
		if (type === 'file') {
			xlsxData = await uniCloud.uploadFile({
				cloudPath: title + '.xlsx',
				fileContent: new Buffer(xlsxData, 'base64')
			});
			xlsxData = xlsxData.fileID;
		} else if (type === 'base64') {
			xlsxData = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
				xlsxData;
		}
		return xlsxData
	}
}