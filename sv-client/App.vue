<script>
import svIdPageInit from '@/uni_modules/sv-id-pages/init.js'
import { preProcess } from '@/utils/preprocess'
export default {
  onLaunch: async function () {
    console.log('App Launch')
    await svIdPageInit()
    await preProcess()
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
/*每个页面公共css */
@import 'common/scss/style.scss';
@import 'common/scss/animations.scss';
@import 'common/scss/uni-icons.scss';
@import 'common/scss/admin-icons.scss';
@import 'common/scss/sv-icons.scss';
@import 'common/scss/tuniao.scss';
@import 'common/scss/uni-ui.scss';
// colorui
@import 'common/colorui/main.css';
@import 'common/colorui/icon.css';
@import 'common/colorui/animation.css';
// 图鸟
@import '@tuniao/tn-style/dist/uniapp/index.css';
</style>
