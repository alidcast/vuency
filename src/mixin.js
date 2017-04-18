import { initTask, createDisposables } from 'ency'
import assert, { isFn } from './util'

var Vue
export default function (_Vue) {
  Vue = _Vue
  Vue.mixin({
    created: initTasks
    // TODO
    // beforeDestory {} // cancel tasks, remove listeners, take down task watcher etc
  })
}

/**
 * Calls the `tasks` property with the task factory and async helper functions
 * so that each task operation can be converted into a task object before being
 * injected into the component instance.
 */
function initTasks () {
  const host = this
  const opts = this.$options

  if (opts.tasks) {
    assert(isFn(opts.tasks), 'The Tasks property must be a function')

    const taskHelpers = createDisposables()
    const createTask = initTask(host)
    const tasks = Reflect.apply(opts.tasks, host, [createTask, taskHelpers])

    if (tasks.flow) { // it is a task object, so register as named function
      Vue.util.defineReactive(host, tasks._operation.name, tasks)
    } else { // it is a list of task objects, so register as named objects
      Object.keys(tasks).forEach(key => {
        Vue.util.defineReactive(host, key, tasks[key])
      })
    }
  }
}
