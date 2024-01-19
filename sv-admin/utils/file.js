import { importToJson, exportToExcel } from '@/uni_modules/sv-excel-json-each/jssdk/parseExcel.js'

// 日志导出
export function logExport(dataSource) {
  console.log('logExport', dataSource)

  const data = [{
      id: '1',
      name: 'test'
    },
    {
      id: '3',
      name: 'hello3'
    }
  ]
  exportToExcel({
    params: {
      data,
      title: 'hello test',
      mapping: { name: '姓名' },
      type: 'file',
      merges: [{ start: [0, 1], end: [0, 4] }]
    },
    autoDownload: true,
    fileName: 'hello world'
  }).then((res) => {
    console.log('onExport ===>', res)
  })
}

export function logImport() {
  let sheetList = [{
      index: 0,
      keys: ['姓名', '电话', '姓名1'],
      keysIndex: 0,
      startIndex: 1,
      endIndex: 8
    },
    {
      index: 0,
      keys: ['姓名1', '电话2'],
      keysIndex: 0,
      startIndex: 1,
      endIndex: -1
    }
  ]
  importToJson(sheetList).then((res) => {
    console.log('onImport notapp ===>', res)
  })
}