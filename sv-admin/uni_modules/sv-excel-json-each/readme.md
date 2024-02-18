# sv-excel-json-each

Excel与JSON互相转换，源于[EXCEL转JSON函数](https://ext.dcloud.net.cn/plugin?id=6626)插件，使用文档请移步至原插件。

## 本插件仅供本人自用
根据原[EXCEL转JSON函数](https://ext.dcloud.net.cn/plugin?id=6626)插件调整部分代码，仅供本人自用。

还请支持原插件[EXCEL转JSON函数](https://ext.dcloud.net.cn/plugin?id=6626)

## 改动内容
1. 将原插件中的getExcelToJson与getJsonToExcel两个云函数改为sv-excel-json-each云对象，并放至插件内部，解决每次导入插件都需要从示例工程中复制云对象移至项目中的问题，现一键导入即可。
2. 修改jssdk/parseExcel.js文件中downloadXLSX方法代码，修复原插件可能会报错Failed to execute 'atob' on 'Window'问题。
3. 原插件中parseExcel.js文件中downloadXLSX方法已被我移除，已用其他可兼容H5、安卓App、微信小程序三端的方式代替。
4. 较大规模改动parseExcel.js文件，重要改动如下：
  
    1. 由于uni.chooseFile只支持H5端，现添加微信小程序的wx.chooseMessageFile和App端Native.js(目前只支持安卓)调用文件选择面板，因此现已兼容H5、安卓App、微信小程序三端。
    2. 修改当type为base64模式时，不提供自动下载功能，仅当type为file模式时开启autoDownload才提供自动下载功能


## 写在最后
若对插件有任何疑问或者优化建议，欢迎在评论区留言，在插件市场中的私信消息本人可能不经常留意，导致没能及时回复，
可以加入本人的插件问答QQ交流群: 852637893，欢迎进群交流。

<img width="200" src="https://mp-0ecede5c-a993-48bf-ba4b-45d9a8c7e79b.cdn.bspapp.com/resource/qqqun.jpg" alt="交流群:852637893"/>
