import createTaskProperty from './task-property'
import createTaskPolicy from './task-policy'
import createTaskObservers from './task-observers'
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
  /**
   * Converts a operation into a task object with scheduler modifier options
   */
  return function createTask(operation) {
    assert(isFn(operation), 'All task actions must be functions')

    let { policy, modifiers } = createTaskPolicy('enqueue', 1),
        taskProp = createTaskProperty(host, operation, policy),
        observers = createTaskObservers(host, taskProp)

    return {
      operation,
      ...taskProp,
      ...observers,
      policy,
      ...modifiers
    }
  }
}
