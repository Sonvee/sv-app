// 预处理
export async function preProcess() {
  console.log('=== App 启动预处理 ===');
  // 监听登录成功
  listenLoginSuccess()
}


function listenLoginSuccess() {
  uni.$on('uni-id-pages-login-success', (e) => {
    console.log('==== 登录成功 ====', e);
  })
}