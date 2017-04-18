import { initTask, createDisposables } from 'ency'
import createListeners from './modifiers/listeners'
import assert, { isFn } from './util'

var Vue
export default function applyMixin (_Vue) {
  Vue = _Vue
  Vue.mixin({
    created: initTasks
    // TODO beforeDestory {} // cancel tasks, remove listeners, take down task watcher etc
  })
}

function initTasks () {
  const host = this
  const opts = this.$options

  if (opts.tasks) {
    assert(isFn(opts.tasks), 'The Tasks property must be a function')

    const listeners = createListeners(host)
    const asyncHelpers = createDisposables()

    // call `tasks` with task factory so that each operation can be converted
    // into a task object before being injected into component instance
    const createTask = initTask(host, listeners)
    const tasks = Reflect.apply(opts.tasks, host, [createTask, asyncHelpers])

    if (tasks.flow) { // it is a task object, so register as named function
      Vue.util.defineReactive(host, tasks._operation.name, tasks)
    } else { // it is a list of task objects, so register as named objects
      Object.keys(tasks).forEach(key => {
        Vue.util.defineReactive(host, key, tasks[key])
      })
    }
  }
}
