<template>
  <el-select
    :class="['nav-search', show ? 'stretch' : 'shrink']"
    v-model="searchValue"
    filterable
    remote
    reserve-keyword
    placeholder="搜索"
    :remote-method="querySearch"
    :loading="loading"
    @change="querySelect"
  >
    <el-option v-for="item in routeOptions" :key="item.url" :label="item.name" :value="item.url" />
  </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { clickMenuItem, getMenuNode } from '@/utils/sys'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const routeNode = ref([])
const routeOptions = ref([])
const searchValue = ref('')
const loading = ref(false)

async function handleMenuNode() {
  const menu = await getMenuNode()
  routeNode.value = menu
}

function querySearch(query) {
  if (query) {
    loading.value = true
    routeOptions.value = routeNode.value.filter((item) => item.name.includes(query))
    loading.value = false
  } else {
    routeOptions.value = []
  }
}

function querySelect(e) {
  // 跳转对应路径页面
  clickMenuItem(e)
  searchValue.value = ''
  routeOptions.value = []
}

defineExpose({
  handleMenuNode
})
</script>

<style lang="scss">
.nav-search {
  width: 0;
  transition: width 0.8s;

  @include useTheme {
    :deep(.el-select__wrapper) {
      transition: padding 0.8s;
      background-color: unset !important;
      --el-select-multiple-input-color: #{getTheme('sv-admin-text-color')} !important;
    }
  }
}
.stretch {
  width: 160px;
}
.shrink {
  width: 0;

  :deep(.el-select__wrapper) {
    padding: 0;
  }
}
</style>
