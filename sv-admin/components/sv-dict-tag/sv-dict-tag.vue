<template>
  <view>{{ result }}</view>
</template>

<script setup>
import { ref } from 'vue'
import { getDictById } from '@/utils/sys'

const props = defineProps({
  data: {
    type: [Array, String, Number]
  },
  type: {
    required: true,
    type: String,
    default: ''
  }
})

const dictData = ref()
const result = ref()

async function handleDict() {
  dictData.value = await getDictById(props.type, true)
  result.value = dictData.value[props.data]
}
handleDict()
</script>

<style lang="scss"></style>
