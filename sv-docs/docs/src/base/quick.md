# 🚀 快速开始

`sv-app` 基于 `vue3` + `uniapp` + `unicloud` 构建，由 `sv-service` 服务端使用 [unicloud 云对象 url 化](https://doc.dcloud.net.cn/uniCloud/http.html#cloudobject) 编写 api 接口，以便于前端调用，尽可能多的实现前后端分离式开发。部分模块化的功能由基于 [uni_modules](https://uniapp.dcloud.net.cn/plugin/uni_modules.html#uni-modules) 规范的插件实现，便于管理与一键更新，同时也极大的提升了代码复用性，因此在编写插件时需要尽可能多地做到多端兼容。本篇文章将在下文对 `sv-service`、`sv-client`、`sv-admin` 统称为三端。

## 基础知识

您在阅读本篇博客之前，将默认您已了解如下相关基础知识：

1. [Vue3](https://cn.vuejs.org)
2. [uni-app](https://uniapp.dcloud.net.cn)
3. [uniCloud](https://doc.dcloud.net.cn/uniCloud) (在后文中服务端部署云服务空间会有所讲解)
4. [uni_modules](https://uniapp.dcloud.net.cn/plugin/uni_modules.html#uni-modules)
5. [npm](https://www.npmjs.com)

## 立即上手

### DCloud 插件市场导入

在本人的 [插件空间](https://ext.dcloud.net.cn/publisher?id=1173575) 中找到 [sv-service](https://ext.dcloud.net.cn/plugin?id=16529)、 [sv-client](https://ext.dcloud.net.cn/plugin?id=16530)、 [sv-admin](https://ext.dcloud.net.cn/plugin?id=16531) 三端，分别一键导入 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 即可。

### 代码仓库

直接将 `sv-app` 的 [代码仓库](https://gitee.com/Sonve/sv-app) 克隆到本地， 分别导入至 HBuilderX 中打开即可 (不要直接导入 sv-app 目录，而是分别导入 sv-app 下的三端)。

## 下一步

此时你已将三端框架成功下载到本地，接来下根据对应端的框架介绍进行操作即可。

- [sv-service](/src/frame/sv-service/sv-service) 服务端
- [sv-client](/src/frame/sv-client/sv-client) 客户端
- [sv-admin](/src/frame/sv-admin/sv-admin) 管理端
