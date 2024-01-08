<template>
  <sv-page>
    <view class="setting">
      <view class="cu-list menu sv-list-menu">
        <view class="cu-item arrow" v-for="item in listMenu" :key="item" @click="onListMenu(item)">
          <view class="content flex">
            <text class="text-grey" :class="item.icon"></text>
            <text class="text-grey flex-sub">{{ item.name }}</text>
            <tn-bubble-box :options="bubbleThemes" position="bottom" @click="onTheme">
              <text>{{ curTheme }}</text>
            </tn-bubble-box>
          </view>
        </view>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import clientConfig from '@/client.config'
import { useSysStore } from '@/store/sys'

const listMenu = ref([
  {
    menu_id: '',
    name: '皮肤',
    url: '',
    icon: 'cuIcon-skin',
    sort: 0
  }
])

function onListMenu(item) {}

const sysStore = useSysStore()
const bubbleThemes = clientConfig.themes
const curTheme = computed(() => {
  const findTheme = bubbleThemes.find((item) => item.value == sysStore.getThemes())
  return findTheme.text
})
function onTheme(e) {
  sysStore.setThemes(bubbleThemes[e].value)
}
</script>

<style lang="scss">
.setting {
  height: 100vh;
}
.sv-list-menu {
  overflow: unset !important;
  .cu-item {
    @include useTheme {
      background-color: getTheme('sv-background-highlight-color');
    }
  }
}
</style>
