import { createSSRApp, defineComponent, h, ref } from "vue";
import { useFetch } from "./useFetch.ts";
import { async } from "./async.js";

const fetchData = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve("Some Data here");
    }, 1000);
  });

const App = defineComponent({
  setup() {
    const { pending, data } = useFetch(async("data", fetchData));
    if (pending) return () => h("div", "Loading...");
    return () => (
      h("div", {data})
    );
  },
});

const entry = createSSRApp(App);

entry.mount("#__app");