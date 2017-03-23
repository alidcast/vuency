import { isPromise } from '../util/assert'

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
    handleStart() {
      ti.hasStarted = true
      ti._setComputedProps()
      return ti
    },

    handleCancel() {
      ti.isCanceled = true
      ti._setComputedProps()
      if (ti.isDropped) subscriber.emitDrop()
      if (ti.isRestarted) subscriber.emitRestart()
      subscriber.emitCancel()
      subscriber.emitFinalize()
      return ti
    },

    handleError(err) {
      ti.isRejected = true
      ti.error = err
      ti._setComputedProps()
      subscriber.emitError()
      subscriber.emitFinalize()
      return ti
    },

    handleSuccess(val) {
      ti.isResolved = true
      ti.value = val
      ti._setComputedProps()
      subscriber.emitSuccess()
      subscriber.emitFinalize()
      return ti
    },

    // checks the state of the ti to take appropriate actions
    // recursively iterates through generator function until ti is finished
    stepThrough(gen) {
      let stepper = this

      function takeAStep(prev = undefined) {
        let output, value

        if (ti.isCanceled) return ti                   // CANCELED / DROPPED
        if (!ti.hasStarted) stepper.handleStart()

        try { // iterate through another yield
          output = iter.next(prev)
          value = output.value
        }
        catch (err) {                                  // REJECTED
          // TODO better error handling
          return stepper.handleError(err)
        }

        if (output.done) {                             // RESOLVED
          return stepper.handleSuccess(value)
        }

        if (isPromise(value)) {
          return value.then(resolved => takeAStep(resolved))
        }
        else {
          return takeAStep(value)
        }
      }

      return takeAStep()
    }
  }
}
