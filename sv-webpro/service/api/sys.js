import request from '../request/index.js'

/**
 * 菜单
 */

export function menuList(data) {
  return request({
    url: '/sys/menuList',
    method: 'POST',
    data
  })
}


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

export function dictAdd(data) {
  return request({
    url: '/sys/dictAdd',
    method: 'POST',
    data
  })
}

export function dictDelete(data) {
  return request({
    url: '/sys/dictDelete',
    method: 'POST',
    data
  })
}

export function dictUpdate(data) {
  return request({
    url: '/sys/dictUpdate',
    method: 'POST',
    data
  })
}