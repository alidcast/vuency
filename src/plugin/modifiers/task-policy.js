import assert from '../../util/assert'

/**
*  Creates default {TaskPolicy} with configuration options.
*
*  @this the {TaskProperty} where the task policy is destructured
*  @constructs TaskPolicy
*/
export default function createTaskPolicy(_type, _num) {
  let flowTypes = ['enqueue', 'restart', 'drop']

  return {
    get policy() {
      return {
        flow: _type,
        concurrency: _num
      }
    },
    changePolicy(type, num = 1) {
      assert(flowTypes.includes(type), `${type} is not a flow control option`)
      this.policy.flow = type
      this.policy.concurrency = num
      return this
    }
  }
}
