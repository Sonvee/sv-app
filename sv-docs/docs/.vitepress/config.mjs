import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/docs",
  outDir: "../dist",
  lang: "zh-CN",
  title: "sv-docs",
  description: "A VitePress Site",
  cleanUrls: true,

  head: [["link", { rel: "icon", href: "/docs/favicon.ico" }]], // 需要加上根目录前缀，否则资源访问不到

  themeConfig: {
    logo: "/logo.png",
    siteTitle: "sv-docs",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "🚀快速开始", link: "/src/base/quick" },
      {
        text: "框架",
        items: [
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
      },
      {
        text: "插件",
        items: [
          {
            text: "样式模块",
            link: "/src/plugins/sv-style/sv-style",
          },
          {
            text: "系统接口",
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
          {
            text: "富文本模块",
            link: "/src/plugins/sv-wangeditor/sv-wangeditor",
          },
        ],
      },
      {
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
                text: "sv-change-password",
                link: "/src/components/sv-change-password/sv-change-password",
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
                text: "sv-excel-menu",
                link: "/src/components/sv-excel-menu/sv-excel-menu",
              },
              {
                text: "sv-file-avatar",
                link: "/src/components/sv-file-avatar/sv-file-avatar",
              },
              {
                text: "sv-file-upload",
                link: "/src/components/sv-file-upload/sv-file-upload",
              },
              {
                text: "sv-icon-select",
                link: "/src/components/sv-icon-select/sv-icon-select",
              },
              {
                text: "sv-pagination",
                link: "/src/components/sv-pagination/sv-pagination",
              },
            ],
          },
        ],
      },
      {
        text: "其他",
        items: [
          {
            text: "鸣谢",
            link: "/src/other/thank",
          },
        ],
      },
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
            text: "阿里巴巴矢量图标库",
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
            text: "Pinia 持久化",
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
            text: "介绍",
            link: "/src/base/intro",
          },
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
      {
        text: "框架",
        items: [
          {
            text: "配置",
            link: "/src/plugins/sv-configs/sv-configs",
          },
          {
            text: "服务端",
            link: "/src/frame/sv-service/sv-service",
          },
          {
            text: "客户端",
            link: "/src/frame/sv-client/sv-client",
            items: [
              {
                text: "内置组件",
                items: [
                  {
                    text: "sv-page",
                    link: "/src/components/sv-page/sv-page",
                  },
                ],
              },
            ],
          },
          {
            text: "管理端",
            link: "/src/frame/sv-admin/sv-admin",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://gitee.com/Sonve/sv-app" },
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
