<script>
import svIdPageInit from '@/uni_modules/sv-id-pages/init.js'
import { preProcess } from '@/utils/preprocess'
export default {
  onLaunch: function () {
    console.log('App Launch')
    svIdPageInit()
    preProcess()
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 每个页面公共css */
@import '@/uni_modules/sv-style/scss/style.scss';
</style>
