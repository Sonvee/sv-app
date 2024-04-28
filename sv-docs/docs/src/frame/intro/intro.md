# 框架概况

## 服务端目录结构

```
sv-service
├─ uniCloud-aliyun       # uniCloud目录
│  ├─ cloudfunctions     # 云函数目录
│  │  ├─ common          # 公共模块
│  │  └─ ...             # 云对象
│  └─ database           # 数据库目录
│     └─ ...             # 数据库表及扩展
├─ api                   # api目录
│  ├─ test.js            # api文件
│  └─ ...
├─ pages                 # 页面目录
│  ├─ index
│  │  └─ index.vue
│  └─ ...
├─ static                # 静态资源目录
│  ├─ logo.png
│  └─ ...
├─ uni_modules           # uni_modules目录，所有插件模块
│  ├─ sv-configs
│  ├─ sv-system
│  ├─ sv-id-pages
│  ├─ sv-id-vip
│  └─ ...
├─ .gitignore            # git忽略文件
├─ App.vue
├─ index.html
├─ main.js
├─ manifest.json
├─ pages.json            # 页面配置文件
├─ README.md
├─ uni.promisify.adaptor.js
└─ uni.scss              # 全局scss变量
```

## 客户端目录结构

```
sv-client
├─ uniCloud-aliyun       # uniCloud目录
│  ├─ cloudfunctions     # 云函数目录
│  │  ├─ common          # 公共模块
│  │  └─ ...             # 云对象
│  └─ database           # 数据库目录
│     └─ ...             # 数据库表及扩展
├─ api                   # api目录
│  ├─ test.js            # api文件
│  └─ ...
├─ components            # 组件目录
│  ├─ sv-page
│  ├─ sv-tab-bar
│  ├─ sv-nav-bar
│  └─ ...
├─ node_modules          # node_modules目录，npm依赖包存放位置
│  └─ ...
├─ pages                 # 页面目录
│  ├─ index
│  │  └─ index.vue
│  └─ ...
├─ router                # 此处并非vue-router目录，而是存放的对pages页面路由进行相关处理的文件
│  ├─ page-router.js     # 对pages.json路由表进行匹配处理的方法，以数组形式返回项目路由，通常开发无需使用到此文件
│  └─ ...
├─ static                # 静态资源目录
│  ├─ logo.png           # 客户端logo
│  └─ ...
├─ store                 # pinia状态仓库目录
│  ├─ sys.js             # 系统仓库
│  ├─ svid.js            # 用户仓库
│  └─ ...
├─ uni_modules           # uni_modules目录，所有插件模块
│  ├─ sv-configs
│  ├─ sv-system
│  ├─ sv-id-pages
│  ├─ sv-id-vip
│  ├─ sv-style
│  └─ ...
├─ utils                 # 工具类目录
│  ├─ pinia-storage.js   # 对pinia仓库集中处理方法
│  ├─ preprocess.js      # App启动预处理
│  ├─ sys.js             # 系统工具方法
│  ├─ util.js            # 常用工具方法
│  └─ ...
├─ unpackage             # 打包目录
│  └─ ...
├─ .gitignore            # git忽略文件
├─ App.vue
├─ client.config.js      # 客户端配置文件
├─ index.html
├─ main.js
├─ manifest.json
├─ package.json          # node依赖包配置文件
├─ pages.json            # 页面配置文件
├─ README.md
├─ uni.promisify.adaptor.js
└─ uni.scss              # 全局scss变量
```

## 管理端目录结构

```
sv-admin
├─ uniCloud-aliyun       # uniCloud目录
│  ├─ cloudfunctions     # 云函数目录
│  │  ├─ common          # 公共模块
│  │  └─ ...             # 云对象
│  └─ database           # 数据库目录
│     └─ ...             # 数据库表及扩展
├─ api                   # api目录
│  ├─ test.js            # api文件
│  └─ ...
├─ components            # 组件目录
│  └─ ...
├─ layout                # 布局目录，顶部导航栏+左侧菜单栏+主内容布局
│  └─ ...
├─ node_modules          # node_modules目录，npm依赖包存放位置
│  └─ ...
├─ pages                 # 页面目录
│  ├─ index
│  │  └─ index.vue
│  └─ ...
├─ router                # 此处并非vue-router目录，而是存放的对pages页面路由进行相关处理的文件
│  ├─ route-watcher.js   # 全局路由监听者，包含页面路由鉴权规则，可以在此配置只对特定角色或权限开放页面
│  └─ ...
├─ static                # 静态资源目录
│  ├─ logo.png           # 管理端logo
│  ├─ favicon.ico        # 管理端favicon
│  └─ ...
├─ store                 # pinia状态仓库目录
│  ├─ sys.js             # 系统仓库
│  ├─ svid.js            # 用户仓库
│  ├─ nav.js             # 导航栏历史仓库
│  └─ ...
├─ uni_modules           # uni_modules目录，所有插件模块
│  ├─ sv-configs
│  ├─ sv-system
│  ├─ sv-id-pages
│  ├─ sv-id-vip
│  ├─ sv-style
│  └─ ...
├─ utils                 # 工具类目录
│  ├─ pinia-storage.js   # 对pinia仓库集中处理方法
│  ├─ preprocess.js      # App启动预处理
│  ├─ sys.js             # 系统工具方法
│  ├─ util.js            # 常用工具方法
│  ├─ verification.js    # 表单验证规则
│  └─ ...
├─ unpackage             # 打包目录
│  └─ ...
├─ .gitignore            # git忽略文件
├─ App.vue
├─ client.config.js      # 客户端配置文件
├─ index.html
├─ main.js
├─ manifest.json
├─ package.json          # node依赖包配置文件
├─ pages.json            # 页面配置文件
├─ README.md
├─ uni.promisify.adaptor.js
└─ uni.scss              # 全局scss变量
```
