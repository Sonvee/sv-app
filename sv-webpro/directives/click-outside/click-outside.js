// 自定义指令，用于处理点击外部区域的事件
export default {
  beforeMount(el, binding) {
    // 在元素上绑定一个事件监听器
    el.clickOutsideEvent = function(event) {
      // 判断点击事件是否发生在元素外部
      if (!(el === event.target || el.contains(event.target))) {
        // 如果是外部点击，则执行绑定的函数
        binding.value(event);
      }
    };
    // 在全局添加点击事件监听器
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    // 在组件销毁前，移除事件监听器以避免内存泄漏
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};