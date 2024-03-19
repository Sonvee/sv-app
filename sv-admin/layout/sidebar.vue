<template>
  <div class="layout-side-bar">
    <el-scrollbar v-loading="loading">
      <el-menu
        class="sv-el-menu"
        mode="vertical"
        unique-opened
        :collapse="isCollapse"
        :default-active="activeMenu"
        @select="onMenu"
      >
        <side-menu-item v-for="item in sideMenu" :key="item.menu_id" :item="item"></side-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import SideMenuItem from './components/side-menu-item/side-menu-item.vue'
import { getMenu, clickMenuItem } from '@/utils/sys.js'
import { useRoute } from 'vue-router'

const route = useRoute()

const isCollapse = ref(false)
const sideMenu = ref([])
const loading = ref(false)

// 监听登录成功后，重新获取菜单，以及权限校验
uni.$on('uni-id-pages-login-success', (e) => {
  handleMenu()
})

async function handleMenu() {
  loading.value = true
  const menu = await getMenu()
  sideMenu.value = menu
  loading.value = false

  // 将树形菜单数据传输给依赖于侧边栏菜单的组件
  uni.$emit('sv-sidebar-tree-menu', menu)
}

// 登录成功时才会进行初始化
onMounted(() => {
  if (getApp().$svIdPagesStore.store.hasLogin) {
    handleMenu()
  }
})

const activeMenu = ref('/') // 默认首页

function onMenu(url) {
  if (url !== activeMenu.value) {
    clickMenuItem(url)
  }
}

watch(
  () => route.meta,
  (newVal) => {
    const { route: url } = newVal
    // 监听路由 切换activeMenu
    activeMenu.value = url == 'pages/index/index' ? '/' : '/' + url
  }
)
</script>

<style lang="scss">
.layout-side-bar {
  position: fixed;
  width: $sv-admin-side-bar-width;
  height: calc(100vh - (var(--top-window-height)));

  @include useTheme {
    border-right: 1px solid #{getTheme('sv-admin-border-color')};
    background-color: getTheme('sv-admin-bg-color');
  }
}
</style>
