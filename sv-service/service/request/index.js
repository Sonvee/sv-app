// 引入基础路径配置
import config from '@/configs/index.js'

/**
 * 封装一个基础路径的 request 请求，并导出
 * @param {*} options: {
 *    url: 请求路径
 *    method: 请求方式,
 *    data: 请求参数,
 * }
 */
const request = (options) => {
  // 用 Promise 做链式调用封装
  const handleUrl = () => {
    let path = ''
    // 以http开头则用http全路径
    if (options.url.toLowerCase().startsWith("http")) {
      path = options.url
    } else {
      // 以/开头则正常拼接
      if (options.url.startsWith("/")) {
        path = config.api_url + options.url
      } else {
        // 不以/开头则自动拼接上/
        path = config.api_url + '/' + options.url
      }
    }
    return path
  }
  return new Promise((resolve, reject) => {
    // 此处可以做加载 loading 或提示动画等操作
    uni.request({
      // 若url以http开头，则直接使用完整路径，否则使用标准的基础路径 api_url + 请求路径 url 拼接
      url: handleUrl(),
      // 请求方式，默认POST
      method: options.method || 'POST',
      // 请求参数，get和post统一使用data字段
      data: options.data || {},
      header: {
        // 添加token
        "Authorization": uni.getStorageSync('uni_id_token') || '',
        "Content-type": "application/json;charset=UTF-8",
      },
      responseType: options.responseType || "",
      // 超时配置
      timeout: 16000,
      success(res) {
        // statusCode拦截
        switch (res.statusCode) {
          case 200:
            // 成功数据
            if (res.data.code == 401) {
              // 无需手动处理token重新登录，uni-id中已自带此功能
            }
            if (!res.data.success) {
              uni.showToast({
                title: res.data?.error?.message || res.data?.message,
                icon: 'none',
              })
            }
            resolve(res.data);
            break
          case 401:
            // 无需手动处理token重新登录，uni-id中已自带此功能
            break
          default:
            // 失败信息
            resolve(res.data);
            break
        }
      },
      fail(res) {
        console.log('请求失败', res);
        reject(res);
      }
    })
  })
}

export default request