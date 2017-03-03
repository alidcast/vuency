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

  return {
    states: {
      get isActive() {
        return scheduler ? scheduler.isActive : false
      },

      get isIdle() {
        return !this.isActive
      },

      get state() {
        if (this.isActive) return 'active'
        else return 'idle'
      }
    },

    actions: {
      /**
       * Creates a new task instance and schedules it to run.
       */
      async run(...args) {
        if (!scheduler) scheduler = createTaskScheduler(policy)

        operation = operation.bind(host, ...args) // bind comp `this` context
        let taskInstance = createTaskInstance(operation),
            updateSchedule = scheduler.update.bind(scheduler), // ?
            stepper = createTaskStepper(taskInstance, updateSchedule)

        // add the necessary stepper methods to the task instance so that
        // the execution of task can be delegated to scheduler
        taskInstance._run = stepper.stepThrough
        taskInstance._cancel = stepper.handleCancel
        scheduler.schedule(taskInstance)

        await waitForRunning(taskInstance._runningOperation)
        return taskInstance
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
