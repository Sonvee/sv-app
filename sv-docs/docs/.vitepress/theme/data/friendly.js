import { ref, onMounted } from "vue";
import json from "./friendly.json";

const data = ref([]);

export function useFriendly() {
  onMounted(async () => {
    if (data.value && data.value.length) return;

    // const result = await fetch("https://mp-74bfcbac-6ba6-4f39-8513-8831390ff75a.cdn.bspapp.com/json/friendly.json"); // 会跨域
    // const json = await result.json();

    data.value = json && json.links ? json.links : [];
  });

  return {
    data,
  };
}
