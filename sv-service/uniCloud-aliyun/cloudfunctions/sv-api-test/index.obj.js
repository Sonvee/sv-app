const handler = require('sv-handle-res')

module.exports = {
  _before: async function() { // 通用预处理器
    // token身份安全校验
    const WHITE_LIST = [] // 校验白名单，例如'/testList'
    const apiPath = this.getHttpInfo().path
    // 不是白名单的api需要进行校验
    if (!WHITE_LIST.includes(apiPath)) {
      const cToken = await handler.checkToken({
        clientInfo: this.getClientInfo(),
        token: this.getHttpInfo().headers.authorization,
        mode: 'open'
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
   * 长列表测试
   * pagesize: 每页显示数量，默认10，-1时返回所有数据
   * pagenum: 页码，默认1
   */
  testList() {
    let list = []
    for (let i = 1; i <= 100; i++) {
      list.push({
        text: `第${i}个`,
        value: i
      })
    }

    return handler.paging({
      data: list,
      params: this.params
    })
  },
  /**
   * 空数据测试
   * pagesize: 每页显示数量，默认10，-1时返回所有数据
   * pagenum: 页码，默认1
   */
  testEmpty() {
    return handler.paging({
      data: [],
      params: this.params,
    })
  }
}