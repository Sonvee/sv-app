<script>
import { preProcess } from '@/utils/preprocess'
import uniIdPageInit from '@/uni_modules/sv-id-pages/init.js'
import { routeWatcher } from '@/router/route-watcher.js'
export default {
  onLaunch: function () {
    console.log('App Launch')
    uniIdPageInit()
    preProcess()
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  watch: {
    $route: {
      // immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        // 全局监听路由
        routeWatcher(newVal)
      }
    }
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import '@/common/scss/style.scss';
</style>
