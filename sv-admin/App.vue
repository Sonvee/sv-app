<script>
import { preProcess } from '@/utils/preprocess'
import uniIdPageInit from '@/uni_modules/sv-id-pages/init.js'
import { routeWatcher } from '@/router/route-watcher.js'
export default {
  onLaunch: async function () {
    console.log('App Launch')
    await uniIdPageInit()
    await preProcess()
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
@import '@/common/scss/animations.scss';
@import '@/common/scss/layout.scss';
@import '@/common/scss/element-plus.scss';
@import '@/common/scss/uni-icons.scss';
@import '@/common/scss/admin-icons.scss';
@import '@/common/scss/sv-icons.scss';
</style>
