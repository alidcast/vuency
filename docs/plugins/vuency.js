import Vue from 'vue'
// import Vuency from '../../src/index.js'

if (process.BROWSER_BUILD) {
  window.onNuxtReady(() => {
    var Vuency = require('vuency').default
    Vue.use(Vuency)
  })
}
