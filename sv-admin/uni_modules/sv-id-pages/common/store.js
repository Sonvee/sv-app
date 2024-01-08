import pagesJson from '@/pages.json'
import config from '@/uni_modules/sv-id-pages/config.js'

const uniIdCo = uniCloud.importObject("uni-id-co")
const db = uniCloud.database();
const usersTable = db.collection('uni-id-users')

// storage缓存的键名保留uni-id-pages前缀，下同
let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo')||{}
// console.log( hostUserInfo);
const data = {
	userInfo: hostUserInfo,
	hasLogin: Object.keys(hostUserInfo).length != 0
}

// console.log('data', data);
// 定义 mutations, 修改属性
export const mutations = {
	// data不为空，表示传递要更新的值(注意不是覆盖是合并),什么也不传时，直接查库获取更新
	async updateUserInfo(data = false) {
		if (data) {
			const updateRes = await usersTable.where('_id==$env.uid').update(data)
			
			if (updateRes.result.updated) {
				uni.showToast({
					title: "更新成功",
					icon: 'none',
					duration: 3000
				});
				this.setUserInfo(data)
				// 头像更新后，更新本地完整信息
				this.setCompleteInfo()
			} else {
				uni.showToast({
					title: "没有改变",
					icon: 'none',
					duration: 3000
				});
			}

		} else {
			const uniIdCo = uniCloud.importObject("uni-id-co", {
				customUI: true
			})
			try {
				let res = await usersTable.where("'_id' == $cloudEnv_uid")
					.field('mobile,nickname,username,email,avatar_file')
					.get()

				const realNameRes = await uniIdCo.getRealNameInfo()

				// console.log('fromDbData',res.result.data);
				this.setUserInfo({
					...res.result.data[0],
					realNameAuth: realNameRes
				})
				// 头像更新后，更新本地完整信息
				this.setCompleteInfo()
			} catch (e) {
				this.setUserInfo({},{cover:true})
				console.error(e.message, e.errCode);
			}
		}
	},
	async setUserInfo(data, {cover}={cover:false}) {
		// console.log('set-userInfo', data);
		let userInfo = cover?data:Object.assign(store.userInfo,data)
		store.userInfo = Object.assign({},userInfo)
		store.hasLogin = Object.keys(store.userInfo).length != 0
		// console.log('store.userInfo', store.userInfo);
		uni.setStorageSync('uni-id-pages-userInfo', store.userInfo)
		return data
	},
	async logout() {
		// 1. 已经过期就不需要调用服务端的注销接口	2.即使调用注销接口失败，不能阻塞客户端
		if(uniCloud.getCurrentUserInfo().tokenExpired > Date.now()){
			try{
				await uniIdCo.logout()
			}catch(e){
				console.error(e);
			}
		}
		uni.removeStorageSync('uni_id_token');
		uni.setStorageSync('uni_id_token_expired', 0)
		uni.redirectTo({
			url: `/${pagesJson.uniIdRouter && pagesJson.uniIdRouter.loginPage ? pagesJson.uniIdRouter.loginPage: 'uni_modules/sv-id-pages/pages/login/login'}`,
		});
		uni.$emit('uni-id-pages-logout')
		this.setUserInfo({},{cover:true})
		// 清除本地完整信息
		uni.removeStorageSync('sv-id-pages-userInfo')
	},

	loginBack (e = {}) {
		const {uniIdRedirectUrl = ''} = e
		let delta = 0; //判断需要返回几层
		let pages = getCurrentPages();
		// console.log(pages);
		pages.forEach((page, index) => {
			if (pages[pages.length - index - 1].route.split('/')[3] == 'login') {
				delta++
			}
		})
		// console.log('判断需要返回几层:', delta);
		if (uniIdRedirectUrl) {
			return uni.redirectTo({
				url: uniIdRedirectUrl,
				fail: (err1) => {
					uni.switchTab({
						url:uniIdRedirectUrl,
						fail: (err2) => {
							console.log(err1,err2)
						}
					})
				}
			})
		}
		// #ifdef H5
		if (e.loginType == 'weixin') {
			// console.log('window.history', window.history);
			return window.history.go(-3)
		}
		// #endif

		if (delta) {
			const page = pagesJson.pages[0]
			return uni.reLaunch({
				url: `/${page.path}`
			})
		}

		uni.navigateBack({
			delta
		})
	},
	async loginSuccess(e = {}){
		const {
			showToast = true, toastText = '登录成功', autoBack = true, uniIdRedirectUrl = '', passwordConfirmed
		} = e
		// console.log({toastText,autoBack});
		if (showToast) {
			uni.showToast({
				title: toastText,
				icon: 'none',
				duration: 3000
			});
		}
		this.updateUserInfo()
		
		await this.setCompleteInfo()
		
		uni.$emit('uni-id-pages-login-success', e)

		if (config.setPasswordAfterLogin && !passwordConfirmed) {
			return uni.redirectTo({
				url: uniIdRedirectUrl ? `/uni_modules/sv-id-pages/pages/userinfo/set-pwd/set-pwd?uniIdRedirectUrl=${uniIdRedirectUrl}&loginType=${e.loginType}`: `/uni_modules/sv-id-pages/pages/userinfo/set-pwd/set-pwd?loginType=${e.loginType}`,
				fail: (err) => {
					console.log(err)
				}
			})
		}

		if (autoBack) {
			this.loginBack({uniIdRedirectUrl})
		}
	},
	async setCompleteInfo() {
		// uniIdCo只能获取账号简略信息，在此添加获取完整信息
		const completeInfo = await uniCloud.database().collection('uni-id-users').where("'_id' == $cloudEnv_uid")
    .field('avatar_file,username,nickname,gender,tags,my_invite_code,role,email,mobile,last_login_date,last_login_ip').get({getOne:true})
		uni.setStorageSync('sv-id-pages-userInfo', completeInfo.result?.data)
	}
}

// #ifdef VUE2
import Vue from 'vue'
// 通过Vue.observable创建一个可响应的对象
export const store = Vue.observable(data)
// #endif

// #ifdef VUE3
import {
	reactive
} from 'vue'
// 通过Vue.observable创建一个可响应的对象
export const store = reactive(data)
// #endif
