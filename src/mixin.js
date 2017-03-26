import initTaskFactory from './plugin/index'
import asyncHelpers from './util/async'
import assert, { isFn } from './util/assert'

export default function(Vue) {
  Vue.mixin({
    created: initTasks
    // TODO
    // beforeDestory {} // cancel tasks, remove listeners, take down task watcher etc
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
        tasks = opts.tasks.call(host, createTask, asyncHelpers)

    if (tasks.flow) { // it is a task object, so register as named function
      host[tasks.operation.name] = tasks
    }
    else { // it is a list of task objects, so register as named objects
      Object.keys(tasks).forEach(key => {
        host[key] = tasks[key]
      })
    }
  }
}
