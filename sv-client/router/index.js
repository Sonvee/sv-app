import App from '/App'
import {
  createSSRApp
} from 'vue'
import UniRouteGuards from 'uniapp-route-guards';

const app = createSSRApp(App)
app.use(UniRouteGuards);

// 路由守卫配置
const guard = new UniRouteGuards();

// 全局前置守卫
guard.beforeEach((to, from, next) => {
  // console.log('==== 全局前置守卫 to :', to, 'from', from);
  next()
});

// 全局后置守卫
guard.afterEach((to, from) => {
  // console.log('==== 全局后置守卫 to :', to, 'from', from);
});

// 路由守卫异常
guard.onError((errMsg) => {
  console.error('==== 路由守卫异常: ' + errMsg);
});

// 取消对某个路由方法进行拦截
/* uni.navigateTo({
	url: '/pages/page',
	success() {
		console.log('is success');
	},
	fail() {
		console.error('is fail');
	}
}, false);

// 或
uni.navigateBack(null, false); */

// 解析运行流程
// 1. 调用全局的 beforeEach 守卫
// 2. 路由跳转
// 3. 调用全局的 afterEach 守卫


