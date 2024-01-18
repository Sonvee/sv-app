# sv-excel-to-json

Excel与JSON互相转换，源于[EXCEL转JSON函数](https://ext.dcloud.net.cn/plugin?id=6626)插件，使用文档请移步至原插件。

## 本插件仅供本人自用
为防止原插件下架，并稍微调整部分代码。仅供本人自用。还请支持原插件[EXCEL转JSON函数](https://ext.dcloud.net.cn/plugin?id=6626)

## 调整内容
1. 将原插件中的getExcelToJson与getJsonToExcel两个云函数移至插件内部，解决每次导入插件都需要从示例工程中复制这两个云函数至项目中的问题。
2. 修改downloadXLSX方法代码，解决当type为'file'时，会报错Failed to execute 'atob' on 'Window'的atob问题。