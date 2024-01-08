<template>
	<!-- 第三方快捷登录 -->
	<view class="quick-login">
		<view class="quick-login-btn phone-login" @click="quickLogin('phone')">
			<uni-icons type="phone-filled" size="40" color="#ffffff"></uni-icons>
		</view>
		<view class="quick-login-btn weixin-login" @click="quickLogin('weixin')">
			<uni-icons type="weixin" size="40" color="#ffffff"></uni-icons>
		</view>
		<view class="quick-login-btn qq-login" @click="quickLogin('qq')">
			<uni-icons type="qq" size="40" color="#ffffff"></uni-icons>
		</view>
	</view>
</template>

<script>
import { mutations } from '@/uni_modules/sv-id-pages/common/store.js'
const uniIdCo = uniCloud.importObject('uni-id-co', {
	errorOptions: {
		type: 'toast'
	}
})
export default {
	data() {
		return {}
	},
	methods: {
		// 第三方快捷登录
		quickLogin(type) {
			switch (type) {
				case 'weixin':
					uni.showLoading({
						title: '登录中，请稍后',
						mask: true
					})
					// #ifndef H5
					uni.login({
						provider: type,
						onlyAuthorize: true,
						success: (res) => {
							console.log('==== uni.login success :', res)
							this.login({ code: res.code }, type)
						},
						fail: (err) => {
							console.log('==== uni.login fail', err)
						},
						complete: () => {
							uni.hideLoading()
						}
					})
					// #endif

					// #ifdef H5
					uni.hideLoading()
					uni.showToast({
						title: '敬请期待',
						icon: 'none'
					})
					// #endif
					break
				case 'qq':
					uni.showToast({
						title: '敬请期待',
						icon: 'none'
					})
					break
				case 'phone':
					uni.showToast({
						title: '敬请期待',
						icon: 'none'
					})
					break
			}
		},
		login(params, type) {
			// 联网验证登录
			let action =
				'loginBy' + type.trim().replace(type[0], type[0].toUpperCase())
			uniIdCo[action](params)
				.then((result) => {
					uni.showToast({
						title: '登录成功',
						icon: 'none',
						duration: 2000
					})
					mutations.loginSuccess(result)
				})
				.catch((err) => {
					uni.showModal({
						content: err.message,
						confirmText: '知道了',
						showCancel: false
					})
				})
		}
	}
}
</script>

<style lang="scss">
.quick-login {
	width: 70vw;
	height: 120rpx;
	margin-top: 40rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;

	.quick-login-btn {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.quick-login-btn:active {
		opacity: 0.9;
	}
	.phone-login {
		background: linear-gradient(135deg, #ff9900, #ff3300);
	}
	.weixin-login {
		background: linear-gradient(135deg, #36ff4d, #29c53c);
	}
	.qq-login {
		background: linear-gradient(135deg, #59a1ff, #3978ee);
	}
}
</style>
