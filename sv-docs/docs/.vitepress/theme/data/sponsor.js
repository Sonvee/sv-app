import { ref, onMounted } from "vue";
import json from "./sponsor.json";

const data = ref();

export function useSponsor() {
  onMounted(async () => {
    if (data.value) return;

    // const result = await fetch("ttps://mp-74bfcbac-6ba6-4f39-8513-8831390ff75a.cdn.bspapp.com/json/sponsor.json");
    // const json = await result.json();

    data.value = json;
  });

  return {
    data,
  };
}
