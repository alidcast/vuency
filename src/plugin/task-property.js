import Vue from 'vue'
import createTaskInstance from './task-instance'
import createTaskScheduler from './task-scheduler'
import createTaskPolicy from './modifiers/task-policy'
import createTaskSubscriber from './modifiers/task-subscriber'
import createTaskListeners from './modifiers/task-listeners'

/**
 * A {TaskProperty}
 * @param {Vue} host - the Vue component instance
 * @param {Function} operation - the task method to run
 * @param {Object} policy - the task scheduling policy
 * @constructor Task Property
 */
export default function createTaskProperty(host, operation) {
  let scheduler,
      { policy, changePolicy } = createTaskPolicy('enqueue', 1),
      { events, watchers } = createTaskListeners(host),
      { subscriptions, ...subscriber } = createTaskSubscriber()

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
          tp._setStates()
          tp._setLast()
          host.$forceUpdate()
        }
      }
    })
    return new Watcher()
  }

  return {
    // reactive states
    isActive: false,
    isIdle: true,
    state: 'idle',
    // last instances
    lastCalled: null,
    lastStarted: null,
    lastResolved: null,
    lastRejected: null,
    lastCanceled: null,
    // default helper instance to be used for when `last-` is undefined
    default: createTaskInstance(function * () {}),

    _setStates() {
      this.isActive = scheduler.running.isActive
      this.isIdle = !scheduler.running.isActive
      this.state = this.isActive ? 'active' : 'idle'
    },

    _setLast() {
      this.lastCalled = scheduler.lastCalled
      this.lastStarted = scheduler.lastStarted
      this.lastResolved = scheduler.lastResolved
      this.lastRejected = scheduler.lastRejected
      this.lastCanceled = scheduler.lastCanceled
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
          ti = createTaskInstance(hostOperation, subscriber)
      scheduler.schedule(ti)
      return ti
    },

    /**
     * Cancels all scheduled task instances.
     */
    abort() {
      if (scheduler && scheduler.isActive) scheduler.emptyOut()
    },

    /**
     * Task modifiers.
     */
    policy: changePolicy,
    ...events,
    ...watchers,
    ...subscriptions
  }
}
