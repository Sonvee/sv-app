<template>
  <view v-if="item.enable">
    <el-sub-menu :index="item.url" v-if="item?.children?.length > 0">
      <template #title>
        <view :class="item.icon"></view>
        <span class="menu-text">{{ item.name }}</span>
      </template>
      <!-- 组件递归 -->
      <side-menu-item
        v-for="child in item.children"
        :key="child.url"
        :item="child"
      ></side-menu-item>
    </el-sub-menu>
    <el-menu-item :index="item.url" v-else>
      <template #title>
        <view :class="item.icon"></view>
        <span class="menu-text">{{ item.name }}</span>
      </template>
    </el-menu-item>
  </view>
</template>

<script setup>
import SideMenuItem from './side-menu-item.vue'

defineProps({
  item: {
    type: Object,
    default: {}
  }
})
</script>

<style scoped>
.menu-text {
  margin-left: 10px;
}
</style>
