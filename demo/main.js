import App from "./App"
import Vue from "vue"
import vuency from "src/index"
Vue.use(vuency)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  ...App
})
