import { isObj } from '../util/assert'

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
  let iter = ti._operation(),
      cancelablePromise

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
      ti.isCanceled = true
      ti._updateComputed()
      return ti
    },
    handleCancel() {
      iter.return() // cause iter to terminate; still runs finally clause
      if (cancelablePromise) cancelablePromise._cancel_()
      callbacks.onCancel(ti)
      return ti
    },

    /**
     *
     */
    handleEnd(resultCallback) {
      resultCallback()
      callbacks.onFinish(ti)
      return this
    },

    /**
     * Recursively iterates through generator function until
     * operation is either canceled, rejected, or resolved.
     */
    async stepThrough(gen) {
      let stepper = this

      if (ti.isCanceled) return stepper.handleEnd(stepper.handleCancel)       // CANCELED / PRE-START

      if (!ti.hasStarted) await stepper.handleStart()                         // STARTED

      const resultCallback = await (async function takeAStep(prev = undefined) {
        let value, done

        if (ti.isCanceled) return stepper.handleCancel                        // CANCELED / POST-START

        try {
          ({ value, done } = await stepper.handleYield(prev))
        }
        catch (err) {                                                         // REJECTED
          return stepper.handleError.bind(stepper, err)
        }

        if (isObj(value) && value._cancel_) cancelablePromise = value
        value = await value
        if (ti.isCanceled) return stepper.handleCancel()                      // CANCELED / POST-YIELD

        if (done) return stepper.handleSuccess.bind(stepper, value)           // RESOLVED
        else return takeAStep(value)
      })()

      return stepper.handleEnd(resultCallback)
    }
  }
}
