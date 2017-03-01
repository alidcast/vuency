import applyMixin from './mixin'

function plugin(Vue) {
  if (plugin.installed) return
  applyMixin(Vue)
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  plugin(window.Vue)
}

export default plugin
