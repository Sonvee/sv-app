const handler = require('sv-handle-res')

module.exports = {
  _before: function() { // 通用预处理器

  },
  /**
   * 云函数删除云存储文件
   * @param {Object} files 要删除的文件 url 组成的数组
   */
  async deleteCloudFile(files) {
    // token身份安全校验
    const cToken = await handler.checkToken({
      clientInfo: this.getClientInfo(),
      token: this.getUniIdToken(),
      strict: true // 开启严格模式
    })
    if (cToken.code !== 200) {
      return cToken
    }

    const deleteFiles = await uniCloud.deleteFile({
      fileList: files
    })
    return deleteFiles
  }
}