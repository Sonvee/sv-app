<template>
  <el-radio-group v-bind="$attrs">
    <el-radio
      v-for="item in dictData"
      :key="item[keyName]"
      :label="isNaN(Number(item[keyName])) ? item[keyName] : +item[keyName]"
    >
      {{ item[valueName] }}
    </el-radio>
  </el-radio-group>
</template>

<script setup>
import { ref } from 'vue'
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
  }
}
handleDict()
</script>

<style lang="scss"></style>
