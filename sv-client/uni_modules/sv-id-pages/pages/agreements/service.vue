<template>
  <view class="sv-id-pages sv-id-agreements-service">
    <h2 class="head-title-2">
      <uni-icons class="icons-back" type="undo-filled" size="32" @click="goBack"></uni-icons>
      用户服务协议
    </h2>
    <article>
      <h4 class="head-title-4">一、引言</h4>
      <p class="paragraph">
        &emsp;&emsp;欢迎您使用【{{ manifest.name }}】（以下简称“本应用”）提供的各项服务。
        在开始使用本应用前，请您务必仔细阅读并接受本《用户服务协议》（以下简称“本协议”）。
        通过注册、登录或以其他方式使用本应用，即视为您已同意并接受本协议的所有条款。
      </p>
      <h4 class="head-title-4">二、服务内容与变更</h4>
      <p class="paragraph">
        &emsp;&emsp;1.&emsp;本应用为您提供包括但不限于手机号码验证码登录、手机号一键登录、微信一键登录以及可能的实名认证等服务。
      </p>
      <p class="paragraph">
        &emsp;&emsp;2.&emsp;本应用有权根据业务发展和市场需求调整服务内容，并通过公告或其他适当方式通知您。
      </p>
      <h4 class="head-title-4">三、用户账号与使用规则</h4>
      <p class="paragraph">
        &emsp;&emsp;1.&emsp;您承诺注册信息真实有效，不得冒用他人身份。对因虚假信息导致的一切后果，由您自行承担。
      </p>
      <p class="paragraph">
        &emsp;&emsp;2.&emsp;您有责任妥善保管自己的账号及密码，并对其在您账号下发生的所有活动承担责任。
      </p>
      <p class="paragraph">
        &emsp;&emsp;3.&emsp;您应遵守法律法规及本协议的规定，不得利用本应用进行任何违法、违规行为。
      </p>
      <h4 class="head-title-4">四、隐私保护</h4>
      <p class="paragraph">
        &emsp;&emsp;我们尊重并保护您的隐私权，具体隐私政策请参阅《【{{
          manifest.name
        }}】隐私政策》。
      </p>
      <h4 class="head-title-4">五、知识产权</h4>
      <p class="paragraph">
        &emsp;&emsp;本应用及其所有内容，包括但不限于文字、图片、音频、视频、商标等，均受相关法律保护。
        未经本应用书面许可，您不得擅自复制、分发或用于商业用途。
      </p>
      <h4 class="head-title-4">六、免责声明</h4>
      <p class="paragraph">
        &emsp;&emsp;对于因不可抗力、系统维护、网络故障、第三方原因等原因导致的服务中断或延迟，本应用不承担任何责任。
      </p>
      <h4 class="head-title-4">七、服务终止</h4>
      <p class="paragraph">
        &emsp;&emsp;如有违反本协议规定的行为，本应用有权在提前通知或无需通知的情况下，暂停或终止向用户提供部分或全部服务。
      </p>
      <h4 class="head-title-4">八、争议解决</h4>
      <p class="paragraph">
        &emsp;&emsp;如双方就本协议内容产生争议，应首先友好协商解决；
        协商不成时，任何一方均有权将争议提交至【约定的法院/仲裁机构】进行解决。
      </p>
      <h4 class="head-title-4">九、协议修改</h4>
      <p class="paragraph">
        &emsp;&emsp;本应用保留随时修改本协议的权利，修改后的协议自发布之日起生效。
        您继续使用本应用服务，即视为接受修改后的协议内容。
      </p>
      <h4 class="head-title-4">十、其他</h4>
      <p class="paragraph">
        &emsp;&emsp;本协议未尽事宜，依据国家相关法律法规及政策执行。
        同时，本应用会根据实际运营情况适时制定并公布各类补充协议或规则，作为本协议的有效组成部分。
      </p>
    </article>
  </view>
</template>

<script setup>
import manifest from '@/manifest.json'

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss">
.sv-id-agreements-service {
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
