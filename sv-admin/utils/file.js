import { importToJson, exportToExcel } from '@/uni_modules/sv-excel-json-each/jssdk/parseExcel.js'

/**
 * 
 */

function logFileFormat() {

}

/**
 * 日志导出
 * @param {Object} dataSource 接口原数据
 */
export function logExport(dataSource) {
  console.log('logExport', dataSource)

  const data = [{
      uid: '1',
      nickname: '昵称1'
    },
    {
      uid: '2',
      nickname: '昵称2'
    }
  ]
  exportToExcel({
    params: {
      data,
      title: 'logs',
      mapping: {
        uid: "用户id",
        nickname: '用户昵称'
      },
      type: 'file',
      // merges: [{ start: [0, 1], end: [0, 4] }]
    },
    autoDownload: true,
  }).then((res) => {
    console.log('onExport ===>', res)
  })
}

/**
 * 导入
 */
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