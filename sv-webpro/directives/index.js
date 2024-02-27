import ClickOutside from './click-outside/click-outside.js'

const directives = {
  'click-outside': ClickOutside
}

export default { // 导出自定义指令
  install(app) { // 以安装的方式插到app中
    Object.keys(directives).forEach((key) => { // 遍历directives对象的key
      app.directive(key, directives[key]) // 将每个directive注册到app中
    })
  }
}