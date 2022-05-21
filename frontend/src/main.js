import { createApp } from "vue";
import { Quasar, Notify } from "quasar";
import { registerSW } from "virtual:pwa-register";
import App from "./App.vue";
import router from "./router";

import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Reload to get new updates?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log("You are offline.");
  },
});

const app = createApp(App);

app.use(router);
app.use(Quasar, {
  plugins: {
    Notify,
  },
});

app.mount("#app");
