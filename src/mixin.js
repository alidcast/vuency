import { initTask, createDisposables } from 'ency'
import createListeners from './modifiers/listeners'
import assert, { isFn } from './util'

function createTasks (host, registered) {
  const modifiers = { ...createListeners(host) }
  const asyncHelpers = createDisposables()

  const createTask = initTask(modifiers)
  const tasks = Reflect.apply(registered, host, [createTask.bind(host), asyncHelpers])

  if (tasks.flow) { // single named function
    return { [tasks._operation.name]: tasks }
  } else { // list of named objects
    return tasks
  }
}

export default (Vue) => ({
  created () {
    const options = this.$options
    if (!options.tasks) return // no tasks
    assert(isFn(options.tasks), 'The Tasks property must be a function')

    if (!options.computed) options.computed = {}
    if (!this.$registeredTasks) this.$registeredTasks = []

    const tasks = createTasks(this, options.tasks)

    Object.keys(tasks).forEach(key => {
      Vue.util.defineReactive(this, key, tasks[key])
      this.$registeredTasks.push(this[key].abort)
    })
  },

  beforeDestroy () {
    if (this.$registeredTasks) this.$registeredTasks.forEach(abort => abort())
  }
})
