import createTaskStepper from './task-stepper'

/**
 * A {TaskInstance}
 * @param {Function} operation - the registered task operation
 * @constructor Task Instance
 */
export default function createTaskInstance(operation) {
  let stepper

  return {
    operation,
    _runningInstance: null,

    value: null, // set by succesfully completed task
    error: null, // set by unsuccesfully completed task
    hasStarted: false,
    isCanceled: false,
    isRejected: false,
    isResolved: false,

    get isDropped() {
      return !this.hasStarted && this.isCanceled
    },

    get isFinished() {
      return this.isCanceled || this.isRejected || this.isResolved
    },

    get isRunning() {
      return this.hasStarted && !this.isFinished
    },

    get state() {
      if (this.isDropped) return 'dropped'
      else if (this.isCanceled) return 'canceled'
      else if (this.isRejected) return 'rejected'
      else if (this.isResolved) return 'resolved'
      else if (this.hasStarted) return 'running'
      else return 'waiting'
    },

    start() {
      if (!stepper) stepper = createTaskStepper(this)
      return stepper.stepThrough.apply(stepper)
    },

    cancel() {
      if (!stepper) stepper = createTaskStepper(this)
      return stepper.handleCancel.apply(stepper)
    }
  }
}
