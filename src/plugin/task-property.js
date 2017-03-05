import Vue from 'vue'
import createTaskInstance from './task-instance'
import createTaskScheduler from './task-scheduler'
import createTaskStepper from './task-stepper'

/**
 * A {TaskProperty}
 * @param {Object} host - the Vue component instance
 * @param {Function} operation - the task method to run
 * @param {Object} policy - the task scheduling policy
 * @constructor Task Property
 */
export default function createTaskProperty(host, operation, policy) {
  let scheduler

  /**
   * Set reactive task properties and force component instance to update.
   */
  function setReactiveProperties(tp) {
    tp.isActive = scheduler.isActive
    tp.isIdle = !scheduler.isActive
    host.$forceUpdate()
  }

  /**
   * Create a Vue watcher to update task properties when the
   *  scheduler's queues change.
   */
  function createWatcher(tp) {
    let Watcher = Vue.extend({
      data: () => ({
        waiting: scheduler.waitingQueue,
        running: scheduler.runningQueue
      }),
      watch: {
        waiting: setReactiveProperties.bind(null, tp),
        running: setReactiveProperties.bind(null, tp)
      }
    })
    return new Watcher()
  }

  return {
    isActive: false,
    isIdle: true,

    /**
     * Creates a new task instance and schedules it to run.
     */
    async run(...args) {
      if (!scheduler) {
        scheduler = createTaskScheduler(policy)
        createWatcher(this)
      }

      operation = operation.bind(host, ...args) // bind comp `this` context

      let ti = createTaskInstance(operation),
          updateSchedule = scheduler.update.bind(scheduler),
          stepper = createTaskStepper(ti, updateSchedule),
          schedulerTi = addStepperMethods(ti, stepper)

      scheduler.schedule(schedulerTi)
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

/**
 * Add the necessary stepper methods to the task instance so that
 * the execution of task can be delegated to scheduler.
 */
function addStepperMethods(ti, stepper) {
  ti._run = stepper.stepThrough.bind(stepper)
  ti._cancel = stepper.handleCancel.bind(stepper)
  return ti
}

/**
 * Waits for running to be set and then turns it into a promise.
 */
function waitForRunning(running) {
  return new Promise(function(resolve, reject) {
    if (running) return resolve(running)
    setTimeout(waitForRunning, 30)
  })
}
