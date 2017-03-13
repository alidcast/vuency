import createTaskStepper from './task-stepper'

/**
 * A {TaskInstance}
 * @constructor Task Instance
 */
export default function createTaskInstance(operation, updateTp) {
  let stepper

  return {
    operation,
    _runningOperation: null,

    value: null, // set by succesfully completed task
    error: null, // set by unsuccesfully completed task
    hasStarted: false,
    isCanceled: false,
    isRejected: false,
    isResolved: false,

    get isDropped() {
      return !this.hasStarted && this.isCanceled
    },

    get isRunning() {
      return this.hasStarted && !this.isOver
    },

    get isFinished() {
      return this.isCanceled || this.isRejected || this.isResolved
    },

    get state() {
      if (this.isDropped) return 'dropped'
      else if (this.isCanceled) return 'canceled'
      else if (this.isRejected) return 'rejected'
      else if (this.isResolved) return 'resolved'
      else if (this.hasStarted) return 'running'
      else return 'waiting'
    },

    /**
     * Runs the task instance and updates the task property appropriately.
     */
    run() {
      if (!stepper) stepper = createTaskStepper(this)
      updateTp(true)
      return Promise.resolve(stepper.stepThrough.apply(stepper))
        .then(updateTp(false))
    },

    cancel() {
      if (!stepper) stepper = createTaskStepper(this)
      return stepper.handleCancel.apply(stepper)
    }
  }
}
