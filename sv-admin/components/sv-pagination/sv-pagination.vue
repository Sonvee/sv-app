<template>
  <view class="sv-pagination">
    <el-pagination
      v-bind="$attrs"
      class="sv-el-pagination"
      v-model:current-page="pagingParams.pagenum"
      v-model:page-size="pagingParams.pagesize"
      :page-sizes="[5, 10, 20, 30, 40]"
      :pager-count="5"
      :layout="paginationLayout"
      small
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'

/**
 * vue不建议将props绑定为v-model，但是此处修改的是 pagingParams 对象内部的属性，而不是直接替换整个 props 对象
 * Vue 只有在尝试直接修改 props 时发出警告，而对于对象内部属性的修改，Vue 是可以追踪并更新视图的
 */
const props = defineProps({
  pagingParams: {
    type: Object,
    default: () => {
      return {
        pagenum: 1,
        pagesize: 20
      }
    }
  }
})

const paginationLayout = ref('')

JudgeDeviceType()
function JudgeDeviceType() {
  const windowWidth = uni.getSystemInfoSync().windowWidth
  if (windowWidth > 600) {
    paginationLayout.value = 'total, sizes, prev, pager, next, jumper'
  } else {
    paginationLayout.value = 'prev, pager, next, total'
  }
}
</script>

<style lang="scss">
.sv-pagination {
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
