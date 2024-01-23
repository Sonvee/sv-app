<template>
  <view class="sv-wangeditor">
    <!-- 将node_modules中的@wangeditor/editor/dist/css/style.css复制到static文件夹下并link引入 -->
    <link href="/static/css/wangeditor-style.css" rel="stylesheet" />
    <Toolbar class="editor-toolbar" :editor="editorIns" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      class="editor-wrapper"
      v-model="htmlValue"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </view>
</template>

<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const props = defineProps({
  html: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:html', 'change'])

const mode = 'simple' // [ default | simple ]
const toolbarConfig = {
  // insertKeys: {
  //   index: 40, // 插入的位置，基于当前的 toolbarKeys
  //   keys: ['menu-key1', 'menu-key2']
  // }
  excludeKeys: []
}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    // wangEditor自带的上传图片文件配置
    uploadImage: {
      // 服务端地址
      server: '/api/upload/image',
      // 上传之前触发
      onBeforeUpload(file) {
        console.log('onBeforeUpload', file)
        return file
      },
      // 上传进度的回调函数
      onProgress(progress) {
        console.log('onProgress', progress)
      },
      // 单个文件上传成功之后
      onSuccess(file, res) {
        console.log('上传成功', file, res)
      },
      // 单个文件上传失败
      onFailed(file, res) {
        console.log('上传失败', file, res)
      },
      // 上传错误，或者触发 timeout 超时
      onError(file, err, res) {
        console.log('上传出错', file, err, res)
      }
    }
  }
}
// 编辑器实例，必须用 shallowRef
const editorIns = shallowRef()
// 富文本内容
const htmlValue = ref(props.html)

watch(htmlValue, (newHtml) => {
  // 纯文本内容
  const newText = editorIns.value.getText()
  // 双向绑定
  emits('update:html', newHtml)
  emits('change', { html: newHtml, text: newText })
})

const handleCreated = (editor) => {
  editorIns.value = editor // 记录 editor 实例，重要！
  console.log('==== editor :', editor.getAllMenuKeys());
  onUploadImage()
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  offUploadImage()
  editorIns.value?.destroy()
  editorIns.value = null
})

function onUploadImage() {
  editorIns.value.on('uploadImage', () => {
    console.log('==== onUploadImage :')
  })
}

function offUploadImage() {
  editorIns.value.off('uploadImage', () => {
    console.log('==== onUploadImage :')
  })
}

defineExpose({
  /**
   * 将editorIns实例暴露出去，可自用调用官方编辑器api
   * @tutorial https://www.wangeditor.com/v5/API.html
   */
  editorIns
})
</script>

<style lang="scss">
.sv-wangeditor {
  width: 100%;
  border: 1px solid #ccc;

  .editor-toolbar {
    border-bottom: 1px solid #ccc;
  }

  .editor-wrapper {
    height: 400px !important;
    overflow-y: hidden;
  }
}
</style>
