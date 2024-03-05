<template>
  <sv-page showTabBar>
    <view class="home">
      <sv-paging :apiFunc="testList">
        <template #default="{ data }">
          <view class="cell-item">
            index:{{ data.index }} - item:{{ data.item?.text }} ; {{ data.item?.value }}
          </view>
        </template>
      </sv-paging>
    </view>
  </sv-page>
</template>

<script setup>
import { testList } from '../../service/api/test'

// getTestList()
function getTestList() {
  testList().then((res) => {
    console.log('==== res :', res)
  })
}
</script>

<style lang="scss">
.home {
  height: var(--page-main-height);
  padding: 12px;
  box-sizing: border-box;

  .cell-item {
    padding: 10px;
    box-sizing: border-box;
    border: 4px solid #cccccc;
    margin-bottom: 10px;
  }
}
</style>
