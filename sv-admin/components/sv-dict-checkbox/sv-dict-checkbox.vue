<template>
  <el-checkbox-group v-bind="$attrs">
    <el-checkbox v-for="item in dictData" :key="item[keyName]" :value="item[keyName]" :min="1">
      {{ item[valueName] }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
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

watchEffect(() => {
  handleDict()
})
</script>

<style lang="scss"></style>
