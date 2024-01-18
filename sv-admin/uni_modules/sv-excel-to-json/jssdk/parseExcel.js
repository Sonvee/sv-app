async function urlTobase64(url) {
  const res = await uni.request({
    url: url,
    method: 'GET',
    responseType: 'arraybuffer'
  });
  const tempBlob = res.find(item => {
    return item && item.data
  })
  let base64 = uni.arrayBufferToBase64(tempBlob.data); //把arraybuffer转成base64
  return base64
}

export function base64ToPath(base64) {
  return new Promise(function(resolve, reject) {
    if (typeof window === 'object' && 'document' in window) {
      base64 = base64.split(',')
      var type = base64[0].match(/:(.*?);/)[1]
      var str = atob(base64[1])
      var n = str.length
      var array = new Uint8Array(n)
      while (n--) {
        array[n] = str.charCodeAt(n)
      }
      return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([array], { type: type })))
    }
    var extName = base64.split(',')[0].match(/data\:\S+\/(\S+);/)
    if (extName) {
      extName = extName[1]
    } else {
      reject(new Error('base64 error'))
    }
    var fileName = getNewFileId() + '.' + extName
    if (typeof plus === 'object') {
      var basePath = '_doc'
      var dirPath = 'uniapp_temp'
      var filePath = basePath + '/' + dirPath + '/' + fileName
      if (!biggerThan(plus.os.name === 'Android' ? '1.9.9.80627' : '1.9.9.80472', plus.runtime.innerVersion)) {
        plus.io.resolveLocalFileSystemURL(basePath, function(entry) {
          entry.getDirectory(dirPath, {
            create: true,
            exclusive: false,
          }, function(entry) {
            entry.getFile(fileName, {
              create: true,
              exclusive: false,
            }, function(entry) {
              entry.createWriter(function(writer) {
                writer.onwrite = function() {
                  resolve(filePath)
                }
                writer.onerror = reject
                writer.seek(0)
                writer.writeAsBinary(dataUrlToBase64(base64))
              }, reject)
            }, reject)
          }, reject)
        }, reject)
        return
      }
      var bitmap = new plus.nativeObj.Bitmap(fileName)
      bitmap.loadBase64Data(base64, function() {
        bitmap.save(filePath, {}, function() {
          bitmap.clear()
          resolve(filePath)
        }, function(error) {
          bitmap.clear()
          reject(error)
        })
      }, function(error) {
        bitmap.clear()
        reject(error)
      })
      return
    }
    if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
      var filePath = wx.env.USER_DATA_PATH + '/' + fileName
      wx.getFileSystemManager().writeFile({
        filePath: filePath,
        data: dataUrlToBase64(base64),
        encoding: 'base64',
        success: function() {
          resolve(filePath)
        },
        fail: function(error) {
          reject(error)
        }
      })
      return
    }
    reject(new Error('not support'))
  })
}

async function downloadXLSX(source, options) {
  // #ifdef H5
  window.open(source)
  // #endif

  // #ifndef H5
  if (options.type == 'base64') {
    base64ToPath(source).then((path) => {
      uni.openDocument({ filePath: path })
    })
  } else if (options.type == 'file') {
    uni.openDocument({ filePath: source })
  }
  // #endif

  return source
}
/*
 * name 云函数名
 * sheetList []
 */
export const excelToData = async function(name, sheetList = []) {
  const res = await uni.chooseFile({
    count: 1,
    extension: ['.xls', '.xlsx']
  });
  const tempFile = res.find(item => {
    return item && item.tempFilePaths.length > 0
  })
  const base = await urlTobase64(tempFile.tempFilePaths[0]);
  const file = await uniCloud.callFunction({
    name: name,
    data: {
      data: base,
      sheetList
    }
  })
  return file
}

/*
 * name 云函数名
 * options Object {parmas,autoDownload,fileName}
 */
export const dataToExcel = async function(name, options) {
  const res = await uniCloud.callFunction({
    name: name,
    data: options.params
  })
  if (options.autoDownload) {
    return await downloadXLSX(res.result.data, {
      fileName: options.fileName,
      type: options.params.type
    })
  } else {
    return res.result
  }
}