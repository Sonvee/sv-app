<template>
  <el-select class="sv-el-select" v-bind="$attrs" clearable>
    <el-option
      v-for="item in dictData"
      :key="item[keyName]"
      :label="item[keyName]"
      :value="isNaN(Number(item[valueName])) ? item[valueName] : +item[valueName]"
    />
  </el-select>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue'
import { getDictById } from '@/utils/sys'

const props = defineProps({
  // 给定的列表
  dictList: {
    type: Array,
    default: () => []
  },
  // 字典列表，与dictList二选一，优先级大于dictList
  dictType: {
    type: String,
    default: ''
  },
  keyName: {
    type: String,
    default: 'label'
  },
  valueName: {
    type: String,
    default: 'value'
  }
})

const dictData = ref(props.dictList)

async function handleDict() {
  if (props.dictType) {
    dictData.value = await getDictById(props.dictType)
    return
  }
  if (props.dictList) {
    dictData.value = props.dictList
  }
}

watchEffect(() => {
  handleDict()
})
</script>

<style lang="scss"></style>
