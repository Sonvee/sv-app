<script>
import svIdPageInit from '@/uni_modules/sv-id-pages/init.js'
export default {
  onLaunch: async function () {
    console.log('App Launch')
    await svIdPageInit()
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
*,
:root {
  box-sizing: border-box;
}
uni-page-body {
  height: 100%;
}
</style>
