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
      { policy, ...policyModifiers } = createTaskPolicy(),
      { events, watchers } = createTaskListeners(host),
      { subscriptions, ...subscriber } = createTaskSubscriber(host)

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
          tp._update()
          host.$forceUpdate()
        }
      }
    })
    return new Watcher()
  }

  return {
    // states
    isActive: false,
    isIdle: true,
    state: 'idle',
    // last instances
    lastCalled: null,
    lastStarted: null,
    lastResolved: null,
    lastRejected: null,
    lastCanceled: null,
    // default helper instance (can be used for when `last-` is undefined)
    default: createTaskInstance(function * () {}),

    _update() {
      setStates(this, scheduler)
      setLast(this, scheduler)
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
    ...policyModifiers,
    ...events,
    ...watchers,
    ...subscriptions
  }
}

function setStates(tp, scheduler) {
  tp.isActive = scheduler.running.isActive
  tp.isIdle = !scheduler.running.isActive
  tp.state = tp.isActive ? 'active' : 'idle'
}

function setLast(tp, scheduler) {
  tp.lastCalled = scheduler.lastCalled
  tp.lastStarted = scheduler.lastStarted
  tp.lastResolved = scheduler.lastResolved
  tp.lastRejected = scheduler.lastRejected
  tp.lastCanceled = scheduler.lastCanceled
}
