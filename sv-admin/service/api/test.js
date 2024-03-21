import request from '../request/index.js'

export function testList(data) {
	return request({
		url: '/test/testList',
		method: 'POST',
		data
	})
}

export function testAdd(data) {
	return request({
		url: '/test/testAdd',
		method: 'POST',
		data
	})
}

export function testUpdate(data) {
	return request({
		url: '/test/testUpdate',
		method: 'POST',
		data
	})
}

export function testDelete(data) {
	return request({
		url: '/test/testDelete',
		method: 'POST',
		data
	})
}

export function statList(data) {
	return request({
		url: '/test/statList',
		method: 'POST',
		data
	})
}

export function statEmpty(data) {
	return request({
		url: '/test/statEmpty',
		method: 'POST',
		data
	})
}
