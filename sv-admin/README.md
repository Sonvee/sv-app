# sv-admin

#### 介绍
sv-admin 管理端框架

### 预览
账号：visitor

密码：visitor666

[在线体验sv-admin](https://static-mp-74bfcbac-6ba6-4f39-8513-8831390ff75a.next.bspapp.com/admin/#/uni_modules/sv-id-pages/pages/login/login-admin)

### 前言
1. 用户体系: [sv-id-pages](https://ext.dcloud.net.cn/plugin?id=15141) 基于uni-id-pages开发的用户体系
2. 服务端: [sv-service](https://ext.dcloud.net.cn/plugin?id=16529) 配套的服务端框架
3. 客户端: [sv-client](https://ext.dcloud.net.cn/plugin?id=16530) 配套的客户端框架，配套使用时建议将服务空间关联至sv-service
4. 管理端: [sv-admin](https://ext.dcloud.net.cn/plugin?id=16531) 配套的管理端框架，配套使用时建议将服务空间关联至sv-service

### 特点
1. 云函数url化: 封装uni.request，仿axios写法，对url化的云函数接口进行请求
2. 状态管理: pinia状态管理仓库，基于[pinia-plugin-unistorage](https://ext.dcloud.net.cn/plugin?id=8081)的状态持久化
3. 组件库: 基于[element-plus](https://element-plus.gitee.io/zh-CN/)的 vue3 H5端组件库
4. 图标库: 内置uni-icons与admin-icons图标库，以及用户自定义sv-icons图标库，与sv-admin端同步，详情请移步博客: [`在uniapp、uni-admin中使用阿里巴巴矢量库自定义字体图标`](https://blog.csdn.net/qq_48702470/article/details/134409205)
5. 工具库: vueuse，lodash，dayjs(element-plus内置了dayjs)等
6. 管理端只考虑web端或响应式开发样式，不考虑打包除H5外其他端

### 项目初始化首要配置项
1. configs/index.js
```
const base_url = 'https://fc-xxxxxx.next.bspapp.com' // 云函数URL化基础路径
const base_cdn = 'https://xxxxxx.cdn.bspapp.com' // 云存储下载域名
```

2. cloudfunctions中诸如sv-api开头的皆依赖于common中sv-handler，因此需要给这些api云对象安装依赖

  安装方式：在sv-api开头的api云对象文件夹上鼠标右键管理公共模块或扩展库依赖，在选择项目下的公共模块中勾选sv-handler（uniCloud扩展库中JQL语法支持库按需添加），勾选后同鼠标右键使用命令行窗口打开所在目录，运行命令：`npm i`
  

3. 云对象路径配置（重要）

    打开云服务空间，选择 云函数/云对象 -> 函数/对象列表 -> 某云对象详情按钮 -> 云函数URL化板块中的编辑按钮，在基础路径后面加上 `/api/自己起的各云对象路径标识名` 例如sv-api-id就是`/api/svid` 、sv-api-sys是`/api/sys` 、sv-api-test是`/api/test`... 

    后续开发者若需要自己添加接口，则需要在云服务空间添加的云对象此处同样地设置接口基本路径，然后在项目中的service/api文件夹下的各api的js文件中的request方法中携带接口地址
    

4. 内置了菜单、角色表、权限表、字典表的默认初始数据，位于database下的 opendb-admin-menus.init_data.json 、 uni-id-roles.init_data.json 及  uni-id-permission.init_data.json 、 sv-sys-dict.init_data.json 可鼠标右键初始化云数据库数据


### 结语
本应用体系还在不断完善中...