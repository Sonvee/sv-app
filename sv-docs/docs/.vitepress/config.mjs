import { defineConfig } from "vitepress";

const frameMenu = {
  text: "框架",
  items: [
    {
      text: "概况",
      link: "/src/frame/intro/intro",
    },
    {
      text: "服务端",
      link: "/src/frame/sv-service/sv-service",
    },
    {
      text: "客户端",
      link: "/src/frame/sv-client/sv-client",
    },
    {
      text: "管理端",
      link: "/src/frame/sv-admin/sv-admin",
    },
  ],
};

const pluginsMenu = {
  text: "插件",
  items: [
    {
      text: "概况",
      link: "/src/plugins/intro/intro",
    },
    {
      text: "配置模块",
      link: "/src/plugins/sv-configs/sv-configs",
    },
    {
      text: "样式模块",
      link: "/src/plugins/sv-style/sv-style",
    },
    {
      text: "系统模块",
      link: "/src/plugins/sv-system/sv-system",
    },
    {
      text: "用户体系",
      link: "/src/plugins/sv-id-pages/sv-id-pages",
    },
    {
      text: "会员体系",
      link: "/src/plugins/sv-id-vip/sv-id-vip",
    },
    {
      text: "支付模块",
      link: "/src/plugins/sv-pay/sv-pay",
    },
    {
      text: "广告模块",
      link: "/src/plugins/sv-ad/sv-ad",
    },
    {
      text: "富文本模块",
      link: "/src/plugins/sv-wangeditor/sv-wangeditor",
    },
    {
      text: "Excel 数据互转",
      link: "/src/plugins/sv-excel-json-each/sv-excel-json-each",
    },
    {
      text: "Json 数据预览",
      link: "/src/plugins/sv-json-view/sv-json-view",
    },
    {
      text: "返回拦截",
      link: "/src/plugins/sv-intercept-back/sv-intercept-back",
    },
    {
      text: "动态录入",
      link: "/src/plugins/sv-dynamic-input/sv-dynamic-input",
    },
  ],
};

const componentsMenu = {
  text: "组件",
  items: [
    {
      text: "客户端",
      items: [
        {
          text: "sv-page",
          link: "/src/components/sv-page/sv-page",
        },
        {
          text: "sv-nav-bar",
          link: "/src/components/sv-nav-bar/sv-nav-bar",
        },
        {
          text: "sv-tab-bar",
          link: "/src/components/sv-tab-bar/sv-tab-bar",
        },
        {
          text: "sv-paging",
          link: "/src/components/sv-paging/sv-paging",
        },
        {
          text: "sv-checkbox",
          link: "/src/components/sv-checkbox/sv-checkbox",
        },
      ],
    },
    {
      text: "管理端",
      items: [
        {
          text: "sv-icon-select",
          link: "/src/components/sv-icon-select/sv-icon-select",
        },
        {
          text: "sv-pagination",
          link: "/src/components/sv-pagination/sv-pagination",
        },
        {
          text: "sv-dict-checkbox",
          link: "/src/components/sv-dict-checkbox/sv-dict-checkbox",
        },
        {
          text: "sv-dict-radio",
          link: "/src/components/sv-dict-radio/sv-dict-radio",
        },
        {
          text: "sv-dict-select",
          link: "/src/components/sv-dict-select/sv-dict-select",
        },
        {
          text: "sv-dict-tag",
          link: "/src/components/sv-dict-tag/sv-dict-tag",
        },
        {
          text: "sv-file-upload",
          link: "/src/components/sv-file-upload/sv-file-upload",
        },
        {
          text: "sv-file-avatar",
          link: "/src/components/sv-file-avatar/sv-file-avatar",
        },
        {
          text: "sv-excel-menu",
          link: "/src/components/sv-excel-menu/sv-excel-menu",
        },
        {
          text: "sv-change-password",
          link: "/src/components/sv-change-password/sv-change-password",
        },
      ],
    },
  ],
};

// https://vitepress.dev/zh/reference/site-config
export default defineConfig({
  base: "/docs",
  outDir: "../dist",
  lang: "zh-CN",
  title: "sv-app",
  description: "A VitePress Site",
  cleanUrls: true,

  head: [
    ["link", { rel: "icon", href: "/docs/favicon.ico" }], // 需要加上根目录前缀，否则资源访问不到
    [
      "script",
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?4fb1a39c791edec238c6dc37ccf28fa6";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`,
    ], // 百度统计
  ],

  themeConfig: {
    logo: "/logo.png",
    siteTitle: "sv-app",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "🚀快速开始", link: "/src/base/quick" },
      frameMenu,
      pluginsMenu,
      componentsMenu,
      {
        text: "相关链接",
        items: [
          {
            text: "Vue3",
            link: "https://cn.vuejs.org",
          },
          {
            text: "uni-app",
            link: "https://uniapp.dcloud.net.cn",
          },
          {
            text: "uniCloud",
            link: "https://doc.dcloud.net.cn/uniCloud",
          },
          {
            text: "uv-ui",
            link: "https://www.uvui.cn",
          },
          {
            text: "element-plus",
            link: "https://element-plus.gitee.io/zh-CN",
          },
          {
            text: "ColorUI",
            link: "https://ext.dcloud.net.cn/plugin?id=239",
          },
          {
            text: "z-paging",
            link: "https://ext.dcloud.net.cn/plugin?id=3935",
          },
          {
            text: "uCharts",
            link: "https://ext.dcloud.net.cn/plugin?id=271",
          },
          {
            text: "iconfont",
            link: "https://www.iconfont.cn",
          },
          {
            text: "Animista",
            link: "https://animista.net",
          },
          {
            text: "VueUse",
            link: "https://vueuse.org",
          },
          {
            text: "pinia-plugin-unistorage",
            link: "https://ext.dcloud.net.cn/plugin?id=8081",
          },
          {
            text: "Lodash",
            link: "https://www.lodashjs.com",
          },
          {
            text: "dayjs",
            link: "https://dayjs.fenxianglu.cn",
          },
        ],
      },
      { text: "☕一杯咖啡", link: "/src/donate/donate" },
    ],

    sidebar: [
      {
        text: "基础",
        items: [
          {
            text: "快速开始",
            link: "/src/base/quick",
          },
          {
            text: "常见问题",
            link: "/src/base/problem",
          },
          {
            text: "博客文章",
            link: "/src/base/blog",
          },
          {
            text: "更新日志",
            link: "/src/base/log",
          },
        ],
      },
      frameMenu,
      pluginsMenu,
      componentsMenu,
      {
        text: "☕一杯咖啡",
        link: "/src/donate/donate",
      },
      {
        text: "🎉鸣谢",
        link: "/src/thank/thank",
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/Sonvee/sv-app" },
      {
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0m6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>`,
        },
        link: "https://gitee.com/Sonve/sv-app",
        ariaLabel: "Gitee",
      },
      {
        icon: {
          svg: `<svg t="1713778098002" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2278" width="32" height="32"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#2B9939" p-id="2279"></path><path d="M347.33473185 704.1094791h334.50868979V235.83183485h111.46837529v579.78054125H235.83183485V235.83183485h111.502897v468.27764425z" fill="#ffffff" p-id="2280"></path></svg>`,
        },
        link: "https://ext.dcloud.net.cn/publisher?id=1173575",
        ariaLabel: "DCloud",
      },
      {
        icon: {
          svg: '<svg t="1694688365239" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4048" width="32" height="32"><path d="M980.79827 694.105946c-21.144216-122.796973-109.844757-203.250162-109.844757-203.250162 12.647784-111.477622-33.792-131.26573-33.792-131.26573C827.392 14.668108 530.985514 20.67373 524.730811 20.839784 518.476108 20.67373 222.01427 14.668108 212.300108 359.590054c0 0-46.467459 19.788108-33.819676 131.26573 0 0-88.700541 80.453189-109.817081 203.250162 0 0-11.291676 207.484541 101.403676 25.40627 0 0 25.350919 69.161514 71.790703 131.26573 0 0-83.082378 28.256865-75.997405 101.625081 0 0-2.87827 81.836973 177.401081 76.218811 0 0 126.699243-9.852541 164.753297-63.515676l16.605405 0 0.276757 0 16.633081 0c38.026378 53.635459 164.725622 63.515676 164.725622 63.515676 180.224 5.618162 177.401081-76.218811 177.401081-76.218811 7.029622-73.368216-75.997405-101.625081-75.997405-101.625081 46.439784-62.104216 71.790703-131.26573 71.790703-131.26573C992.034595 901.590486 980.79827 694.105946 980.79827 694.105946z" p-id="4049" fill="#88BAFF"></path></svg>',
        },
        link: "https://qm.qq.com/cgi-bin/qm/qr?k=HD9IXnUruOa5pplF1jAeQsLb9BNnP_DE&jump_from=webapi&authKey=tk61Q5la3EAprdYcUBD7v0PBly795OTcT4UT36XxqcG7pmhGRpE+yFlt75vQBWeY",
        ariaLabel: "QQ",
      },
    ],

    search: {
      provider: "local",
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                },
              },
            },
          },
        },
      },
    },
  },
});
