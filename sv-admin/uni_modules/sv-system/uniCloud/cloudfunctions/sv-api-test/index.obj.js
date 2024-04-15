const handler = require('sv-handler')

const {
  testList,
  testAdd,
  testAddList,
  testUpdate,
  testDelete,
} = require('./module/test/index.js')

const {
  statList,
  statEmpty,
} = require('./module/stat/index.js')

module.exports = {
  _before: async function() { // 通用预处理器
    // token身份安全校验
    const WHITE_LIST = [] // 校验白名单，例如'/testList'
    // 校验名单 open easy normal strict
    const API_MODE = {
      '/testList': 'open',
      '/testAdd': 'open',
      '/testAddList': 'open',
      '/testUpdate': 'open',
      '/testDelete': 'open',
      '/statList': 'open',
      '/statEmpty': 'open',
    }
    const apiPath = this.getHttpInfo().path
    // 不是白名单的api需要进行校验
    if (!WHITE_LIST.includes(apiPath)) {
      const cToken = await handler.checkToken({
        clientInfo: this.getClientInfo(),
        token: this.getHttpInfo().headers.authorization,
        mode: API_MODE[apiPath]
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
   * 测试用例
   */
  testList,
  testAdd,
  testAddList,
  testUpdate,
  testDelete,

  /**
   * 静态统计测试用例
   */
  statList,
  statEmpty,
}