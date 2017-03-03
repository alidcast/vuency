import { isPromise } from '../util/assert'

/**
  A {Stepper} is responsible for iterating through the generator function.
*  It iterates through each yield, while being mindful of the instances state.
*  As long as the instance is not `Canceled` or `Rejected`, it continues to iterate
*  until the instance is `Resolved`.
*
*  @param {Generator} gen
*  @param {instanceInstance} instance
*  @param {Function} updater - cues Scheduler to update
*  @constructs Task Stepper
*/
export default function createTaskStepper(instance, update) {
  let iter = instance.operation() // start generator

  return {
    handleCancel() {
      if (instance.isOver) return this
      instance.isCanceled = true
      update()
      return this
    },

    handleError(err) {
      instance.isRejected = true
      instance.error = err
      update()
      return this
    },

    handleSuccess(val) {
      instance.isResolved = true
      instance.value = val
      update()
      return this
    },

    // checks the state of the instance to take appropriate actions
    // recursively iterates through generator function until instance is finished
    stepThrough(gen) {
      let stepper = this

      function takeAStep(prev = undefined) {
        let output, value

        if (instance.isCanceled) return stepper              // CANCELED / DROPPED
        if (!instance.hasStarted) instance.hasStarted = true

        try { // iterate through another yield
          output = iter.next(prev)
          value = output.value
        }
        catch (err) {                                         // REJECTED
          return stepper.handleError(err)
        }

        if (output.done) {                                    // RESOLVED
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
