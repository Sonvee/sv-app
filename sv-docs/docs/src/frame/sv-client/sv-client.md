# 客户端

:::warning 请注意
使用 uniapp 开发时，由于 uni 内部已封装好页面路由模块(pages.json，类似于微信小程序开发)，而且不借助外力(路由插件)的情况下，并不能使用类似于 vue-router 形式来写，并且市面上绝大多数可以模拟 vue-router 书写方式的路由插件也无法提供 router-view，而且 App.vue 中常规下无法使用 template 标签，因此几乎无法像普通 vue 开发项目在 App.vue 中使用 router-view 来开设公共区域以供整个项目共享同一个组件例如头部导航栏或者底部菜单栏，所以在客户端中 `components/sv-page` 这一页面级组件充当了这一功能，以组件复用的写法来实现公共的页面布局、主题换肤等，但是本质上并非像 router-view 那样真正的共用同一组件，但是可能这也是目前唯一相对较好的方案了，当然如若有建议还望反馈我，谢谢。(此处先不讨论部分优秀的但是需要部分付费的路由插件例如 v3 版 [Uni Simple Router](https://www.hhyang.cn)，如有错误还望指正)
:::
