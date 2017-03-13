import createTaskInstance from './task-instance'
import createTaskScheduler from './task-scheduler'

/**
 * A {TaskProperty}
 * @param {Vue} host - the Vue component instance
 * @param {Function} operation - the task method to run
 * @param {Object} policy - the task scheduling policy
 * @constructor Task Property
 */
export default function createTaskProperty(host, operation, policy) {
  let scheduler

  /**
   * Updates reactive task properties and force component instance to update.
   */
  function setReactiveProps(isRunning) {
    this.isActive = isRunning
    this.isIdle = !isRunning
    host.$forceUpdate()
  }

  return {
    isActive: false,
    isIdle: true,

    // TODO
    // state
    // last

    /**
     * Creates a new task instance and schedules it to run.
     */
    async run(...args) {
      if (!scheduler) scheduler = createTaskScheduler(policy)
      operation = operation.bind(host, ...args) // inject component context
      let ti = createTaskInstance(operation, setReactiveProps.bind(this))
      scheduler.schedule(ti)
      return await waitForRunning(ti._runningOperation)
    },

    /**
     * Cancels all active task instances.
     */
    abort() {

    }
    // TODO
    // add events
  }
}

/** TODO might not need promise, once its set, it's finished?
 * Waits for running to be set and then turns it into a promise.
 */
function waitForRunning(running) {
  return new Promise(function(resolve, reject) {
    if (running) return resolve(running)
    setTimeout(waitForRunning, 30)
  })
}

// /**
//  * Create a Vue watcher to update task properties when the
//  *  scheduler's running queue changes.
//  */
// function createWatcher(tp) {
//   // let updateTp = setReactiveProperties.bind(null, tp)
//   const Watcher = Vue.extend({
//     data: () => ({
//       waiting: scheduler.waiting.alias(),
//       running: scheduler.running.alias()
//     }),
//     watch: {
//       waiting: updateTp,
//       running: updateTp
//     }
//   })
//   return new Watcher()
// }
