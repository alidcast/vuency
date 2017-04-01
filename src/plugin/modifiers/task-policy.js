import assert from '../../util/assert'

/**
*  The {TaskPolicy} sets the default scheduling for the task
*  with configuration option.
*
*  @this the {TaskProperty} where the task policy is destructured
*  @constructs TaskPolicy
*/
export default function createTaskPolicy(_type = 'default', _num = 1, _time = 0) {
  let flowTypes = ['default', 'enqueue', 'restart', 'drop'],
      currentPolicy = {
        flow: _type,
        delay: _time,
        maxRunning: _num,
        bindings: {}
      }

  return {
    // default configuration
    get policy() {
      return currentPolicy
    },

    /**
     *  Sets the scheduling rule for repeat calls.
     */
    flow(type, opts = {}) {
      assert(flowTypes.indexOf(type) > -1, `${type} is not a flow control option`)
      currentPolicy.flow = type
      if (Reflect.has(opts, 'delay')) currentPolicy.delay = opts.delay
      if (Reflect.has(opts, 'maxRunning')) currentPolicy.maxRunning = opts.maxRunning
      return this
    },

    /**
     *  Per instance configuration.
     */
    forCall(id, opts = {}) {
      let instancePolicy = {}
      if (Reflect.has(opts, 'keepAlive')) instancePolicy.keepAlive = opts.keepAlive
      currentPolicy.bindings[id] = instancePolicy
      return this
    }
  }
}
