const handler = require('sv-handler')

const {
  vipList,
  vipUpdate,
  vipAdd,
  vipDelete,
  vipPayActive,
  vipValidUpdate,
  vipVerify,
  vipVerifyAuto,
} = require('./module/vip/index.js')

const {
  benefitList,
  benefitUpdate,
  benefitAdd,
  benefitDelete,
} = require('./module/benefit/index.js')

const {
  cdkeyList,
  cdkeyUpdate,
  cdkeyAdd,
  cdkeyDelete,
  cdkeyActive,
  cdkeyVerifyAuto,
  cdkeyInvalidRemove
} = require('./module/cdkey/index.js')

const {
  subscriptionList,
  subscriptionAdd,
  subscriptionDelete
} = require('./module/subscription/index.js')

module.exports = {
  _before: async function() { // 通用预处理器
    const httpInfo = this.getHttpInfo()
    if (!httpInfo) return // 云对象之间调用时无httpInfo处理

    // token身份安全校验
    // 校验白名单
    const WHITE_LIST = []
    // 校验名单
    const API_MODE = {
      '/vipList': 'open',
      '/vipUpdate': 'strict',
      '/vipAdd': 'strict',
      '/vipDelete': 'strict',
      '/vipPayActive': 'open',
      '/vipValidUpdate': 'easy',
      '/vipVerify': 'open',
      '/vipVerifyAuto': 'easy',
      '/benefitList': 'open',
      '/benefitUpdate': 'strict',
      '/benefitAdd': 'strict',
      '/benefitDelete': 'strict',
      '/cdkeyList': 'strict',
      '/cdkeyUpdate': 'strict',
      '/cdkeyAdd': 'strict',
      '/cdkeyDelete': 'strict',
      '/cdkeyActive': 'open',
      '/cdkeyVerifyAuto': 'strict',
      '/cdkeyInvalidRemove': 'strict',
      '/subscriptionList': 'open',
      '/subscriptionAdd': 'strict',
      '/subscriptionDelete': 'strict',
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
  _timing: function(param) {
    /**
     * 阿里云入参param
     * {
     *  "triggerName": "TIMER_LATEST", //触发云函数的定时器配置内容，注意阿里云不会使用package.json内配置的触发器名称
     *  "triggerTime": "2020-04-08T10:22:31Z", //触发云函数时的时间戳，可能略晚于cron表达式时间
     *  "Time":"2020-04-08T10:22:31Z", //调用的云函数的时间
     *  "TriggerName":"TIMER_LATEST", //触发器名
     *  "Type":"Timer" //触发器类型，目前只有Timer
     *  }
     * 
     * 定时刷新库中所有vip角色是否过期，需配置corn
     * @tutorial https://doc.dcloud.net.cn/uniCloud/trigger.html
     */
    try {
      vipVerifyAuto()
    } catch (err) {
      console.log('自动验证VIP角色错误:', err);
    }

    try {
      cdkeyVerifyAuto()
    } catch (err) {
      console.log('自动验证CDKEY状态错误:', err);
    }
  },

  /**
   * 会员套餐
   */
  vipList,
  vipUpdate,
  vipAdd,
  vipDelete,
  vipPayActive,
  vipValidUpdate,
  vipVerify,
  vipVerifyAuto,

  /**
   * 会员权益
   */
  benefitList,
  benefitUpdate,
  benefitAdd,
  benefitDelete,

  /**
   * cdkey
   */
  cdkeyList,
  cdkeyUpdate,
  cdkeyAdd,
  cdkeyDelete,
  cdkeyActive,
  cdkeyVerifyAuto,
  cdkeyInvalidRemove,

  /**
   * 订阅
   */
  subscriptionList,
  subscriptionAdd,
  subscriptionDelete
}