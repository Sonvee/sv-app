<template>
  <view class="sv-checkbox" @click.stop="onCheck">
    <view class="box-checked" v-if="checked">
      <text class="cuIcon-check"></text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  info: {
    type: [Object, String, Number]
  }
})
const emits = defineEmits(['change'])

const checked = ref(false)

function onCheck() {
  checked.value = !checked.value
  emits('change', {
    checked: checked.value,
    info: props.info
  })
}
</script>

<style lang="scss">
.sv-checkbox {
  width: 32rpx;
  height: 32rpx;
  display: inline-block;
  border-radius: 8rpx;
  border: 1px solid #007aff;
  flex-shrink: 0;

  .box-checked {
    width: 100%;
    height: 100%;
    background-color: #007aff;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }
}
</style>
