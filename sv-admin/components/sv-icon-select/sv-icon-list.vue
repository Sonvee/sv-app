<template>
  <view class="sv-icon-select">
    <el-input
      class="sv-el-input"
      v-model="iconName"
      :prefix-icon="Search"
      size="small"
      clearable
      @clear="filterIcons"
      @input="filterIcons"
    />
    <el-scrollbar v-bind="$attrs" class="icon-list">
      <view
        v-for="item in iconList"
        :key="item"
        class="icon"
        :style="{ '--col-num': colnum }"
        @click="onIcon(item)"
      >
        <view class="icon-font" :class="item"></view>
        <view class="icon-text">{{ item }}</view>
      </view>
    </el-scrollbar>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import icons from '@/uni_modules/sv-style/font/icons-list.js'

const props = defineProps({
  colnum: {
    type: Number,
    default: 4
  }
})

const emits = defineEmits(['selected'])

const iconList = ref(icons)
const iconName = ref('')

function onIcon(item) {
  iconName.value = item
  // 复制到剪切板
  uni.setClipboardData({
    data: iconName.value
  })
  emits('selected', iconName.value)
  document.body.click()
}

// 筛选过滤
function filterIcons() {
  iconList.value = icons
  if (iconName.value) {
    iconList.value = icons.filter((item) => item.indexOf(iconName.value) !== -1)
  }
}
</script>

<style lang="scss">
.sv-icon-select {
  width: 100%;
  // height: 100%;
  height: calc(100% - 38px);

  .icon-list {
    margin-top: 12px;

    .icon {
      --col-num: 4;
      width: calc(100% / var(--col-num));
      height: 110px;
      display: inline-block;
      padding: 4px;
      cursor: pointer;
      border-radius: 4px;
      vertical-align: top;

      @include useTheme {
        color: getTheme('sv-admin-text-color');
      }

      .icon-font {
        width: 40px;
        display: block;
        margin: 0 auto;
        font-size: 40px;
      }

      .icon-text {
        width: 100%;
        text-align: center;
      }
    }
    .icon:hover {
      @include useTheme {
        background-color: getTheme('sv-admin-hover-color');
        color: $uni-color-primary;
      }
    }
  }
}
</style>