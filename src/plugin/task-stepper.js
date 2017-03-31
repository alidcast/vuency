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
export default function createTaskStepper(ti, subscriber, provider) {
  let iter = ti._operation(),
      cancelablePromise

  return {
    async handleStart() {
      await subscriber.asyncBeforeStart(ti)
      ti.hasStarted = true
      ti._updateComputed()
      return ti
    },

    async handleYield(prev) {
      await subscriber.asyncBeforeYield(ti)
      let output = iter.next(prev)
      return output
    },

    handleSuccess(val) {
      ti.isResolved = true
      ti.value = val
      ti._updateComputed()
      subscriber.onSuccess(ti)
      subscriber.onFinish(ti)
      return ti
    },

    handleError(err) {
      ti.isRejected = true
      ti.error = err
      ti._updateComputed()
      subscriber.onError(ti)
      subscriber.onFinish(ti)
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
      subscriber.onCancel(ti)
      subscriber.onFinish(ti)
      return ti
    },

    /**
     * Recursively iterates through generator function until
     * operation is either canceled, rejected, or resolved.
     */
    stepThrough(gen) {
      let stepper = this

      async function takeAStep(prev = undefined) {
        let value, done

        if (ti.isCanceled) return stepper.handleCancel()        // CANCELED / PRE-START

        if (!ti.hasStarted) await stepper.handleStart()         // STARTED

        if (ti.isCanceled) return stepper.handleCancel()        // CANCELED / POST-START

        try {
          ({ value, done } = await stepper.handleYield(prev))
        }
        catch (err) {                                           // REJECTED
          return stepper.handleError(err)
        }

        if (isObj(value) && value._cancel_) cancelablePromise = value

        if (ti.isCanceled) return stepper.handleCancel()        // CANCELED / POST-ITER
        value = await value

        if (done) return stepper.handleSuccess(value)           // RESOLVED
        else return takeAStep(value) // keep stepping
      }

      return takeAStep()
    }
  }
}
