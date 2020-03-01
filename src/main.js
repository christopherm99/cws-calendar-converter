import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueGapi from "vue-gapi";
Vue.use(VueGapi, {
  apiKey: "AIzaSyC18D3tB0AwY50dl-Xy-o9u_k7Jabb5be4",
  clientId:
    "340232312855-uu951rg9mjrl0ukiqe48ojp8mj9i2ipn.apps.googleusercontent.com",
  discoverDocs: "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  scope: "https://www.googleapis.com/auth/calendar",
  ux_mode: "popup"
});

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app");
