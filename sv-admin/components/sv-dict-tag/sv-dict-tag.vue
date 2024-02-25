<template>
  <view>{{ result }}</view>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { getDictById } from '@/utils/sys'

const props = defineProps({
  data: {
    type: [String, Number]
  },
  type: {
    required: true,
    type: String,
    default: ''
  },
  // 必须绑定一个key用于绑定唯一数据项
  key: {
    required: true
  }
})

const dictData = ref()
const result = ref()

async function handleDict() {
  dictData.value = await getDictById(props.type, true)
  result.value = dictData.value[props.data]
}

watchEffect(() => {
  props.key // 触发绑定key以更新组件
  handleDict()
})
</script>

<style lang="scss"></style>
