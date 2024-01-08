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
// element-plus样式在uniapp中会发送冲突导致部分样式失效，建议直接在index.html中使用cdn导入样式
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as Pinia from 'pinia';
import { createUnistorage } from '@/uni_modules/pinia-plugin-unistorage'
import '/router/index.js';
import * as svIdPagesStore from '@/uni_modules/sv-id-pages/common/store'


export function createApp() {
  const app = createSSRApp(App)
	
	app.use(ElementPlus, {
		locale: zhCn,
	})
	
	const store = Pinia.createPinia()
	store.use(createUnistorage())
	app.use(store);
	
	// 全局变量
	app.config.globalProperties.$svIdPagesStore = svIdPagesStore
	
  return {
    app,
		Pinia
  }
}
// #endif