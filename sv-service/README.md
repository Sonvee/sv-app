# sv-service

#### 介绍
sv-service 服务端框架

### 前言
1. 用户体系: [sv-id-pages](https://ext.dcloud.net.cn/plugin?id=15141) 基于uni-id-pages开发的用户体系
2. 服务端: [sv-service](https://ext.dcloud.net.cn/plugin?id=16529) 配套的服务端框架
3. 客户端: [sv-client](https://ext.dcloud.net.cn/plugin?id=16530) 配套的客户端框架，配套使用时建议将服务空间关联至sv-service
4. 管理端: [sv-admin](https://ext.dcloud.net.cn/plugin?id=16531) 配套的管理端框架，配套使用时建议将服务空间关联至sv-service

### 特点
1. 云函数url化: 封装uni.request，仿axios写法，对url化的云函数接口进行请求
2. 服务端只做云对象url化接口开发，便于业务接口的分离式开发

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