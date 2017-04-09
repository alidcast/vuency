import createTaskInstance from './task-instance'
import createTaskScheduler from './task-scheduler'
import createTaskPolicy from './modifiers/task-policy'
import createTaskSubscriptions from './modifiers/task-subscriptions'
import createTaskListeners from './modifiers/task-listeners'

/**
 * A {TaskProperty}
 * @param {Vue} host - the Vue component instance
 * @param {Function} operation - the task method to run
 * @param {Object} policy - the task scheduling policy
 * @constructor Task Property
 */
export default function createTaskProperty(host, operation, autorun = true) {
  let scheduler,
      { policy, ...policyModifiers } = createTaskPolicy(),
      { subscriptions, ...subscriber } = createTaskSubscriptions(host),
      { events, watchers } = createTaskListeners(host)

  return {
    // reactive data
    isActive: false,
    isIdle: true,
    isAborted: false,
    state: 'idle',
    // last instance data (set by scheduler)
    lastCalled: null,
    lastStarted: null,
    lastResolved: null,
    lastRejected: null,
    lastCanceled: null,
    // default helper instance (can be used for when `last-` is undefined)
    default: createTaskInstance(function * () {}),

    /*
     * Data that needs to be updated when instances
     * are added to the scheduler's running queue.
     */
    _updateReactive() {
      this.isActive = scheduler.running.isActive
      this.isIdle = !scheduler.running.isActive
      this.state = this.isActive ? 'active' : 'idle'
    },

    /**
     * Creates a new task instance and schedules it to run.
     */
    run(...params) {
      if (!scheduler) scheduler = createTaskScheduler(this, policy)
      this.isAborted = false
      let boundOperation = reflectBind(host, operation, params),
          instanceData = { params, operation: boundOperation },
          ti = createTaskInstance(instanceData, subscriber)
      if (autorun) scheduler.schedule(ti)
      return ti
    },

    /**
     * Cancels and destroys all scheduled task instances.
     */
    abort() {
      let canceledInstances
      if (scheduler && scheduler.isActive) {
        canceledInstances = scheduler.clear()
        this.isAborted = true
      }
      return canceledInstances || []
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

/**
 * Function neutral bind operation.
 *
 * If `bind` is used on a gen function, it changes its prototype to `Function`.
 * So we make sure to set the prototype of each operation back to its original.
 */
function reflectBind(ctx, operation, args) {
  let boundOperation = operation.bind(ctx, ...args)
  Reflect.setPrototypeOf(boundOperation, operation)
  return boundOperation
}
