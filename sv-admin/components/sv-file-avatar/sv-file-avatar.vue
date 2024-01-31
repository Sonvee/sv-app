<template>
  <uni-file-picker
    v-bind="$attrs"
    v-model="files"
    :image-styles="{
      width: 100,
      height: 100
    }"
    :auto-upload="false"
    fileMediatype="image"
    mode="grid"
    limit="1"
    @select="selectFile"
  />
</template>

<script setup>
import { ref } from 'vue'
import { uploadFile } from '@/utils/util'

const props = defineProps({
  file: {
    type: [Object, String]
  }
})

const emits = defineEmits(['update:file'])

const files = ref(props.file)

/**
 * 图片文件选择
 */
function selectFile(e) {
  const { extname, name, url } = e.tempFiles[0]
  files.value = { extname, url, name: `${Date.now()}-${name}` } // 确保name唯一性
  emits('update:file', files.value)
}

/**
 * 手动上传图片
 */
async function uploadAvatar() {
  if (files.value.url) {
    const upRes = await uploadFile(files.value, 'avatarstorage')
    files.value.url = upRes.fileID // 替换云存储中网络地址
    emits('update:file', files.value)
  }
}

// 手动上传图片
// if (!formData.value.avatar_file?.url) {
//   // 叉掉图片并保存时，如果云端原有图片，则需删除云存储中原文件，并重置路径字段
//   if (props.formInit.avatar_file?.url) {
//     uniCloud.importObject('sv-utils').deleteCloudFile([props.formInit.avatar_file?.url])
//   }
//   /**
//    * @bug uniCloud直接用{}进行update会导致无效，必须对其内部属性统一清空处理
//    * @external https://ask.dcloud.net.cn/question/182139
//    * @todo formData.value.avatar_file = {} 应当直接做清空操作，此处临时使用{extname:'',name:'',url:''}重置处理
//    */
//   formData.value.avatar_file = { extname: '', name: '', url: '' }
// } else {
//   // 修改图片时，需要上传新图片，保存新图片路径，再删除原图片
//   if (props.formInit.avatar_file?.url !== formData.value.avatar_file?.url) {
//     // 图标修改了才上传，否则不上传
//     const upRes = await uploadFile(formData.value.avatar_file, 'avatarstorage')
//     formData.value.avatar_file.url = upRes.fileID // 替换云存储中网络地址
//     // 删除云存储中原文件
//     if (props.formInit.avatar_file?.url) {
//       uniCloud.importObject('sv-utils').deleteCloudFile([props.formInit.avatar_file?.url])
//     }
//   }
// }

defineExpose({
  uploadAvatar
})
</script>

<style lang="scss"></style>
