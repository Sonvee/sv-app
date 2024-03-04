<template>
  <view class="sv-id-pages sv-id-agreements-privacy">
    <h2 class="head-title-2">
      <uni-icons class="icons-back" type="undo-filled" size="32" @click="goBack"></uni-icons>
      隐私政策条款
    </h2>
    <article>
      <h4 class="head-title-4">一、引言与目的</h4>
      <p class="paragraph">
        &emsp;&emsp;本隐私政策适用于【{{ manifest.name }}】提供的所有服务，
        包括但不限于手机验证码登录、微信一键登录及可能的实名认证功能。
        我们尊重并保护用户的个人信息安全，承诺遵守相关法律法规要求，透明化处理您的个人信息。
      </p>
      <h4 class="head-title-4">二、个人信息收集</h4>
      <p class="paragraph">
        &emsp;&emsp;1.&emsp;手机验证码登录：当您选择通过手机号码进行注册或登录时，
        我们会收集您的手机号码，并通过短信形式发送验证码以验证您的身份。
      </p>
      <p class="paragraph">
        &emsp;&emsp;2.&emsp;手机号一键登录：为方便用户快速登录，我们提供手机号码一键登录功能。在您使用此功能时，
        系统将根据运营商提供的接口获取您的手机号码及对应的身份认证信息，用于直接完成登录验证。
      </p>
      <p class="paragraph">
        &emsp;&emsp;3.&emsp;微信一键登录：如您选择使用微信账号登录，我们会通过微信开放平台接口获取您的微信OpenID以及必要的登录授权信息，
        但不会收集您的微信昵称、头像等其他详细资料，除非得到您的明确同意或法律规定。
      </p>
      <h4 class="head-title-4">三、个人信息使用</h4>
      <p class="paragraph">
        &emsp;&emsp;收集到的上述信息仅用于为您提供账户管理、登录验证、客户服务等功能，确保您能顺利使用我们的产品和服务。
        若未来开展实名认证功能，我们将遵循相关法律法规，在获得您的明确同意后，收集和使用您的实名身份信息，以满足法规要求或提升服务质量。
      </p>
      <h4 class="head-title-4">四、第三方共享</h4>
      <p class="paragraph">
        &emsp;&emsp;在未经您明确同意的情况下，我们不会将您的个人信息提供给任何第三方，除非法律要求或为了履行与您签订的合同所必需。
      </p>
      <h4 class="head-title-4">五、信息安全</h4>
      <p class="paragraph">
        &emsp;&emsp;我们采取合理的技术手段和管理措施保障您的个人信息安全，包括但不限于加密存储、访问控制、定期审计等。
        在发生数据泄露等安全事件时，我们将按照法律法规的要求及时向您告知。
      </p>
      <h4 class="head-title-4">六、用户权利</h4>
      <p class="paragraph">
        &emsp;&emsp;您有权随时查询、更正、删除我们持有的您的个人信息。对于实名认证信息，您也有权撤销授权或申请注销账户。
        如有需求，请通过应用内设置或联系我们的客服人员行使您的权利。
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
import config from '@/uni_modules/sv-id-pages/config.js'
import manifest from '@/manifest.json'

export default {
  data() {
    return {
      manifest
    }
  },
  methods: {
    goBack() {
      if(config.routerMode) {
        this.$router.back()
      } else {
        uni.navigateBack()
      }
    }
  }
}
</script>

<style lang="scss">
.sv-id-agreements-privacy {
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
</style>
