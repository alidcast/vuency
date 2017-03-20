import assert from '../util/assert'

/**
*  Creates default task policy with modifier options.
*  @constructs Task Modifiers
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
