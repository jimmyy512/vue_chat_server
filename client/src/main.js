import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIO from "vue-socket.io";
import "normalize.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/icons";
Vue.config.productionTip = false;
let serverDomain = null;
if (process.env.NODE_ENV === "production")
  serverDomain = "/";
else
  serverDomain = "localhost:3003";

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: serverDomain,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
