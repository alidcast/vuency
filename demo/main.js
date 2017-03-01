import Vue from "vue"
import App from "./App"
import vuency from "src/index"

// vue + concurrency = vue concurrency
Vue.use(vuency)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  ...App
})
