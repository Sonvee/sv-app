import request from '../request/index.js'

/**
 * 用户
 */
export function userInfo(data) {
  return request({
    url: '/svid/userInfo',
    method: 'POST',
    data
  })
}

export function userList(data) {
  return request({
    url: '/svid/userList',
    method: 'POST',
    data
  })
}

export async function userAdd(data) {
  return await uniCloud.importObject('uni-id-co').addUser({
    username: data.username,
    nickname: data.nickname,
    password: data.password,
    authorizedApp: data.dcloud_appid,
    role: data.role,
    mobile: data.mobile,
    email: data.email,
    tags: data.tags,
    status: data.status
  })
}

export function userDelete(data) {
  return request({
    url: '/svid/userDelete',
    method: 'POST',
    data
  })
}

export function userUpdate(data) {
  return request({
    url: '/svid/userUpdate',
    method: 'POST',
    data
  })
}


/**
 * 角色
 */
export function roleList(data) {
  return request({
    url: '/svid/roleList',
    method: 'POST',
    data
  })
}

export function roleUpdate(data) {
  return request({
    url: '/svid/roleUpdate',
    method: 'POST',
    data
  })
}

export function roleAdd(data) {
  return request({
    url: '/svid/roleAdd',
    method: 'POST',
    data
  })
}

export function roleDelete(data) {
  return request({
    url: '/svid/roleDelete',
    method: 'POST',
    data
  })
}

/**
 * 权限
 */
export function permissionList(data) {
  return request({
    url: '/svid/permissionList',
    method: 'POST',
    data
  })
}

export function permissionUpdate(data) {
  return request({
    url: '/svid/permissionUpdate',
    method: 'POST',
    data
  })
}

export function permissionAdd(data) {
  return request({
    url: '/svid/permissionAdd',
    method: 'POST',
    data
  })
}

export function permissionDelete(data) {
  return request({
    url: '/svid/permissionDelete',
    method: 'POST',
    data
  })
}
