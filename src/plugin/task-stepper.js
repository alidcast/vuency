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
export default function createTaskStepper(ti, subscriber, provider) {
  let iter = ti.operation() // start generator

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

    handleCancel() {
      if (ti.isOver) return ti
      ti.isCanceled = true
      ti._updateComputed()
      iter.return() // terminate early and run finally clause
      // provider.off()
      if (ti.isDropped) subscriber.onDrop(ti)
      if (ti.isRestarted) subscriber.onRestart(ti)
      subscriber.onCancel(ti)
      subscriber.afterEnd(ti)
      return ti
    },

    handleError(err) {
      ti.isRejected = true
      ti.error = err
      ti._updateComputed()
      subscriber.onError(ti)
      subscriber.afterEnd(ti)
      return ti
    },

    handleSuccess(val) {
      ti.isResolved = true
      ti.value = val
      ti._updateComputed()
      subscriber.onSuccess(ti)
      subscriber.afterEnd(ti)
      return ti
    },

    /**
     * At each step, checks the state of the task instance to know appropriate
     * action and recursively iterates through generator function until
     * operation is either canceled, rejected, or resolved.
     */
    async stepThrough(gen) {
      let stepper = this

      // when the task is canceled that means the steppers' `handelCancel`
      // method was already called from the outside, so all we have to do
      // is return the task instance
      async function takeAStep(prev = undefined) {
        let value, done
        // TODO
        if (ti._delayStart > 0) await pause(ti._delayStart)

        if (ti.isCanceled) return ti                         // CANCELED (pre start)
        if (!ti.hasStarted) await stepper.handleStart()

        try {
          ({ value, done } = await stepper.handleYield(prev))
        }
        catch (err) {                                        // REJECTED
          // TODO better error handling
          return stepper.handleError(err)
        }

        if (ti.isCanceled) return ti                         // CANCELED (post iteration)

        // if (typeof fn !== 'undefined') console.log(value)
        if (typeof value !== 'undefined' && typeof value.cancel === 'function') {
          value.cancel()
          console.log(value)
        }
        value = await value
        if (done) return stepper.handleSuccess(value)        // RESOLVED
        else return takeAStep(value)
      }

      return takeAStep()
    }
  }
}
