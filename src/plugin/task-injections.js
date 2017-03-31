/**
 * {TaskInjections} are helpers functions for common async operations that
 * automatically clean up after themselves (or have ways of being identified
 * and canceled) upon task cancelation.
 */
export default function createTaskInjections(host) {
  return {
    provider: {
      cleanup(val) {
        return val
      }
    },
    /**
     * Injections.
     */
    timeout: (duration) => createCancelableTimeout(duration)
  }
}

/**
 *  Cancelable Timeout hack.
 *
 *  The timeout can be identified from other promises by asserting existence
 *  of `promise.cancel`.
 *
 *  @notes
 *    - Super() does not have `this` context so we have to create the timer
 *      via a factory function and use closures for the cancelation data.
 *    - Methods outside the consctutor do not persist with the extended
 *      promise object so we have to declare them via `this`.
 *  @constructor Timer
 */
function createCancelableTimeout(duration) {
  // let timerData = new WeakMap()
  let timerId, clearPromise
  class Timer extends Promise {
    constructor() {
      // Promise Construction
      super(resolve => {
        clearPromise = resolve
        timerId = setTimeout(resolve, duration)
      })
      // Timer Cancelation
      this.isCanceled = false
      this.cancel = function() {
        clearPromise()
        clearTimeout(timerId)
        this.isCanceled = true
      }
    }
  }
  return new Timer()
}
