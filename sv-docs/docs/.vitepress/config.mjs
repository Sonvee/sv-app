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
      { text: "🚀快速开始", link: "/src/guide/guide" },
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
            text: "config 配置",
            link: "/src/other/config/config",
          },
          {
            text: "request 封装",
            link: "/src/other/request/request",
          },
          {
            text: "工具方法",
            link: "/src/other/util/util",
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
        text: "Examples",
        items: [
          {
            text: "Markdown Examples",
            link: "/src/examples/markdown-examples",
          },
          { text: "Runtime API Examples", link: "/src/examples/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://gitee.com/Sonve/sv-app" }],
  },
});
