import pickFile from './plusFilePicker.js'

async function urlToBase64(url) {
  // 注意url必须为http或者https协议路径，本地file路径不行
  let res = await uni.request({
    url: url,
    method: 'GET',
    responseType: 'arraybuffer'
  });
  // 容错处理
  if (Array.isArray(res)) {
    res = res.find(item => item && item.data)
  }
  let base64 = uni.arrayBufferToBase64(res.data); //把arraybuffer转成base64
  return base64
}

/**
 * 文件选择 表格文件导入 返回表格数据
 * @param callback 为了兼容安卓文件选择，此处使用callback回调来接受解析后的json参数，其他平台勿使用该回调
 */
export async function importToJson(sheetList = [], callback) {
  // #ifdef H5
  let fileRes = await uni.chooseFile({
    count: 1,
    extension: ['.xls', '.xlsx']
  });
  // fileRes可能是单对象，也可能是数组且数组中存在某项为null的情况，需要容错处理以取出真实文件数据对象
  if (Array.isArray(fileRes)) {
    fileRes = fileRes.find(item => item && item.tempFilePaths.length > 0)
  }
  const filePath = fileRes.tempFilePaths[0]
  return await fileToJson(filePath, sheetList)
  // #endif

  // #ifdef MP-WEIXIN
  const fileRes = await wx.chooseMessageFile({
    count: 1,
    type: 'file',
    extension: ['.xls', '.xlsx']
  })
  const filePath = fileRes.tempFiles[0].path
  return await fileToJson(filePath, sheetList)
  // #endif

  // #ifdef APP
  switch (plus.os.name) {
    case "Android":
      // Android平台: plus.android.*  
      // 安卓需要先使用Native.js进行文件选择，上传文件后再进行解析
      pickFile.PickFile(async (src) => {
        let srcPath = 'file://' + src;
        console.log('==== srcPath :', srcPath);
        const upRes = await uniCloud.uploadFile({
          filePath: srcPath,
          // 同名会导致报错 policy_does_not_allow_file_overwrite
          // cloudPath可由 想要存储的文件夹/文件名 拼接，若不拼文件夹名则默认存储在cloudstorage文件夹中
          cloudPath: `cloudstorage/${Date.now()}`,
          cloudPathAsRealPath: true
        })
        console.log('==== upRes :', upRes);
        const filePath = upRes.fileID
        callback(await fileToJson(filePath, sheetList))
      });
      break;
    case "iOS":
      // iOS平台: plus.ios.*  
      break;
    default:
      // 其它平台  
      break;
  }
  // #endif
}
/**
 * 表格文件导入 返回表格数据
 */
async function fileToJson(path, sheetList) {
  const base = await urlToBase64(path);
  const eachObj = uniCloud.importObject('sv-excel-json-each')
  const dataRes = await eachObj.getExcelToJson({
    data: base,
    sheetList
  })
  return dataRes
}

/**
 * 数据导出 返回表格文件下载
 * @param {Object} options
 * 注：file文件模式可自动下载并返回文件下载路径，base64模式不提供自动下载并直接返回base64字串
 */
export async function exportToExcel(options) {
  const eachObj = uniCloud.importObject('sv-excel-json-each')
  const dataRes = await eachObj.getJsonToExcel(options.params)
  if (dataRes.code == 0) {
    if (options.autoDownload && options.params.type == 'file') {
      /**
       * 下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
       * 注意：在HbuilderX内置浏览器中无法正常运行
       * @tutorial https://uniapp.dcloud.net.cn/api/request/network-file.html#downloadfile
       */
      uni.downloadFile({
        url: dataRes.data,
        success: (res) => {
          uni.openDocument({
            filePath: res.tempFilePath,
            showMenu: true,
          });
        }
      })
    }
  } else {
    console.error('==== dataRes :', dataRes);
  }

  return dataRes.data
}