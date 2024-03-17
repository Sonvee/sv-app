<template>
  <view class="vip-protocol">
    <h2 class="head-title-2">
      <uni-icons class="icons-back" type="undo-filled" size="32" @click="goBack"></uni-icons>
      会员协议
    </h2>
    <article>
      <h4 class="head-title-4">一、服务内容</h4>
      <p class="paragraph">
        &emsp;&emsp;平台将向会员提供包括但不限于信息浏览、在线购买、社区交流、专享优惠等服务，
        具体服务内容以平台实际运营为准。
      </p>
      <h4 class="head-title-4">二、会员权利与义务</h4>
      <p class="paragraph">
        &emsp;&emsp;会员有权享受平台提供的各项服务，并有义务遵守国家法律法规及本协议规定，
        不得利用平台进行违法活动。会员需保证注册信息的真实性、准确性和完整性，且须自行负责账号安全。
      </p>
      <h4 class="head-title-4">三、费用与支付</h4>
      <p class="paragraph">
        &emsp;&emsp;如平台部分服务涉及收费，会员在选择此类服务时应按照平台公示的收费标准支付相应费用。
        会员理解并同意，所有已支付的服务费用在任何情况下均不退还，除非另有明确规定。
      </p>
      <h4 class="head-title-4">四、隐私保护</h4>
      <p class="paragraph">
        &emsp;&emsp;平台尊重并保护会员的个人隐私，承诺不泄露会员非公开信息，详情请参阅
        <text class="text-privacy" @click="onPrivacy">《隐私政策》</text>
      </p>
      <h4 class="head-title-4">五、知识产权</h4>
      <p class="paragraph">
        &emsp;&emsp;本平台所有内容（包括但不限于文字、图片、音频、视频等）的知识产权均归平台或相关权利人所有，
        未经书面许可，会员不得擅自复制、修改、传播或用于商业用途。
      </p>
      <h4 class="head-title-4">六、协议变更与终止</h4>
      <p class="paragraph">
        &emsp;&emsp;平台有权根据业务发展和法律法规调整对本协议进行修订，修订后的协议将在平台上公告，
        会员继续使用服务即视为接受修订。如会员严重违反本协议，平台有权暂停或终止其会员资格。
      </p>
      <h4 class="head-title-4">七、更新与通知</h4>
      <p class="paragraph">
        &emsp;&emsp;我们会根据业务发展和法律法规变化适时更新隐私政策，并在应用内显著位置公告变更内容。
        请您定期关注隐私政策的更新情况，继续使用服务即表示您接受修订后的隐私政策。
      </p>
    </article>
  </view>
</template>

<script>
import manifest from '@/manifest.json'
import svidConfig from '@/uni_modules/sv-id-pages/config.js'

export default {
  data() {
    return {
      manifest
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    onPrivacy() {
      uni.navigateTo({
        url: svidConfig.agreements.privacyUrl
      })
    }
  }
}
</script>

<style lang="scss">
.vip-protocol {
  height: 100%;
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;

  .head-title-2 {
    text-align: center;
    position: relative;

    .icons-back {
      color: unset !important;
      cursor: pointer;
      position: absolute;
      left: 0;
    }
  }
  .head-title-4 {
    margin-top: 20px;
    line-height: 2;
  }
  .paragraph {
    line-height: 1.6;
  }
}

.text-privacy {
  color: #0081ff;
  text-decoration: underline;
}
</style>
