import initTaskFactory from './plugin/index'
import asyncHelpers from './util/async'
import assert, { isFn } from './util/assert'

export default function(Vue) {
  Vue.mixin({
    beforeCreate: initTasks,
    // TODO
    // beforeDestory {}
  })
}

/**
 * Calls tasks property with the task factory and helper functions so that
 * each task operation can be converted into a task objects before being
 * injected into the component instance.
 */
function initTasks() {
  let host = this,
      opts = this.$options

  if (opts.tasks) {
    assert(isFn(opts.tasks), 'The Tasks property must be a function')

    let createTask = initTaskFactory(host),
        tasks = opts.tasks(createTask, asyncHelpers)

    Object.keys(tasks).forEach(key => {
      host[key] = tasks[key]
    })
  }
}
