<template>
	<button open-type="chooseAvatar" @chooseavatar="bindchooseavatar" @click="uploadAvatarImg" class="box" :class="{'showBorder':border}"  :style="{width,height,lineHeight:height}">
		<cloud-image v-if="avatar_file" :src="avatar_file.url" :width="width" :height="height"></cloud-image>
		<uni-icons v-else :style="{width,height,lineHeight:height}" class="chooseAvatar" type="plusempty" size="30"
			color="#dddddd"></uni-icons>
	</button>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/sv-id-pages/common/store.js'
	/**
	* sv-id-pages-avatar 
	* @description 用户头像组件
	* @property {String} width	图片的宽，默认为：50px
	* @property {String} height	图片的高，默认为：50px
	*/
	export default {
		data() {
			return {
				isPC: false
			}
		},
		props: {
			//头像图片宽
			width: {
				type: String,
				default () {
					return "50px"
				}
			},
			//头像图片高
			height: {
				type: String,
				default () {
					return "50px"
				}
			},
			border:{
				type: Boolean,
				default () {
					return false
				}
			},
			// 自定义头像图片根目录
			fixpath:{
				type: String,
				default () {
					return "avatarstorage"
				}
			}
		},
		async mounted() {
			// #ifdef H5
			this.isPC = !['ios', 'android'].includes(uni.getSystemInfoSync().platform);
			// #endif
		},
		computed: {
			hasLogin() {
				return store.hasLogin
			},
			userInfo() {
				return store.userInfo
			},
			avatar_file() {
				return store.userInfo.avatar_file
			}
		},
		methods: {
			setAvatarFile(avatar_file) {
				const oldinfo = uni.getStorageSync('uni-id-pages-userInfo')
				if(oldinfo && oldinfo?.avatar_file?.url) {
					// 删除云存储中原文件
					uniCloud.importObject('sv-utils').deleteCloudFile([oldinfo.avatar_file.url])
				}
				// console.log('==== avatar_file :', avatar_file);
				// 使用 clientDB 提交数据
				mutations.updateUserInfo({avatar_file})
			},
			async bindchooseavatar(res) {
				let avatarUrl = res.detail.avatarUrl
				let avatar_file = {
					extname: avatarUrl.split('.')[avatarUrl.split('.').length - 1],
					name:'',
					url:''
				}
				//上传到服务器
				avatar_file.name = `${this.userInfo._id}-${Date.now()}`
				let cloudPath = `${this.fixpath}/${avatar_file.name}`
				try{
					uni.showLoading({
						title: "更新中",
						mask: true
					});
					let {
						fileID
					} = await uniCloud.uploadFile({
						filePath:avatarUrl,
						cloudPath,
						fileType: "image",
						cloudPathAsRealPath: true // 开启自定义路径，否则只能默认保存在cloudstorage文件夹下
					});
					avatar_file.url = fileID
					uni.hideLoading()
				}catch(e){
					console.error(e);
				}
				this.setAvatarFile(avatar_file)
			},
			uploadAvatarImg(res) {
				// #ifdef MP-WEIXIN
				return false // 微信小程序走 bindchooseavatar方法
				// #endif
				
				// #ifndef MP-WEIXIN
				if(!this.hasLogin){
					return uni.navigateTo({
						url:'/uni_modules/sv-id-pages/pages/login/login'
					})
				}
				const crop = {
					quality: 100,
					width: 600,
					height: 600,
					resize: true
				};
				uni.chooseImage({
					count: 1,
					crop,
					success: async (res) => {
						let tempFile = res.tempFiles[0],
							avatar_file = {
								// #ifdef H5
								extname: tempFile.name.split('.')[tempFile.name.split('.').length - 1],
								// #endif
								// #ifndef H5
								extname: tempFile.path.split('.')[tempFile.path.split('.').length - 1]
								// #endif
							},
							filePath = res.tempFilePaths[0]
						//非app端剪裁头像，app端用内置的原生裁剪
						// #ifndef APP-PLUS
						filePath = await new Promise((callback) => {
							// #ifdef H5
							if (!this.isPC) {
								uni.navigateTo({
									url: '/uni_modules/sv-id-pages/pages/userinfo/cropImage/cropImage?path=' +
										filePath + `&options=${JSON.stringify(crop)}`,
									animationType: "fade-in",
									events: {
										success: url => {
											callback(url)
										}
									},
									complete(e) {
										// console.log(e);
									}
								});
							}
							// #endif
						})
						// #endif
						
						avatar_file.name = `${this.userInfo._id}-${Date.now()}`
						let cloudPath = `${this.fixpath}/${avatar_file.name}`
						uni.showLoading({
							title: "更新中",
							mask: true
						});
						let {
							fileID
						} = await uniCloud.uploadFile({
							filePath,
							cloudPath,
							fileType: "image",
							cloudPathAsRealPath: true // 开启自定义路径，否则只能默认保存在cloudstorage文件夹下
						});
						avatar_file.url = fileID
						uni.hideLoading()
						this.setAvatarFile(avatar_file)
					}
				})
				// #endif
			}
		}
	}
</script>

<style>
	/* #ifndef APP-NVUE */
	.box{
		overflow: hidden;
	}
	/* #endif */
	.box{
		padding: 0;
	}
	
	.chooseAvatar {
		/* #ifndef APP-NVUE */
		display: inline-block;
		box-sizing: border-box;
		/* #endif */
		border-radius: 10px;
		text-align: center;
		padding: 1px;
	}
	.showBorder{
		border: solid 1px #ddd;
	}
</style>
