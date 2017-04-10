import { isObj, isGen } from '../util/assert'

/**
  A {Stepper} is responsible for iterating through the generator function.
*  It iterates through each yield, while being mindful of the task instance's
*  state. As long as the instance is not `Canceled` or `Rejected`,
*  it continues to iterate until the instance is `Resolved`.
*
* @note
*   On each yield, if the output value is a promise and has a `_cancel_` method,
*   then the value will be saved for cleanup incase the instance is canceled.
*
*  @returns {TaskInstance} after operation has finished running
*  @constructs Task Stepper
*/
export default function createTaskStepper(ti, callbacks) {
  let iter,
      cancelablePromise,
      keepRunning = ti.options.keepRunning

  if (isGen(ti._operation)) iter = ti._operation() // start generator

  return {
    async handleStart() {
      await callbacks.asyncBeforeStart(ti)
      ti.hasStarted = true
      ti._updateComputed()
      return ti
    },

    async handleYield(prev) {
      await callbacks.asyncBeforeYield(ti)
      let output = iter.next(prev)
      return output
    },

    handleSuccess(val) {
      ti.isResolved = true
      ti.value = val
      ti._updateComputed()
      callbacks.onSuccess(ti)
      return ti
    },

    handleError(err) {
      ti.isRejected = true
      ti.error = err
      ti._updateComputed()
      callbacks.onError(ti)
      return ti
    },

    /**
     * Task Instances are canceled from the outside,
     * so the cancelation and handeling are done seperately.
     */
    triggerCancel() {
      if (ti.isFinished) return ti
      // cancel timeout/promises as soon as cancelation is triggered
      // so that it does not outlive operation lifespan in the UI interaction
      if (cancelablePromise) cancelablePromise._cancel_()
      ti.isCanceled = true
      ti._updateComputed()
      return ti
    },
    handleCancel() {
      if (iter && !ti.isDropped) iter.return() // cause iter to terminate; still runs finally clause.
      callbacks.onCancel(ti)
      return ti
    },

    handleEnd(resultCallback) {
      resultCallback()
      callbacks.onFinish(ti)
      if (keepRunning) callbacks.onDestroy(ti)
      return ti
    },

    /**
     *  Wrapper for task's operation.
     *
     *  Runs operation, updates state, and either executes resulting callback
     *  or, if operation is kept running, defers it for later handling.
     */
    async stepThrough() {
      let stepper = this

      if (ti.isCanceled) return stepper.handleEnd(stepper.handleCancel)     // CANCELED / PRE-START

      if (!ti.hasStarted) await stepper.handleStart()                       // STARTED

      if (ti.isCanceled) return stepper.handleEnd(stepper.handleCancel)     // CANCELED / POST-START

      const resultCallback = isGen(ti._operation)                           // RESOLVED / REJECTED / CANCELED
          ? await stepper._iterThrough()
          : await stepper._syncThrough()

      if (keepRunning) return stepper.handleEnd.bind(stepper, resultCallback)
      else return stepper.handleEnd(resultCallback)
    },

    /**
     * Recursively iterates through generator function until the operation is
     * either resolved, rejected, or canceled.
     * @return resulting handle callback
     */
    async _iterThrough(prev = undefined) {
      let value, done, stepper = this

      try {
        ({ value, done } = await stepper.handleYield(prev))
      } catch (err) {                                                    // REJECTED
        return stepper.handleError.bind(stepper, err)
      }

      if (isObj(value) && value._cancel_) cancelablePromise = value
      if (ti.isCanceled) return stepper.handleCancel                     // CANCELED / POST-YIELD

      value = await value
      if (done) return stepper.handleSuccess.bind(stepper, value)        // RESOLVED
      else return await this._iterThrough(value)
    },

    /**
     *  Awaits the async function until the operation is either resolved
     *  or rejected. (Cancelation is not an option with async functions.)
     *  @return resulting handle callback
     */
    async _syncThrough() {
      let stepper = this
      return ti._operation()
        .then(val => stepper.handleSuccess.bind(stepper, val))
        .catch(err => stepper.handleError.bind(stepper, err))
    }
  }
}
