'use strict';
const {
	excelTojson
} = require('ml-excel-to-json');
exports.main = async (event, context) => {
	let data = await excelTojson(event.data, event.sheetList);
	return {
		code: 0,
		data
	}
};
