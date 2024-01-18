'use strict';
const {
	jsonToexcel
} = require('ml-excel-to-json');
exports.main = async (event, context) => {
	let data = await jsonToexcel(event);
	return {
		code: 0,
		data
	}
};
