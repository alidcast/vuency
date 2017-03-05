import { isPromise } from '../util/assert'

/**
  A {Stepper} is responsible for iterating through the generator function.
*  It iterates through each yield, while being mindful of the tis state.
*  As long as the ti is not `Canceled` or `Rejected`, it continues to iterate
*  until the ti is `Resolved`.
*
*  @param {Generator} gen - task operation
*  @param {TaskInstance} ti
*  @constructs Task Stepper
*/
export default function createTaskStepper(ti) {
  let iter = ti.operation() // start generator

  return {
    handleCancel() {
      if (ti.isOver) return this
      ti.isCanceled = true
      return ti
    },

    handleError(err) {
      ti.isRejected = true
      ti.error = err
      return ti
    },

    handleSuccess(val) {
      ti.isResolved = true
      ti.value = val
      return ti
    },

    // checks the state of the ti to take appropriate actions
    // recursively iterates through generator function until ti is finished
    stepThrough(gen) {
      let stepper = this

      function takeAStep(prev = undefined) {
        let output, value

        if (ti.isCanceled) return ti                   // CANCELED / DROPPED
        if (!ti.hasStarted) ti.hasStarted = true

        try { // iterate through another yield
          output = iter.next(prev)
          value = output.value
        }
        catch (err) {                                  // REJECTED
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
