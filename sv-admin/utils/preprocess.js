import { useSysStore } from '../store/sys.js';
import { refreshPiniaStorage } from './pinia-storage.js';
import { changeTheme } from './sys.js';

// 预处理
export async function preProcess() {
  console.log('=== App 启动预处理 ===');

  // 监听登录成功
  listenLoginSuccess()
  changeTheme(useSysStore().getThemes())
}

function listenLoginSuccess() {
  uni.$on('uni-id-pages-login-success', (e) => {
    console.log('==== 登录成功 ====', e);

    refreshPiniaStorage()
  })
}