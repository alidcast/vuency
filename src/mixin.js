import initTaskFactory from './plugin/index'
import assert, { isFn } from './util/assert'

export default function(Vue) {
  Vue.mixin({ created: initTasks })
}

/**
 * Converts each registered method into a task object that is then
 * injects into the component instance.
 */
function initTasks() {
  let host = this,
      opts = this.$options

  if (opts.tasks) {
    assert(isFn(opts.tasks), 'The Tasks property must be a function')

    // initialize the tasks function with task factory function
    // so that task actions can be converted to task objects
    let createTask = initTaskFactory(host),
        tasks = opts.tasks(createTask)

    // inject task into host component
    Object.keys(tasks).forEach(key => {
      host[key] = tasks[key]
      // _Vue.util.defineReactive(host, key, tasks[key])
    })
  }
}
