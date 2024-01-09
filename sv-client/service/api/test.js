import request from '../request/index.js'

export function testList(data) {
	return request({
		url: '/test/testList',
		method: 'POST',
		data
	})
}

export function testEmpty(data) {
	return request({
		url: '/test/testEmpty',
		method: 'POST',
		data
	})
}