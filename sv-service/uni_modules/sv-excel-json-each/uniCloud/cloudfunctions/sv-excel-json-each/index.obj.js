const { excelTojson, jsonToexcel } = require('sv-excel-json-handler');

module.exports = {
  _before: function() { // 通用预处理器

  },
  async getExcelToJson(param) {
    let data = await excelTojson(param.data, param.sheetList);
    return {
      code: 0,
      data
    }
  },
  async getJsonToExcel(param) {
    let data = await jsonToexcel(param);
    return {
      code: 0,
      data
    }
  }
}