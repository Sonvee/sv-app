import { excelToData, dataToExcel } from '@/uni_modules/sv-excel-to-json/jssdk/parseExcel.js'

// 日志导出
export function logExport(dataSource) {
  console.log('logExport', dataSource)

  const data = [{
    id: "1",
    name: "test"
  }, {
    id: "2",
    name: "hello3"
  }]

  dataToExcel('getJsonToExcel', {
      params: {
        data,
        title: 'Hello',
        mapping: { name: "姓名" },
        type: 'file',
        merges: [{ start: [0, 1], end: [0, 4] }]
      },
      autoDownload: true,
      fileName: 'hello'
    })
    .then(res => {
      console.log('dataToExcel', res)
    })
}