import initMixin from './mixin'

function plugin (Vue) {
  if (plugin.installed) return
  Vue.mixin(initMixin(Vue))
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  plugin(window.Vue)
}

export default plugin
