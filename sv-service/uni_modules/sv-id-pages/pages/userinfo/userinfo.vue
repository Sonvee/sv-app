<template>
  <view class="sv-id-pages sv-id-userinfo">
    <view class="sv-uni-list">
      <uni-list>
        <uni-list-item title="头像" link>
          <template #footer>
            <sv-id-pages-avatar width="140rpx" height="140rpx"></sv-id-pages-avatar>
          </template>
        </uni-list-item>
        <uni-list-item
          title="用户ID"
          :rightText="userInfo._id"
          link
          @click="setClipboard(userInfo._id)"
        ></uni-list-item>
        <uni-list-item
          title="用户名"
          :rightText="userInfo.username || '只能修改一次哦'"
          link
          @click="onUsername"
        ></uni-list-item>
        <uni-list-item
          title="昵称"
          :rightText="userInfo.nickname || '起个昵称吧'"
          link
          @click="onNickname"
        ></uni-list-item>
        <uni-list-item
          title="个性签名"
          :rightText="userInfo.comment || '编辑个性签名'"
          link
          @click="onComment"
        ></uni-list-item>
      </uni-list>
    </view>
    <view class="sv-uni-list" style="margin-top: 24rpx">
      <uni-list>
        <uni-list-item title="账号与安全" link @click="onSecurity"></uni-list-item>
      </uni-list>
    </view>
    <view class="sv-uni-list" style="margin-top: 24rpx">
      <uni-list>
        <uni-list-item
          class="text-center"
          title="退出登录"
          clickable
          @click="onLogout"
        ></uni-list-item>
      </uni-list>
    </view>
    <!-- 弹窗 -->
    <uni-popup ref="usernameDialog" type="dialog">
      <uni-popup-dialog
        mode="input"
        :value="userInfo.username"
        title="设置用户名"
        placeholder="用户名必须为字母或数字"
        @confirm="setUsername"
      ></uni-popup-dialog>
    </uni-popup>
    <uni-popup ref="nicknameDialog" type="dialog">
      <uni-popup-dialog
        mode="input"
        :value="userInfo.nickname"
        title="设置昵称"
        placeholder="请输入要设置的昵称"
        @confirm="setNickname"
      ></uni-popup-dialog>
    </uni-popup>
    <uni-popup ref="commentDialog" type="dialog">
      <uni-popup-dialog
        mode="input"
        :value="userInfo.comment"
        title="设置个性签名"
        placeholder="写点什么吧~ (20字以内)"
        :maxlength="20"
        @confirm="setComment"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import { store, mutations } from '../../common/store'

export default {
  data() {
    return {}
  },
  computed: {
    userInfo() {
      return store.userInfo
    }
  },
  onLoad() {
    // 未登录将跳转到登录页面
    if (!store.hasLogin) {
      uni.showModal({
        title: '系统提示',
        content: '还没有登录哦，请先登录吧~',
        confirmText: '去登录',
        cancelText: '就不!',
        success: ({ confirm }) => {
          if (confirm) {
            mutations.logout()
          } else {
            uni.navigateBack()
          }
        }
      })
    }
  },
  methods: {
    setClipboard(data) {
      if (!data) return
      uni.setClipboardData({
        data, // 需要复制到剪切板的内容
        showToast: true // 配置是否弹出提示，默认弹出提示
      })
    },
    // 修改用户名
    onUsername() {
      // 只允许修改一次，若已有用户名则点击复制到剪切板
      if (this.userInfo.username) {
        this.setClipboard(this.userInfo.username)
      } else {
        this.$refs.usernameDialog.open()
      }
    },
    async setUsername(e) {
      if (!e) return
      // 用户名必须为字母或数字
      if (!/^[a-zA-Z0-9]+$/.test(e)) {
        uni.showToast({
          title: '用户名必须为字母或数字',
          icon: 'none'
        })
        return
      }
      await mutations.updateUserInfo({
        username: e
      })
      this.$refs.usernameDialog.close()
    },
    // 修改昵称
    onNickname() {
      this.$refs.nicknameDialog.open()
    },
    async setNickname(e) {
      if (!e) return
      await mutations.updateUserInfo({
        nickname: e
      })
      this.$refs.nicknameDialog.close()
    },
    // 修改个性签名
    onComment() {
      this.$refs.commentDialog.open()
    },
    async setComment(e) {
      await mutations.updateUserInfo({
        comment: e
      })
      this.$refs.commentDialog.close()
    },
    onSecurity() {
      uni.navigateTo({
        url: '/uni_modules/sv-id-pages/pages/userinfo/security/security'
      })
    },
    onLogout() {
      uni.showModal({
        title: '退出登录',
        content: '确认退出登录吗?',
        showCancel: true,
        success: ({ confirm }) => {
          if (confirm) {
            mutations.logout()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.sv-id-userinfo {
  :deep(.uni-list-item__content-title) {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .text-center {
    :deep(.uni-list-item__content-title) {
      justify-content: center;
    }
  }
}
</style>