<template>
  <view class="sp-editor">
    <PickerColor ref="colorPicker" :color="{ r: 0, g: 0, b: 0, a: 1 }" @confirm="confirmColor"></PickerColor>

    <view class="sp-editor-toolbar" @tap="format">
      <view
        :class="formats.bold ? 'ql-active' : ''"
        class="iconfont icon-zitijiacu"
        title="加粗"
        data-name="bold"
      ></view>
      <view
        :class="formats.italic ? 'ql-active' : ''"
        class="iconfont icon-zitixieti"
        title="斜体"
        data-name="italic"
      ></view>
      <view
        :class="formats.underline ? 'ql-active' : ''"
        class="iconfont icon-zitixiahuaxian"
        title="下划线"
        data-name="underline"
      ></view>
      <view
        :class="formats.strike ? 'ql-active' : ''"
        class="iconfont icon-zitishanchuxian"
        title="删除线"
        data-name="strike"
      ></view>
      <!-- #ifndef MP-BAIDU -->
      <view
        :class="formats.align === 'left' ? 'ql-active' : ''"
        class="iconfont icon-zuoduiqi"
        title="左对齐"
        data-name="align"
        data-value="left"
      ></view>
      <!-- #endif -->
      <view
        :class="formats.align === 'center' ? 'ql-active' : ''"
        class="iconfont icon-juzhongduiqi"
        title="居中对齐"
        data-name="align"
        data-value="center"
      ></view>
      <view
        :class="formats.align === 'right' ? 'ql-active' : ''"
        class="iconfont icon-youduiqi"
        title="右对齐"
        data-name="align"
        data-value="right"
      ></view>
      <view
        :class="formats.align === 'justify' ? 'ql-active' : ''"
        class="iconfont icon-zuoyouduiqi"
        title="两端对齐"
        data-name="align"
        data-value="justify"
      ></view>
      <!-- #ifndef MP-BAIDU -->
      <view
        :class="formats.lineHeight ? 'ql-active' : ''"
        class="iconfont icon-line-height"
        title="行间距"
        data-name="lineHeight"
        data-value="2"
      ></view>
      <view
        :class="formats.letterSpacing ? 'ql-active' : ''"
        class="iconfont icon-Character-Spacing"
        title="字间距"
        data-name="letterSpacing"
        data-value="2em"
      ></view>
      <view
        :class="formats.marginTop ? 'ql-active' : ''"
        class="iconfont icon-722bianjiqi_duanqianju"
        title="段前距"
        data-name="marginTop"
        data-value="20px"
      ></view>
      <view
        :class="formats.marginBottom ? 'ql-active' : ''"
        class="iconfont icon-723bianjiqi_duanhouju"
        title="段后距"
        data-name="marginBottom"
        data-value="20px"
      ></view>
      <!-- #endif -->

      <!-- #ifndef MP-BAIDU -->
      <view
        :class="formats.fontFamily ? 'ql-active' : ''"
        class="iconfont icon-font"
        title="字体"
        data-name="fontFamily"
        data-value="Pacifico"
      ></view>
      <view
        :class="formats.fontSize === '24px' ? 'ql-active' : ''"
        class="iconfont icon-fontsize"
        title="字号"
        data-name="fontSize"
        data-value="24px"
      ></view>
      <!-- #endif -->
      <view
        :style="{ color: textColor }"
        class="iconfont icon-text_color"
        title="文字颜色"
        data-name="color"
        :data-value="textColor"
      ></view>
      <view
        :style="{ color: backgroundColor }"
        class="iconfont icon-fontbgcolor"
        title="背景颜色"
        data-name="background-color"
        :data-value="backgroundColor"
      ></view>
      <view class="iconfont icon-date" title="日期" @tap="insertDate"></view>
      <view class="iconfont icon--checklist" title="待办" data-name="list" data-value="check"></view>
      <view
        :class="formats.list === 'ordered' ? 'ql-active' : ''"
        class="iconfont icon-youxupailie"
        title="有序列表"
        data-name="list"
        data-value="ordered"
      ></view>
      <view
        :class="formats.list === 'bullet' ? 'ql-active' : ''"
        class="iconfont icon-wuxupailie"
        title="无序列表"
        data-name="list"
        data-value="bullet"
      ></view>

      <view class="iconfont icon-outdent" title="段前缩进" data-name="indent" data-value="-1"></view>
      <view class="iconfont icon-indent" title="段后缩进" data-name="indent" data-value="+1"></view>
      <view class="iconfont icon-fengexian" title="分割线" @click="insertDivider"></view>

      <view
        :class="formats.header === 1 ? 'ql-active' : ''"
        class="iconfont icon-format-header-1"
        title="标题"
        data-name="header"
        :data-value="1"
      ></view>
      <view
        :class="formats.script === 'sub' ? 'ql-active' : ''"
        class="iconfont icon-zitixiabiao"
        title="下标"
        data-name="script"
        data-value="sub"
      ></view>
      <view
        :class="formats.script === 'super' ? 'ql-active' : ''"
        class="iconfont icon-zitishangbiao"
        title="上标"
        data-name="script"
        data-value="super"
      ></view>

      <view
        :class="formats.direction === 'rtl' ? 'ql-active' : ''"
        class="iconfont icon-direction-rtl"
        title="文本方向"
        data-name="direction"
        data-value="rtl"
      ></view>

      <!-- <view class="iconfont icon-yinyong" @tap="insertTemplate"></view> -->

      <view class="iconfont icon-charutupian" title="图片" @tap="insertImage"></view>
      <view class="iconfont icon-undo" title="撤销" @tap="undo"></view>
      <view class="iconfont icon-redo" title="重做" @tap="redo"></view>

      <view class="iconfont icon-clearedformat" title="清除格式" @tap="removeFormat"></view>
      <view class="iconfont icon-shanchu" title="清空" @tap="clear"></view>
    </view>

    <view class="sp-editor-wrapper">
      <editor
        id="editor"
        class="editor-container"
        show-img-size
        show-img-toolbar
        show-img-resize
        :placeholder="placeholder"
        :read-only="readOnly"
        @statuschange="onStatusChange"
        @ready="onEditorReady"
        @input="onEditorInput"
      ></editor>
    </view>
  </view>
</template>

<script>
import PickerColor from './color-picker.vue'
export default {
  components: {
    PickerColor
  },
  props: {
    placeholder: {
      type: String,
      default: '写点什么吧 ~'
    },
    // 是否只读
    readOnly: {
      type: Boolean,
      default: false
    },
    // 最大字数限制，-1不限
    maxlength: {
      type: Number,
      default: -1
    },
    // 初始模板
    templates: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formats: {},
      textColor: '',
      backgroundColor: '',
      curColor: 'text',
      toolbarHeight: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 获取sp-editor-toolbar高度
      uni
        .createSelectorQuery()
        .in(this)
        .select('.sp-editor-toolbar')
        .boundingClientRect((data) => {
          this.toolbarHeight = data.height + 'px'
        })
        .exec()
    })
  },
  methods: {
    onEditorReady() {
      // #ifdef MP-BAIDU
      this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor')
      // #endif

      // #ifdef APP || MP-WEIXIN || H5
      uni
        .createSelectorQuery()
        .in(this)
        .select('#editor')
        .context((res) => {
          this.editorCtx = res.context
          this.$emit('init', this.editorCtx)
          // 启用preRender方法时会预先渲染templates内容，但是在小程序中会导致页面自动聚焦至富文本的区域
          if (this.templates) {
            this.preRender()
          }
        })
        .exec((result) => {})
      // #endif
    },
    preRender() {
      // 初始化富文本时自带的文字模板
      this.editorCtx.setContents({
        html: this.templates
      })
    },
    undo() {
      this.editorCtx.undo()
    },
    redo() {
      this.editorCtx.redo()
    },
    format(e) {
      let { name, value } = e.target.dataset
      if (!name) return
      // console.log('==== name :', name)
      switch (name) {
        case 'color':
        case 'background-color':
          this.curColor = name
          this.showPicker()
          break
        default:
          this.editorCtx.format(name, value)
          break
      }
    },
    showPicker() {
      this.$refs.colorPicker.open()
    },
    confirmColor(e) {
      switch (this.curColor) {
        case 'color':
          this.textColor = e.hex
          this.editorCtx.format('color', e.hex)
          break
        case 'background-color':
          this.backgroundColor = e.hex
          this.editorCtx.format('background-color', e.hex)
          break
      }
      // 建议在更改颜色时，插入一个空以重置颜色区块，否则可能会导致颜色切换失效
      this.editorCtx.insertText({ text: '' })
    },
    onStatusChange(e) {
      this.formats = e.detail
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          // console.log('insert divider success')
        }
      })
    },
    clear() {
      uni.showModal({
        title: '清空编辑器',
        content: '确定清空编辑器吗？',
        success: ({ confirm }) => {
          if (confirm) {
            this.editorCtx.clear({
              success: function (res) {
                console.log('clear success')
              }
            })
          }
        }
      })
    },
    removeFormat() {
      uni.showModal({
        title: '文本格式化',
        content: '确定要清除所选择部分文本块格式吗？',
        showCancel: true,
        success: ({ confirm }) => {
          if (confirm) {
            this.editorCtx.removeFormat()
          }
        }
      })
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({ text: formatDate })
    },
    insertImage() {
      // #ifdef APP-PLUS || H5
      uni.chooseImage({
        // count: 1, // 默认9
        success: (res) => {
          const { tempFiles } = res
          // 将文件和编辑器示例抛出，由开发者自行上传和插入图片
          this.$emit('upinImage', tempFiles, this.editorCtx)
        },
        fail() {
          uni.showToast({
            title: '未授权访问相册权限，请授权后使用',
            icon: 'none'
          })
        }
      })
      // #endif

      // #ifdef MP-WEIXIN
      // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
      uni.chooseMedia({
        // count: 1, // 默认9
        success: (res) => {
          // 同上chooseImage处理
          const { tempFiles } = res
          this.$emit('upinImage', tempFiles, this.editorCtx)
        },
        fail() {
          uni.showToast({
            title: '未授权访问相册权限，请授权后使用',
            icon: 'none'
          })
        }
      })
      // #endif
    },
    onEditorInput(e) {
      let maxlength = parseInt(this.maxlength)

      this.editorCtx.getContents({
        success: (res) => {
          let { html, text } = res
          let textStr = text.replace(/\s/g, '')

          if (textStr.length > maxlength && maxlength != -1) {
            uni.showModal({
              content: `超过${maxlength}字数啦~`,
              confirmText: '确定',
              showCancel: false,
              success: () => {
                this.$emit('overMax', { html, text })
              }
            })
          } else {
            this.$emit('input', { html, text })
          }
        }
      })
    },
    /**
     * 内嵌模板-暂时弃用
     * 若有模版一键导入等开发需求，还请大致模仿insertTemplate方法自行开发
     * 若内嵌模板的需求呼声很高，我会后续考虑更新扩展该插件功能
     */
    insertTemplate() {
      let temp = '<div>内嵌模板</div>'
      this.editorCtx.setContents({ html: temp })
    }
  }
}
</script>

<style lang="scss">
@import './editor-icon.css';

.sp-editor {
  height: 100%;
}

.iconfont {
  display: inline-block;
  padding: 16rpx 16rpx;
  width: 46rpx;
  height: 46rpx;
  cursor: pointer;
  font-size: 20px;
}

.sp-editor-toolbar {
  box-sizing: border-box;
  padding-bottom: 12rpx;
  border-bottom: 1px solid #e4e4e4;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}

.sp-editor-wrapper {
  height: calc(100% - v-bind(toolbarHeight));
  overflow: hidden;
}

.editor-container {
  padding: 8rpx 16rpx;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-size: 16px;
  line-height: 1.5;
}

::v-deep .ql-editor.ql-blank::before {
  font-style: normal;
  color: #cccccc;
}

.ql-active {
  color: #66ccff;
}
</style>
