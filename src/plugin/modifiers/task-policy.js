import assert from '../../util/assert'

/**
*  The {TaskPolicy} sets the default scheduling for the task
*  with configuration option.
*
*  @this the {TaskProperty} where the task policy is destructured
*  @constructs TaskPolicy
*/
export default function createTaskPolicy(_type, _num = 1) {
  let flowTypes = ['enqueue', 'restart', 'drop'],
      flow = _type,
      maxRunning = _num,
      delay = 0

  return {
    get policy() {
      return {
        flow,
        delay,
        maxRunning
      }
    },
    /**
     *  Sets the scheduling rule for repeat calls and optionally the amount
     *  of time to delay the scheduling of the task.
     */
    flow(type, time = 0) {
      assert(flowTypes.includes(type), `${type} is not a flow control option`)
      flow = type
      delay = time
      return this
    },

    /**
     * Sets the number of instances allowed to run concurrently.
     */
    maxRunning(num) {
      maxRunning = num
      return this
    }
  }
}
