<template>
  <el-popover placement="bottom-start" trigger="click" width="auto" @show="onShow" @hide="onHide">
    <template #reference>
      <view class="sv-nav-btn-menu">
        <view :class="[showMenuTree ? 'uni-icons-settings' : 'uni-icons-list']"></view>
      </view>
    </template>
    <view class="menu-tree">
      <el-tree :data="menuData" node-key="menu_id" :props="nodeProps" @node-click="onMenu" />
    </view>
  </el-popover>
</template>

<script setup>
import { ref } from 'vue'
import { clickMenuItem } from '@/utils/sys'

const menuData = ref([]) // 依赖于侧边栏数据即可，不必重复请求
const nodeProps = { label: 'name', children: 'children' }

uni.$on('sv-sidebar-tree-menu', (res) => {
  menuData.value = res
})

function onMenu(e) {
  if (!e.children || e.children?.length == 0) {
    clickMenuItem(e.url)
    document.body.click()
  }
}

const showMenuTree = ref(false)
function onShow() {
  showMenuTree.value = true
}

function onHide() {
  showMenuTree.value = false
}
</script>

<style lang="scss">
.sv-nav-btn-menu {
  padding: 0 12px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;

  @include useTheme {
    color: getTheme('sv-admin-text-color');

    &:hover {
      background-color: getTheme('sv-admin-hover-color');
    }
  }
}

@media screen and (min-width: 768px) {
  .sv-nav-btn-menu {
    display: none;
  }
}
</style>
