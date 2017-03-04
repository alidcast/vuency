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
   * Sets the task's reactive properties.
   */
  function setReactiveProperties(tp) {
    tp.isActive = scheduler.isActive
    tp.isIdle = scheduler.isIdle
  }

  return {
    isActive: false,
    isIdle: true,

    // get state() {
    //   if (isActive) return 'active'
    //   else return 'idle'
    // }

    /**
     * Creates a new task instance and schedules it to run.
     */
    async run(...args) {
      if (!scheduler) scheduler = createTaskScheduler(policy)

      operation = operation.bind(host, ...args) // bind comp `this` context

      let updateTask = () => {
            scheduler.update()
            setReactiveProperties(this)
          },
          ti = createTaskInstance(operation),
          stepper = createTaskStepper(ti, updateTask),
          schedulerTi = addStepperMethods(ti, stepper)

      scheduler.schedule(schedulerTi)
      await waitForRunning(ti._runningOperation)
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
