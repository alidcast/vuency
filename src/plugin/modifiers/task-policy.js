import assert from '../../util/assert'

/**
*  The {TaskPolicy} sets the default scheduling for the task
*  with configuration option.
*
*  @this the {TaskProperty} where the task policy is destructured
*  @constructs TaskPolicy
*/
export default function createTaskPolicy(_type = 'default', _num = 1, _time = 0) {
  let flowTypes = ['default', 'enqueue', 'restart', 'drop']

  const currentPolicy = {
    flow: _type,
    delay: _time,
    maxRunning: _num
  }

  return {
    // default scheduler policy
    get policy() {
      return currentPolicy
    },

    /**
     *  Sets the scheduling rule for repeat calls and optionally the amount
     *  of time to delay the scheduling of the task.
     */
    flow(type, time = 0) {
      assert(flowTypes.indexOf(type) > -1, `${type} is not a flow control option`)
      currentPolicy.flow = type
      currentPolicy.delay = time
      return this
    },

    /**
     * Sets the number of instances allowed to run concurrently.
     */
    maxRunning(num) {
      currentPolicy.maxRunning = num
      return this
    }
  }
}
