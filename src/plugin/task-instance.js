import createTaskStepper from './task-stepper'

/**
 * A {TaskInstance}
 * @param {Function} operation - the registered task operation
 * @constructor Task Instance
 */
export default function createTaskInstance(operation, subscriber, provider) {
  let stepper

  return {
    operation,
    _delayStart: 0,
    _runningOperation: null,
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
    isRestarted: false,
    isRunning: false,
    isOver: false,
    state: 'waiting',

    _updateComputed() {
      this.isDropped = !this.hasStarted && this.isCanceled
      this.isRestarted = this.hasStarted && this.isCanceled
      this.isOver = this.isCanceled || this.isRejected || this.isResolved
      this.isRunning = this.hasStarted && !this.isOver
      this.state = getState(this)
    },

    _start() {
      if (!stepper) stepper = createTaskStepper(this, subscriber, provider)
      return stepper.stepThrough()
    },

    /**
     * To differentiate between self cancelation versus scheduler cancelation,
     * the task instance has both a private and public `cancel` method.
     */
    selfCanceled: false,
    _cancel() {
      if (!stepper) stepper = createTaskStepper(this, subscriber, provider)
      return stepper.triggerCancel()
    },
    cancel() {
      if (!stepper) stepper = createTaskStepper(this, subscriber, provider)
      this.selfCanceled = true
      return stepper.triggerCancel()
    }
  }
}

function getState(tp) {
  if (tp.isDropped) return 'dropped'
  else if (tp.isCanceled) return 'canceled'
  else if (tp.isRejected) return 'rejected'
  else if (tp.isResolved) return 'resolved'
  else if (tp.isRunning) return 'running'
  else return 'waiting'
}
