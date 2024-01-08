<template>
  <sv-page>
    <view class="home">
      <view class="search-bar">
        <tn-search-box
          class="sv-tn-search-box"
          v-model="searchValue"
          :throllte="false"
          @search="searchBtnClickEvent"
          @clear="searchClear"
        />
      </view>
      <view class="paging-list">
        <sv-paging ref="svPagingRef" :api-func="testLongList" :api-params="apiParams">
          <template #default="{ data }">
            <view class="sv-list-item" @click="onItem(data)">
              index:{{ data.index }} - item:{{ data.item?.text }} ; {{ data.item?.value }}
            </view>
          </template>
        </sv-paging>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import { testLongList, testEmpty } from '@/service/api/test.js'
import { computed, ref } from 'vue'
import { useSysStore } from '../../store/sys'

const apiParams = ref({
  name: ''
})

const svPagingRef = ref()
const searchValue = ref('')

function searchBtnClickEvent() {
  apiParams.value.name = searchValue.value
  svPagingRef.value.reload()
}
function searchClear() {
  apiParams.value.name = ''
}

function onItem(e) {
  console.log('==== onItem :', e)
}

const navbarHeight = computed(() => {
  const sysConfig = useSysStore().getConfig()
  return sysConfig.navbarHeight + 'px'
})
</script>

<style lang="scss">
.home {
  .search-bar {
    padding: 24rpx;
  }
  .paging-list {
    height: calc(var(--main-height) - v-bind(navbarHeight) - 122rpx);
  }
}

.sv-list-item {
  border: 1px solid #66ccff;
  padding: 24rpx;
  box-sizing: border-box;
  margin: 0 24rpx 24rpx 24rpx;
}
</style>
