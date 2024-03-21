import request from '../request/index.js'

/**
 * VIP套餐
 * @param {Object} data
 */
export function vipList(data) {
  return request({
    url: '/vip/vipList',
    method: 'POST',
    data
  })
}

export function vipAdd(data) {
  return request({
    url: '/vip/vipAdd',
    method: 'POST',
    data
  })
}

export function vipDelete(data) {
  return request({
    url: '/vip/vipDelete',
    method: 'POST',
    data
  })
}

export function vipUpdate(data) {
  return request({
    url: '/vip/vipUpdate',
    method: 'POST',
    data
  })
}

/**
 * 用户会员验证 实时事件驱动：建议在用户访问特定接口、页面、登录时等情况触发检查
 * @param {Object} data {user_id}
 */
export function vipVerify(data) {
  return request({
    url: '/vip/vipVerify',
    method: 'POST',
    data
  })
}


/**
 * vip支付订阅
 * @param {Object} data {user_id, plan_id, pay_fee}
 */
export function vipPayActive(data) {
  return request({
    url: '/vip/vipPayActive',
    method: 'POST',
    data,
  })
}

/**
 * 激活码
 * @param {Object} data
 */
export function cdkeyList(data) {
  return request({
    url: '/vip/cdkeyList',
    method: 'POST',
    data
  })
}

export function cdkeyAdd(data) {
  return request({
    url: '/vip/cdkeyAdd',
    method: 'POST',
    data
  })
}

export function cdkeyDelete(data) {
  return request({
    url: '/vip/cdkeyDelete',
    method: 'POST',
    data
  })
}

/**
 * cdkey激活
 * @param {Object} data {user_id, cdkey}
 */
export function cdkeyActive(data) {
  return request({
    url: '/vip/cdkeyActive',
    method: 'POST',
    data,
  })
}

/**
 * cdkey状态校验 可定时自动校验 也可手动调用执行
 */
export function cdkeyVerifyAuto(data) {
  return request({
    url: '/vip/cdkeyVerifyAuto',
    method: 'POST',
    data,
  })
}

/**
 * cdkey一键失效移除
 */
export function cdkeyInvalidRemove(data) {
  return request({
    url: '/vip/cdkeyInvalidRemove',
    method: 'POST',
    data,
  })
}

/**
 * 会员权益
 * @param {Object} data
 */
export function benefitList(data) {
  return request({
    url: '/vip/benefitList',
    method: 'POST',
    data
  })
}

export function benefitAdd(data) {
  return request({
    url: '/vip/benefitAdd',
    method: 'POST',
    data
  })
}

export function benefitUpdate(data) {
  return request({
    url: '/vip/benefitUpdate',
    method: 'POST',
    data
  })
}

export function benefitDelete(data) {
  return request({
    url: '/vip/benefitDelete',
    method: 'POST',
    data
  })
}

/**
 * 订阅记录
 * @param {Object} data {user_id, mode, start_date}
 */
export function subscriptionList(data) {
  return request({
    url: '/vip/subscriptionList',
    method: 'POST',
    data,
  })
}

export function subscriptionDelete(data) {
  return request({
    url: '/vip/subscriptionDelete',
    method: 'POST',
    data,
  })
}