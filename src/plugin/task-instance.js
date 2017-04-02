import createTaskStepper from './task-stepper'

/**
 * A {TaskInstance}
 * @param {Function} data - instance data
 * @constructor Task Instance
 */
export default function createTaskInstance(data, subscriber) {
  let stepper,
      { operation, params } = data

  return {
    _operation: operation,
    _runningOperation: null,
    // per instance data
    params,
    bindings: {
      keepRunning: false
    },
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
    isFinished: false,
    state: 'waiting',

    _updateComputed() {
      this.isDropped = !this.hasStarted && this.isCanceled
      this.isRestarted = this.hasStarted && this.isCanceled
      this.isFinished = this.isCanceled || this.isRejected || this.isResolved
      this.isRunning = this.hasStarted && !this.isFinished
      this.state = getState(this)
    },

    _start() {
      if (!stepper) stepper = createTaskStepper(this, subscriber)
      this._runningOperation = stepper.stepThrough()
      return this._runningOperation
    },

    /**
     *  An instance can be canceled by the scheduler (e.g. due to flow control)
     *  or self canceled (e.g. if the task was aborted).
     */
    selfCanceled: false,
    cancel() { // self canceled
      this._cancel('self')
      return this
    },
    _cancel(canceler = 'scheduler') { // scheduler canceled
      if (!stepper) stepper = createTaskStepper(this, subscriber)
      if (canceler === 'self') this.selfCanceled = true
      stepper.triggerCancel()
      // We "start" the dropped instances so that the stepper can handle
      // the per instance logic (it won't actually run the operation).
      if (this.isDropped) this._start()
      return this._runningOperation
    },

    /**
     * To finalize an instance that was called with the `keepRunning` binding,
     * we call the resulting handle method returned by the stepper.
     */
    destroy() {
      if (!this.isFinished) this.cancel()
      this._runningOperation.then(resolved => resolved())
      return this._runningOperation
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
