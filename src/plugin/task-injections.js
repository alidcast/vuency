/**
 * {TaskInjections} are helpers functions for common async operations that
 * automatically clean up after themselves (or have ways of being identified
 * and canceled) upon task cancelation.
 */
export default function createTaskInjections() {
  return {
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
 *    - Methods outside the constuctor do not persist with the extended
 *      promise object so we have to declare them via `this`.
 *  @constructor Timer
 */
export function createCancelableTimeout(duration) {
  let timerId, cancelPromise
  class Timer extends Promise {
    constructor() {
      // Promise Construction
      super((resolve, reject) => {
        cancelPromise = resolve.bind(null, 'timeout canceled')
        timerId = setTimeout(function() {
          resolve('timeout done')
        }, duration)
      })
      // Timer Cancelation
      this.isCanceled = false
      this._cancel_ = () => {
        if (this._v !== 'timeout done') {
          cancelPromise()
          clearTimeout(timerId)
          this.isCanceled = true
        }
      }
    }
  }
  // For this to work in Safari, we have to convert the timer back to a Promise
  Timer.prototype.constructor = Promise
  return new Timer()
}
