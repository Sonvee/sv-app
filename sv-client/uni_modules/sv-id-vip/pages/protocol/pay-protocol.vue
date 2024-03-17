<template>
  <view class="vip-protocol">
    <h2 class="head-title-2">
      <uni-icons class="icons-back" type="undo-filled" size="32" @click="goBack"></uni-icons>
      支付条款
    </h2>
    <article>
      <h4 class="head-title-4">一、支付方式</h4>
      <p class="paragraph">
        &emsp;&emsp;1.&emsp;支付工具：用户在使用本平台提供的付费服务时，
        可选择平台支持的第三方支付工具（例如支付宝、微信支付、银行卡等）进行支付操作。
      </p>
      <p class="paragraph">
        &emsp;&emsp;2.&emsp;支付流程：用户在选择并确认购买的商品或服务后，
        按照页面提示完成支付流程，支付成功后，系统将自动为用户激活相应的服务权益。
      </p>
      <p class="paragraph">
        &emsp;&emsp;3.&emsp;订单金额：订单金额包含商品或服务费用以及可能产生的税费和其他附加费用，
        具体金额以结算页面显示为准。
      </p>
      <h4 class="head-title-4">二、支付安全</h4>
      <p class="paragraph">
        &emsp;&emsp;平台将采取严格的安全措施保障用户的支付信息安全，
        但用户也需自行妥善保管支付密码、验证码等敏感信息，
        对于因用户自身原因导致的账户损失，平台不承担责任。
      </p>
      <h4 class="head-title-4">三、退款政策</h4>
      <p class="paragraph">
        &emsp;&emsp;1.&emsp;退款申请：对于符合退款条件的商品或服务，
        用户可在规定期限内发起退款申请。
      </p>
      <p class="paragraph">
        &emsp;&emsp;2.&emsp;退款处理：在收到用户的退款申请后，平台将在审核通过后尽快办理退款手续。
        退款时间会受制于支付渠道的退款周期，实际到账时间可能会有所不同。
      </p>
      <h4 class="head-title-4">四、责任限制</h4>
      <p class="paragraph">
        &emsp;&emsp;如因不可抗力、支付平台故障、网络延迟等原因导致支付失败或延误，
        平台将尽力协助解决，但不对因此造成的任何直接或间接损失承担责任。
      </p>
      <h4 class="head-title-4">五、信息安全</h4>
      <p class="paragraph">
        &emsp;&emsp;我们采取合理的技术手段和管理措施保障您的个人信息安全，包括但不限于加密存储、访问控制、定期审计等。
        在发生数据泄露等安全事件时，我们将按照法律法规的要求及时向您告知。
      </p>
      <h4 class="head-title-4">六、条款认同</h4>
      <p class="paragraph">
        &emsp;&emsp;请您在使用支付服务前仔细阅读并理解本支付条款，
        一旦您完成支付行为，视为您已完全接受并同意本支付条款的所有内容。
      </p>
    </article>
  </view>
</template>

<script>
import manifest from '@/manifest.json'

export default {
  data() {
    return {
      manifest
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
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
</style>
