import assert, { isFn } from '../../util/assert'

export default function setupTaskFactory(host) {
  return function createTask(action) {
    assert(isFn(action), 'All actions must be functions')
    assert(!host[action.name], `The task name must be unique`)

    return {
      name: action.name,
      run: action.bind(host)
    }
  }
}
