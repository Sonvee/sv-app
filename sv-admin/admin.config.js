export default {
  login: {
    url: '/uni_modules/sv-id-pages/pages/login/login-admin' // 登录页面路径
  },
  index: {
    url: '/pages/index/index' // 登录后跳转的第一个页面
  },
  error: {
    notfound: '/pages/error/404', // 404 Not Found
    forbidden: '/pages/error/403', // 403 Forbidden
  },
  navBar: { // 顶部导航
    themes: [{
      text: '白昼',
      value: 'light'
    }, {
      text: '暗夜',
      value: 'dark'
    }],
    debug: {
      enable: process.env.NODE_ENV !== 'production', //是否显示错误信息
      engine: [{ // 搜索引擎配置（每条错误信息后，会自动生成搜索链接，点击后跳转至搜索引擎）
        name: '百度',
        url: 'https://www.baidu.com/baidu?wd=ERR_MSG'
      }, {
        name: '谷歌',
        url: 'https://www.google.com/search?q=ERR_MSG'
      }]
    }
  },
  sideBar: { // 左侧菜单
    // 配置静态菜单列表（放置在用户被授权的菜单列表下边，静态菜单需要加上type:'static'标识）
    staticMenu: [{
        menu_id: 'staticpage',
        parent_id: '',
        name: '静态页面',
        icon: 'admin-icons-page-ent',
        url: '/pages/static-page',
        enable: true,
        sort: 90,
        permission: [],
        type: 'static',
        children: [{
          menu_id: 'staticpage_table_template',
          parent_id: 'staticpage',
          name: '表格模板',
          icon: 'admin-icons-table',
          url: '/pages/static-page/table-template/table-template',
          enable: true,
          sort: 901,
          permission: [],
          type: 'static',
        }, {
          menu_id: 'staticpage_icons',
          parent_id: 'staticpage',
          name: '内置图标',
          icon: 'admin-icons-icon',
          url: '/pages/static-page/icons/icons',
          enable: true,
          sort: 902,
          permission: [],
          type: 'static',
        }]
      },
      {
        menu_id: 'link',
        parent_id: '',
        name: '友情链接',
        icon: 'uni-icons-paperplane',
        url: '',
        enable: true,
        sort: 100,
        permission: [],
        type: 'static',
        children: [{
          menu_id: 'link_uniapp',
          parent_id: 'link',
          name: 'uniapp官网',
          icon: 'sv-icons-uniapp',
          url: 'https://uniapp.dcloud.net.cn',
          enable: true,
          sort: 1001,
          permission: [],
          type: 'static',
        }, {
          menu_id: 'link_wx',
          parent_id: 'link',
          name: '微信公众平台',
          icon: 'uni-icons-weixin',
          url: 'https://mp.weixin.qq.com',
          enable: true,
          sort: 1002,
          permission: [],
          type: 'static',
        }]
      }
    ],
    uniStat: {

    }
  },
  iconHelp: {
    url: 'https://blog.csdn.net/qq_48702470/article/details/134409205' // 如何使用自定义图标
  }
}