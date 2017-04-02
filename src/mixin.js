import initTaskFactory from './plugin/index'
import createTaskInjections from './plugin/task-injections'
import assert, { isFn } from './util/assert'

let Vue
export default function(_Vue) {
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
function initTasks() {
  let host = this,
      opts = this.$options

  if (opts.tasks) {
    assert(isFn(opts.tasks), 'The Tasks property must be a function')

    let taskHelpers = createTaskInjections(),
        createTask = initTaskFactory(host),
        tasks = Reflect.apply(opts.tasks, host, [createTask, taskHelpers])

    if (tasks.flow) { // it is a task object, so register as named function
      Vue.util.defineReactive(host, tasks.operation.name, tasks)
    } else { // it is a list of task objects, so register as named objects
      Object.keys(tasks).forEach(key => {
        Vue.util.defineReactive(host, key, tasks[key])
      })
    }
  }
}
