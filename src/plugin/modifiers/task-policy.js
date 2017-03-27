import assert from '../../util/assert'

/**
*  The {TaskPolicy} sets the default scheduling for the task
*  with configuration option.
*
*  @this the {TaskProperty} where the task policy is destructured
*  @constructs TaskPolicy
*/
export default function createTaskPolicy(_type = 'normal', _num = 1, _time = 0) {
  let flowTypes = ['normal', 'enqueue', 'restart', 'drop'],
      policy = {
        flow: _type,
        maxRunning: _num,
        delay: _time
      }

  return {
    // default scheduler policy
    get policy() {
      return policy
    },

    /**
     *  Sets the scheduling rule for repeat calls and optionally the amount
     *  of time to delay the scheduling of the task.
     */
    flow(type, time = 0) {
      assert(flowTypes.indexOf(type) > -1, `${type} is not a flow control option`)
      policy.flow = type
      policy.delay = time
      return this
    },

    /**
     * Sets the number of instances allowed to run concurrently.
     */
    maxRunning(num) {
      policy.maxRunning = num
      return this
    }
  }
}
