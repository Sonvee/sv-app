const handler = require('sv-handle-res')

const {
  menuList,
  menuAdd,
  menuDelete,
  menuUpdate
} = require('./module/menu/index.js')

const {
  appList,
  appAdd,
  appDelete,
  appUpdate
} = require('./module/app/index.js')

const {
  dictList,
  dictAdd,
  dictUpdate,
  dictDelete
} = require('./module/dict/index.js')

module.exports = {
  _before: async function() { // 通用预处理器
    // token身份安全校验
    const WHITE_LIST = [] // 校验白名单，例如'/menuList'
    const apiPath = this.getHttpInfo().path
    // 不是白名单的api需要进行校验
    if (!WHITE_LIST.includes(apiPath)) {
      // 自动判断是否开启严格模式，路径包含List默认不开启，其他诸如Add、Update、Delete等皆开启
      const cToken = await handler.checkToken({
        clientInfo: this.getClientInfo(),
        token: this.getHttpInfo().headers.authorization,
        mode: apiPath.includes('List') ? 'open' : 'strict'
      })
      if (cToken.code !== 200) {
        throw cToken
      }
    }

    this.params = {} // 初始化参数
    this.startTime = Date.now() // 在before内记录开始时间并在this上挂载，以供后续流程使用
    // 使用 content-type: application/json 的请求头，参数在body中
    const body = this.getHttpInfo().body
    this.params = JSON.parse(body)
  },
  _after(error, result) {
    if (error) {
      throw error // 如果方法抛出错误，也直接抛出不处理
    }
    result.timeCost = Date.now() - this.startTime
    return result
  },

  /**
   * 系统菜单
   */
  menuList,
  menuAdd,
  menuDelete,
  menuUpdate,

  /**
   * 应用管理
   */
  appList,
  appAdd,
  appDelete,
  appUpdate,

  /**
   * 字典管理
   */
  dictList,
  dictAdd,
  dictUpdate,
  dictDelete

}