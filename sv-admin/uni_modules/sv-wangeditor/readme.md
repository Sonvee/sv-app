# sv-wangeditor

## 前言
本插件仅推荐H5端使用，目前仅支持vue3

需要引入wangEditor官方包

    yarn add @wangeditor/editor
    yarn add @wangeditor/editor-for-vue@next
    
## 文档
[wangEditor官方文档](https://www.wangeditor.com/v5/for-frame.html#vue3)

## 使用

### 使用前准备操作
1. 将node_modules中的@wangeditor/editor/dist/css/style.css复制到项目根目录static/css文件夹中，并改名为wangeditor-style.css
2. 因为uniapp在编译时会将h5原生button等标签转换为uni-button从而导致样式失效，故将样式文件放置static中，并通过link引入才能规避uniapp这一bug（本插件内部已经link引入，无需您再进行link引入，您只需完成1步骤把css文件弄好）
3. 因为在进行上传图片或视频等文件资源时，有必要进行删除的操作，故需要使用unicloud云对象进行文件删除，使用前请上传插件内置的sv-utils云对象。（如果您不使用unicloud作为后端，则需要将插件源码中有关unicloud的代码删除并改为你与后端交互的操作，一个是customUpload方法中图片和视频上传的操作，一个是save方法中删除文件的操作，也不要忘记删除插件中的uniCloud文件夹）

### 使用方式
1. 直接导入插件，并使用
```
  <sv-wangeditor
    v-if="showEditor"
    v-model:html="formData.comment"
    ref="editorRef"
    :toolbarConfig="toolbarConfig"
    mode="default"
    @change="changeEditor"
    @save="saveEditor"
  ></sv-wangeditor>
```

各参数说明：

① v-if="showEditor"：是否显示编辑器，使用v-if可以有效的销毁组件以及释放内存

② v-model:html：双向绑定编辑器中的内容，这里双向绑定的是html格式的富文本内容，string类型

③ ref：使用ref以获取编辑器实例，从而可以调用组件内部对象和方法，暂时已暴露的对象和方法有：
editorIns (编辑器实例对象，可以手动使用该实例去自由调用wangEditor官方更加丰富的编辑器api，详见[编辑器 API](https://www.wangeditor.com/v5/API.html))，
save (手动触发结束编辑操作，会相应的触发@save回调)

④ toolbarConfig：toolbar配置项，该配置项较为复杂，一般默认就行了，如有特殊需求还请详见官方文档[工具栏配置](https://www.wangeditor.com/v5/toolbar-config.html)

⑤ mode：编辑器模式，可选 default | simple ，默认default

⑥ @change({ html, text })：内容改变事件，返回html格式的内容以及text纯文本格式的内容

⑦ @save：结束编辑，由上处ref.save()的方法触发，在此处你可以自定义一些结束编辑后的操作

2. 其他

① 如果你希望能指定富文本上传图片或视频时云存储中的保存位置，可以在插件源码中调整uploadFile方法的cloudPath参数
```
// 文件上传
let cloundFile = await uniCloud.uploadFile({
  filePath: fileURL,
  // 同名会导致报错 policy_does_not_allow_file_overwrite
  // cloudPath可由 想要存储的文件夹/文件名 拼接，若不拼文件夹名则默认存储在cloudstorage文件夹中
  cloudPath: `cloudstorage/${Date.now()}_${file.name}`,
  cloudPathAsRealPath: true
})
```

② 该组件内部已进行高度计算，使用时建议在外层套一个父盒子，父盒子给宽高，编辑器会自动填满父盒子

③ 编辑器可能会报出警告：`编辑区域高度 < 300px 这可能会导致 modal hoverbar 定位异常` 
尚不明确导致该警告的原因，因为编辑器的高度大于300px的情况下也会报该警告，但该警告不影响使用，可忽略

## 结语
该组件可能还有很多地方有待优化，本人会持续跟进，在使用过程中遇到问题可以评论留言，望好评，谢谢