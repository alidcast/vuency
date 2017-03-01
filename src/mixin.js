import setupTaskFactory from './plugin/core/index'
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
      opts = host.$options

  if (opts.tasks) {
    // since multiple instances are created with same definition, tasks must
    // be declared as functions so that we can call it to return a fresh copy
    // of the registed tasks
    assert(isFn(opts.tasks), 'The Tasks property must be a function')

    // initialize the tasks function with task factory function
    // so that task actions can be converted to task objects
    let createTask = setupTaskFactory(host),
        tasks = opts.tasks(createTask)

    // inject task into host component
    Object.keys(tasks).forEach(key => {
      host[key] = tasks[key]
    })
  }
}
