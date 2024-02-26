import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import router from '@/router/index.js'
import * as Pinia from 'pinia';
import { createUnistorage } from '@/uni_modules/pinia-plugin-unistorage'
import * as svIdPagesStore from '@/uni_modules/sv-id-pages/common/store'

export function createApp() {
  const app = createSSRApp(App)
	
	app.use(ElementPlus, {
		locale: zhCn,
	})
	
	const store = Pinia.createPinia()
	store.use(createUnistorage())
	app.use(store);
  
	app.use(router);
  
	// 全局变量
	app.config.globalProperties.$svIdPagesStore = svIdPagesStore
	
  return {
    app,
		Pinia
  }
}
// #endif