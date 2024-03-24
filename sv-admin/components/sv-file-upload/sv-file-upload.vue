<template>
  <uni-file-picker
    v-model="files"
    ref="filePickerRef"
    mode="list"
    return-type="array"
    :file-mediatype="fileMediatype"
    :limit="limit"
    :list-styles="listStyles"
    :auto-upload="false"
    @success="success"
    @select="select"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  file: {
    type: Array,
    default: []
  },
  limit: {
    type: Number,
    default: 5
  },
  fileMediatype: {
    type: String,
    default: 'all' // image/video/all
  },
  listStyles: {
    type: Object,
    default: () => {
      return {
        borderStyle: {
          color: '#eee', // 边框颜色
          width: '1px', // 边框宽度
          style: 'solid', // 边框样式
          radius: '5px' // 边框圆角，不支持百分比
        },
        border: false, // 是否显示边框
        dividline: true // 是否显示分隔线
      }
    }
  }
})

const emits = defineEmits(['success'])

const files = ref(props.file)

const filePickerRef = ref()

function success() {
  const handleFiles = files.value?.map((item) => {
    return {
      extname: item.extname,
      fileType: item.fileType,
      name: item.name,
      size: item.size,
      url: item.url
    }
  })
  emits('success', handleFiles)

  // 还需排查出删除了哪些文件，做无感删除
  const unique = findUnique(props.file, handleFiles)
  if (unique?.length > 0) {
    const delFiles = unique.map((item) => item.url)
    uniCloud.importObject('sv-utils').deleteCloudFile(delFiles)
  }
}

// 是否只做了删除操作，没有新增
const delFlag = ref(false)

function select() {
  delFlag.value = false
}

watch(
  files,
  (newVal) => {
    // 判断是否只做了删除操作
    if (isSubArray(props.file, newVal)) {
      delFlag.value = true
    }
  },
  { immediate: true }
)

// 查询第二个数组是否是第一个数组的子集
function isSubArray(parentArray, childArray) {
  // 确保childArray中的所有元素都在parentArray中存在（基于url属性，判断子集）
  return childArray.every((childItem) =>
    parentArray.some((parentItem) => parentItem.url === childItem.url)
  )
}

// 查找第一个数组中有但是第二个数组中没有的项
function findUnique(array1, array2) {
  // 将每个数组转为只包含url的新数组
  const urls1 = array1.map((item) => item.url)
  const urls2 = array2.map((item) => item.url)

  // 创建urls2的Set以提高查找效率
  const set2Urls = new Set(urls2)

  // 找出仅存在于数组1中的url对应的原始对象
  const uniqueInArray1 = array1.filter((item1) => !set2Urls.has(item1.url))

  return uniqueInArray1
}

function uploadFiles() {
  if (delFlag.value) {
    success()
  } else {
    filePickerRef.value.upload()
  }
}

defineExpose({
  uploadFiles
})
</script>

<style lang="scss"></style>
