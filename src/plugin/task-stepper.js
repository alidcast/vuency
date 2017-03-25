import { pause } from '../util/async'

/**
  A {Stepper} is responsible for iterating through the generator function.
*  It iterates through each yield, while being mindful of the tis state.
*  As long as the ti is not `Canceled` or `Rejected`, it continues to iterate
*  until the ti is `Resolved`.
*
*  @returns {TaskInstance} after operation has finished running
*  @constructs Task Stepper
*/
export default function createTaskStepper(ti, subscriber) {
  let iter = ti.operation() // start generator

  return {
    async handleStart() {
      if (ti._delayNext > 0) await pause(ti._delayNext)
      await subscriber.asyncBeforeStart()
      ti.hasStarted = true
      ti._setComputedProps()
      return ti
    },

    async handleNext(prev) {
      await subscriber.asyncBeforeNext()
      let output = iter.next(prev)
      return output
    },

    handleCancel() {
      ti.isCanceled = true
      ti._setComputedProps()
      if (ti.isDropped) subscriber.onDrop()
      if (ti.isRestarted) subscriber.onRestart()
      subscriber.onCancel()
      subscriber.afterEnd()
      return ti
    },

    handleError(err) {
      ti.isRejected = true
      ti.error = err
      ti._setComputedProps()
      subscriber.onError()
      subscriber.afterEnd()
      return ti
    },

    handleSuccess(val) {
      ti.isResolved = true
      ti.value = val
      ti._setComputedProps()
      subscriber.onSuccess()
      subscriber.afterEnd()
      return ti
    },

    // checks the state of the ti to take appropriate actions
    // recursively iterates through generator function until operation is finished
    async stepThrough(gen) {
      let stepper = this

      async function takeAStep(prev = undefined) {
        let value, done

        if (ti.isCanceled) return ti                         // CANCELED / DROPPED
        if (!ti.hasStarted) await stepper.handleStart()
        if (ti.isCanceled) return ti                         // CANCELED

        try {
          ({ value, done } = await stepper.handleNext(prev))
        }
        catch (err) {                                        // REJECTED
          // TODO better error handling
          return stepper.handleError(err)
        }

        if (ti.isCanceled) return ti                         // CANCELED (post iteration)

        value = await value
        if (done) return stepper.handleSuccess(value)        // RESOLVED
        else return await takeAStep(value)
      }

      return await takeAStep()
    }
  }
}
