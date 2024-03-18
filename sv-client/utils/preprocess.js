import { useSysStore } from '@/store/sys.js';
import { storageDicts } from './pinia-storage.js';
import { changeTheme } from './sys.js';

// 预处理
export async function preProcess() {
  console.log('=== App 启动预处理 ===');
  /**
   * 隐藏内置tabbar
   * 官方bug：安卓真机上报错：hideTabBar:fail not TabBar page
   * 解决方法：1. 将tabBar中height设置成1px（实测设置成0或0px无效）
   *          2. 可加短暂的适当的延时器，但是大概率会存在留白闪烁问题
   *          3. 在app首页的onLoad中进行hideTabBar，注意在onLaunch中无效（推荐）
   */
  uni.hideTabBar()
  // 监听登录成功
  listenLoginSuccess()
  // 初始系统配置参数
  initSysConfig()
}


function listenLoginSuccess() {
  uni.$on('uni-id-pages-login-success', (e) => {
    console.log('==== 登录成功 ====', e);
    storageDicts()
    initSysConfig()
  })
}

function initSysConfig() {
  const sysStore = useSysStore()
  sysStore.setConfig({
    curTabIndex: 0
  })
  changeTheme(sysStore.getThemes())
}