const handler = require('sv-handler')

const {
  vipList,
  vipUpdate,
  vipAdd,
  vipDelete,
  vipValidUpdate,
  vipVerify,
  vipVerifyAuto,
} = require('./module/vip/index.js')

const {
  cdkeyList,
  cdkeyUpdate,
  cdkeyAdd,
  cdkeyDelete,
  cdkeyActive,
} = require('./module/cdkey/index.js')

const {
  subscriptionList,
  subscriptionAdd,
} = require('./module/subscription/index.js')

module.exports = {
  _before: async function() { // 通用预处理器
    const httpInfo = this.getHttpInfo()
    if (!httpInfo) return // 云对象之间调用时无httpInfo处理

    // token身份安全校验
    const WHITE_LIST = ['/vipList', '/cdkeyActive', '/vipVerify', '/subscriptionList'] // 校验白名单
    const apiPath = httpInfo.path
    const cToken = await handler.checkToken({
      clientInfo: this.getClientInfo(),
      token: httpInfo.headers.authorization,
      mode: WHITE_LIST.includes(apiPath) ? 'easy' : 'strict'
    })
    if (cToken.code !== 200) {
      throw cToken
    }

    this.params = {} // 初始化参数
    this.startTime = Date.now() // 在before内记录开始时间并在this上挂载，以供后续流程使用
    // 使用 content-type: application/json 的请求头，参数在body中
    const body = httpInfo.body
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
   * 会员套餐
   */
  vipList,
  vipUpdate,
  vipAdd,
  vipDelete,
  vipValidUpdate,
  vipVerify,
  vipVerifyAuto,

  /**
   * cdkey
   */
  cdkeyList,
  cdkeyUpdate,
  cdkeyAdd,
  cdkeyDelete,
  cdkeyActive,

  /**
   * 订阅
   */
  subscriptionList,
  subscriptionAdd
}