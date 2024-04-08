import request from '../request/index.js'

/**
 * 字典
 */
export function dictList(data) {
  return request({
    url: '/sys/dictList',
    method: 'POST',
    data
  })
}

/**
 * 反馈
 */
export function feedbackList(data) {
  return request({
    url: '/sys/feedbackList',
    method: 'POST',
    data
  })
}

export function feedbackAdd(data) {
  return request({
    url: '/sys/feedbackAdd',
    method: 'POST',
    data
  })
}

export function feedbackUpdate(data) {
  return request({
    url: '/sys/feedbackUpdate',
    method: 'POST',
    data
  })
}

export function feedbackDelete(data) {
  return request({
    url: '/sys/feedbackDelete',
    method: 'POST',
    data
  })
}