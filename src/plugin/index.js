import createTaskProperty from './task-property'
import createTaskInjections from './task-injections'
import assert, { isFn } from '../util/assert'

/**
 * A {Task} is composed of two parts. Primarily, it represents
 * the {TaskProperty} (TP) that is injected into the host component.
 * It also represents the {TaskInstance} (TI) that is created on each call to
 * the tp's `run` action.
 *
 * @constructs Task
 */
export default function initTaskFactory(host) {
  let { provider, ...injections } = createTaskInjections()

  return {
    createTask(operation) {
      assert(isFn(operation), 'All task actions must be functions')
      return {
        operation,
        ...createTaskProperty(host, operation, provider)
      }
    },
    taskHelpers: injections
  }
}
