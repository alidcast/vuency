import createTaskStepper from './task-stepper'

/**
 * A {TaskInstance}
 * @param {Function} operation - the registered task operation
 * @constructor Task Instance
 */
export default function createTaskInstance(operation, subscriber) {
  let stepper

  return {
    operation,
    _runningInstance: null,
    // results
    value: null,
    error: null,
    // states
    hasStarted: false,
    isCanceled: false,
    isRejected: false,
    isResolved: false,
    // computed states
    isDropped: false,
    isRestarted: false, // TODO
    isRunning: false,
    isOver: false,
    state: 'waiting',

    _setComputedProps() {
      this.isDropped = !this.hasStarted && this.isCanceled
      this.isRestarted = this.hasStarted && this.isCanceled
      this.isOver = this.isCanceled || this.isRejected || this.isResolved
      this.isRunning = this.hasStarted && !this.isOver
      this.state = this._getState()
    },

    _getState() {
      if (this.isDropped) return 'dropped'
      else if (this.isCanceled) return 'canceled'
      else if (this.isRejected) return 'rejected'
      else if (this.isResolved) return 'resolved'
      else if (this.isRunning) return 'running'
      else return 'waiting'
    },

    _start() {
      if (!stepper) stepper = createTaskStepper(this, subscriber)
      return stepper.stepThrough.apply(stepper)
    },

    cancel() {
      if (!stepper) stepper = createTaskStepper(this, subscriber)
      return stepper.handleCancel.apply(stepper)
    }
  }
}
