const handler = require('sv-handler')

const {
  userInfo,
  userList,
  userUpdate,
  userDelete
} = require('./module/user/index.js')

const {
  roleList,
  roleUpdate,
  roleAdd,
  roleDelete,
  userRoleAdd,
  userRoleDelete,
} = require('./module/role/index.js')

const {
  permissionList,
  permissionUpdate,
  permissionAdd,
  permissionDelete,
} = require('./module/permission/index.js')

const {
  logList
} = require('./module/log/index.js')

module.exports = {
  _before: async function() { // 通用预处理器
    const httpInfo = this.getHttpInfo()
    if (!httpInfo) return // 云对象之间调用时无httpInfo处理

    // token身份安全校验
    // 校验白名单
    const WHITE_LIST = []
    // 校验名单
    const API_MODE = {
      '/userInfo': 'easy',
      '/userList': 'strict',
      '/userUpdate': 'easy',
      '/userDelete': 'strict',
      '/roleList': 'easy',
      '/roleUpdate': 'strict',
      '/roleAdd': 'strict',
      '/roleDelete': 'strict',
      '/userRoleAdd': 'easy',
      '/userRoleDelete': 'easy',
      '/permissionList': 'easy',
      '/permissionUpdate': 'strict',
      '/permissionAdd': 'strict',
      '/permissionDelete': 'strict',
      '/logList': 'strict',
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

  /**
   * 用户信息
   */
  userInfo,
  userList,
  userUpdate,
  userDelete,

  /**
   * 角色
   */
  roleList,
  roleUpdate,
  roleAdd,
  roleDelete,
  userRoleAdd,
  userRoleDelete,

  /**
   * 权限
   */
  permissionList,
  permissionUpdate,
  permissionAdd,
  permissionDelete,

  /**
   * 日志
   */
  logList,
}