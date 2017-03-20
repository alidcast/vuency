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
   *  Create a Vue watcher that will update task properties when the
   *  scheduler's running queue changes.
   */
  function createTaskWatcher(tp) {
    const Watcher = Vue.extend({
      data: () => ({
        running: scheduler.running.alias()
      }),
      watch: {
        running() {
          tp._setReactiveProps()
          host.$forceUpdate()
        }
      }
    })
    return new Watcher()
  }

  /**
   * Gets all last instance values.
   */
  function getLastProps() {
    return {
      called: scheduler.lastCalled,
      started: scheduler.lastStarted,
      resolved: scheduler.lastResolved,
      rejected: scheduler.lastRejected,
      canceled: scheduler.lastCanceled
    }
  }

  return {
    isActive: false,
    isIdle: true,
    state: 'idle',
    last: {},
    // default helper instance to be used for when `last` is undefined
    default: createTaskInstance(function * () {}),

    _setReactiveProps() {
      this.isActive = scheduler.running.isActive
      this.isIdle = !scheduler.running.isActive
      this.state = this.isActive ? 'active' : 'idle'
      this.last = getLastProps()
    },

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
      return ti
    },

    /**
     * Cancels all scheduled task instances.
     */
    abort() {
      if (scheduler.isActive) scheduler.emptyOut()
    }
    // TODO
    // add events
    // abort
  }
}
