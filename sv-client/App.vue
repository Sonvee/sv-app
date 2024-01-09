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
// colorui
@import 'common/colorui/main.css';
</style>
