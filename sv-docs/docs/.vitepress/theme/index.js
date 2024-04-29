import "./style/custom.css";
import "./style/scrollbar.scss";

import { h } from "vue";
import Theme from "vitepress/theme";
import HomeFriendly from "./components/HomeFriendly.vue";

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      "home-features-after": () => h(HomeFriendly),
    });
  },
};
