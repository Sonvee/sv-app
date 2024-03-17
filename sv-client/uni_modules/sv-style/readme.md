# sv-style

## 介绍
1. 该模块化样式库插件适用于 [sv-client](https://ext.dcloud.net.cn/plugin?id=16530)、[sv-admin](https://ext.dcloud.net.cn/plugin?id=16531) 等模块化引入并做统一化样式更新处理
2. 该插件使用 [colorui](https://ext.dcloud.net.cn/plugin?id=239) 作为css原子类样式库使用，并扩充了部分自定义的扩展类
3. 动画部分主要基于 [animista](https://animista.net/)、colorui内置的动画、以及部分自定义扩展动画类
4. icon图标部分主要基于 [阿里巴巴矢量库](https://www.iconfont.cn/)、colorui的字体图标、uni-icons、uni-admin-icons
5. 内置主题颜色主要基于 uni.scss、colorui的主题色、以及部分自定义主题色
6. 主题皮肤切换功能（基于sass）需配合 [sv-client](https://ext.dcloud.net.cn/plugin?id=16530)、[sv-admin](https://ext.dcloud.net.cn/plugin?id=16531) 使用
7. 该插件不包含任何的js代码，仅包含css/sass样式

## 使用方式
1. 在根目录 App.vue 文件中引入 @import '@/uni_modules/sv-style/scss/style.scss';
2. 在根目录 uni.scss 文件中引入 @import '@/uni_modules/sv-style/scss/theme.scss';
3. 启动动画需要在根目录 index.html 文件中引入 app-loader.css 样式并将 id="app" 的盒子修改成如下：
```
<link rel="stylesheet" href="/uni_modules/sv-style/css/app-loader.css" />

...

<div id="app">
  <!--app-html-->
  <div class="app-loader-container">
    <div class="sv-index-loader"></div>
    <div class="sv-text-streamer" style="margin-top: 20px;">正在努力往上爬</div>
  </div>
</div>
```

## 其他
`本模块化插件偏向于作者自用，概不负责其他项目使用时出现的问题`