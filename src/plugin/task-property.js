import Vue from 'vue'
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
  function setReactiveProps(tp) {
    tp.isActive = scheduler.running.isActive
    tp.isIdle = !scheduler.running.isActive
    tp.state = tp.isActive ? 'active' : 'idle'
    host.$forceUpdate()
  }

  /**
   * Create a Vue watcher to update task properties when the
   *  scheduler's running queue changes.
   */
  function createTaskWatcher(tp) {
    const Watcher = Vue.extend({
      data: () => ({
        running: scheduler.running.alias()
      }),
      watch: {
        running: setReactiveProps.bind(null, tp)
      }
    })
    return new Watcher()
  }

  return {
    isActive: false,
    isIdle: true,
    state: 'idle',

    // TODO
    // last

    /**
     * Creates a new task instance and schedules it to run.
     */
    run(...args) {
      if (!scheduler) {
        scheduler = createTaskScheduler(policy)
        createTaskWatcher(this)
      }

      let hostOperation = operation.bind(host, ...args),
          ti = createTaskInstance(hostOperation)

      scheduler.schedule(ti)
      // waitForRunning(ti._runningInstance)
      return ti
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

/**
 * Waits for running task instance to be set.
 */
// function waitForRunning(running) {
//   if (running) return running
//   else setTimeout(waitForRunning, 50)
// }
