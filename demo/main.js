import Vue from "vue"
import App from "./App"
import vuency from "src/index"

Vue.use(vuency)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  ...App
})
