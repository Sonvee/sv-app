const chunk = require('lodash.chunk')
const uniIdCo = require('uni-id-common')

/**
 * 客户端分页处理 - 较多数据请使用服务端分页代替
 * data: 数据源
 * pagesize: 每页数据条数
 * pagenum: 页码
 * pages: 页数
 * total: 数据个数
 * code: 状态码
 * success: 是否成功，默认成功
 * querytime: 查询时间（当前时间戳）
 */
function paging(params) {
  const res = Object.assign({
    data: null,
    pages: 1,
    total: 0,
    code: 200,
    success: true,
  }, params)
  res.pagesize = +params.params.pagesize || 20
  res.pagenum = +params.params.pagenum || 1

  if (Array.isArray(res.data)) {
    let chunklist = []
    res.total = res.data.length
    // pagesize >=1 则进行分页处理，否则展示全部数据
    if (res.pagesize >= 1) {
      // 取页数据，先根据pagesize分二维数组
      chunklist = chunk(res.data, res.pagesize)
      // 页数为数组长度
      res.pages = chunklist.length
      // 页码大于页数或小于1时返回空数组
      if (res.pagenum < 1 || res.pagenum > res.pages) {
        res.data = []
      } else {
        res.data = chunklist[res.pagenum - 1]
      }
    } else {
      // pagesize < 1 时，页码和页数恒为一，展示全部数据
      res.pagenum = 1
      res.pages = 1
    }
  } else {
    // data不为数组时，不进行分页处理
    delete res.pagesize
    delete res.pagenum
    delete res.pages
    delete res.total
  }

  // 若没有主动给message，则走默认codeMap中消息提示
  if (!res.message) {
    res.message = codeMap[res.code]
  }
  // code以0或2开头则success默认为true，否则为false
  res.success = String(res.code).startsWith("0") || String(res.code).startsWith("2")

  res.querytime = Date.now()

  return res
}


const codeMap = {
  200: "Request Success",
  400: "Request Failed",
  40001: "Params Error",
  40002: "No Data",
  401: "Unauthorized",
  403: "Forbidden",
  404: "404 Not Found",
}

/**
 * 请求失败数据统一处理
 * errCode: 错误状态码
 * errMsg / message: 错误状态信息
 * success: 是否成功，默认失败
 * querytime: 查询时间（当前时间戳）
 */
const resultParams = {
  data: null,
  code: 200,
  success: true,
}

function result(params) {
  const res = Object.assign({
    ...resultParams
  }, params)

  // 若没有主动给message，则走默认codeMap中消息提示
  if (!res.message) {
    res.message = codeMap[res.code]
  }

  // code以0或2开头则success默认为true，否则为false
  res.success = String(res.code).startsWith("0") || String(res.code).startsWith("2")

  res.querytime = Date.now()

  return res
}

/**
 * token校验 - 接口安全处理，身份验证之后才能请求访问数据
 * @param {Object} options 必传属性: clientInfo:this.getClientInfo(), token:'用户token' 可选参数: strict严格模式 默认false
 * @return {Object} {code:0,errCode:0,errMsg,exp:过期时间,iat:创建时间,permission,role,uid}
 * @todo 最好是将http的statusCode状态码手动改为401
 */
async function checkToken(options) {
  const {
    clientInfo,
    token,
    strict = false // 严格模式
  } = options
  const uniIdCommon = uniIdCo.createInstance({
    clientInfo
  })
  const result = await uniIdCommon.checkToken(token)
  // token过期，需要转换为秒数对比
  if (result.exp < Date.now() / 1000) {
    return {
      code: 401,
      message: "Unauthorized Token已过期",
      token,
      result
    }
  }
  // token校验失败：没有token、错误token
  if (result.errCode !== 0) {
    return {
      code: 401,
      message: "Unauthorized Token校验失败",
      token,
      result
    }
  }
  /**
   * 角色校验 - 规则：
   * 1. admin拥有所有权限
   */
  if (result.role.includes('admin')) {
    return {
      code: 200,
      message: "Token角色校验成功",
      token,
      result
    }
  }
  /**
   * 权限校验 - 规则：
   * 1. API_READ只读 < API_WRITE读写
   * 2. 开启strict严格模式的接口，必须拥有API_WRITE可读写权限才能访问
   */
  if (strict && !result.permission.includes('API_WRITE')) {
    return {
      code: 403,
      message: "Token权限校验 非法请求",
      token,
      result
    }
  }
  if (result.permission.includes('API_WRITE')) {
    return {
      code: 200,
      message: "Token权限校验 读写",
      token,
      result
    }
  }
  if (result.permission.includes('API_READ')) {
    return {
      code: 200,
      message: "Token权限校验 只读",
      token,
      result
    }
  }
  // 其他情况均未授权
  return {
    code: 403,
    message: "Unauthorized 未授权",
    token,
    result
  }
}

module.exports = {
  paging,
  result,
  checkToken
}