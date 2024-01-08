import clientConfig from '@/client.config.js';
import {
  useSysStore
} from '@/store/sys.js';
import {
  storageAuth,
  storageDicts
} from './pinia-storage.js';

// 预处理
export async function preProcess() {
  console.log('=== App 启动预处理 ===');
  // 隐藏内置tabbar
  hideTabBar()
  // 监听登录成功
  listenLoginSuccess()
  // 初始系统配置参数
  initSysConfig()
}

/**
 * 隐藏内置tabbar
 * 官方bug：安卓真机上报错：hideTabBar:fail not TabBar page
 * 解决方法：加短暂的延时器，建议将tabBar中height设置成1px（实测设置成0或0px无效）
 */
function hideTabBar() {
  // #ifdef APP
  setTimeout(() => {
    uni.hideTabBar()
  }, 600)
  // #endif
  // #ifndef APP
  uni.hideTabBar()
  // #endif
}

function listenLoginSuccess() {
  uni.$on('uni-id-pages-login-success', (e) => {
    console.log('==== 登录成功 ====');

    storageAuth()
    storageDicts()
    initSysConfig()
  })
}

function initSysConfig() {
  useSysStore().setConfig({
    curTabbarRoute: clientConfig.index.url
  })
}