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

export function menuAdd(data) {
  return request({
    url: '/sys/menuAdd',
    method: 'POST',
    data
  })
}

export function menuDelete(data) {
  return request({
    url: '/sys/menuDelete',
    method: 'POST',
    data
  })
}

export function menuUpdate(data) {
  return request({
    url: '/sys/menuUpdate',
    method: 'POST',
    data
  })
}

/**
 * 应用
 */

export function appList(data) {
  return request({
    url: '/sys/appList',
    method: 'POST',
    data
  })
}

export function appAdd(data) {
  return request({
    url: '/sys/appAdd',
    method: 'POST',
    data
  })
}

export function appDelete(data) {
  return request({
    url: '/sys/appDelete',
    method: 'POST',
    data
  })
}

export function appUpdate(data) {
  return request({
    url: '/sys/appUpdate',
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