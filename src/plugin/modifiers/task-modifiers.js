import assert from '../../util/assert'

/**
*  Creates default task policy with modifier options.
*  @constructs Task Modifiers
*/
export default function createTaskModifiers(_type, _num) {
  let flowTypes = ['enqueue', 'restart', 'drop']

  return {
    get policy() {
      return {
        flow: _type,
        concurrency: _num
      }
    },
    // might need { policy, createModifiers().apply(this) } if this is not correct
    modifiers: {
      flow(type) {
        assert(flowTypes.includes(type), `${type} is not a flow control option`)
        this.policy.flow = type
        return this
      },
      concurrency(num) {
        this.policy.concurrency = num
        return this
      }
    }
  }
}
