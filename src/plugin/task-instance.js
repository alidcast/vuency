/**
 * A {TaskInstance}
 * @constructor Task Instance
 */
export default function createTaskInstance(operation) {
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

    get isOver() {
      return this.isCanceled || this.isRejected || this.isResolved
    },

    get state() {
      if (this.isDropped) return 'dropped'
      else if (this.isCanceled) return 'canceled'
      else if (this.isRejected) return 'rejected'
      else if (this.isResolved) return 'resolved'
      else if (this.hasStarted) return 'running'
      else return 'waiting'
    }
  }
}
