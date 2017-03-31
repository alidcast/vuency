import createQueue from '../util/queue'
import { pause } from '../util/async'

/**
 * A {Scheduler} is responsible for scheduling and running task instances,
 * as well as updating all 'last' task states.
 *
 * @param {Object} tp - task property
 * @param {Object} policy - scheduler run policy
 * @param {Boolean} autorun - whether schedule is updated automatically (primarily for testing)
 * @constructs Task Scheduler
 */
export default function createTaskScheduler(tp, policy, autorun = true) {
  let waiting = createQueue(),
      running = createQueue(),
      { flow, delay, maxRunning } = policy

  /**
   * Drop instances when total queued reaches concurrency limit.
   */
  function shouldDrop() {
    return flow === 'drop' && (waiting.size + running.size === maxRunning)
  }

  /**
   * Restart instances when currently running tasks reaches concurrency limit.
   */
  function shouldRestart() {
    return flow === 'restart' && running.size === maxRunning
  }

  /**
   * All custom flow types are added to waiting queue, since not all of them
   * will be dropped or restarted.
   */
  function shouldWait() {
    return flow === 'enqueue' || flow === 'restart' || flow === 'drop'
  }

  /**
   * Unless the default behavior is desired, only attempt to run an instance if
   * there is atleast one waiting and the concurrency has freed up.
   */
  function shouldRun() {
    return (waiting.isActive && running.size < maxRunning) || flow === 'default'
  }

  /**
   * We start all task instances, even dropped ones, so that the stepper
   * can handle the per instance logic (it won't actually run the operation).
   */
  function handleTask(ti, shouldDrop = false) {
    if (shouldDrop) ti._runningOperation = ti._cancel()._start()
    else if (delay > 0) ti._runningOperation = pause(delay).then(() => ti._start())
    else ti._runningOperation = ti._start()
    return ti._runningOperation
  }

  return {
    /**
     * Add task instance to waiting queue.
     */
    schedule(ti) {
      tp.lastCalled = ti
      if (shouldDrop()) {
        handleTask(ti, true).then(() => this.finalize(ti, false))
      }
      else if (shouldWait()) { // no dropped instances are being run
        if (shouldRestart()) cancelQueued(running)
        waiting.add(ti)
        if (autorun) this.advance()
      }
      else this.advance(ti)
      return this
    },

    /**
     * Move task instance from waiting to running queue.
     */
    advance(ti = null) {
      if (shouldRun()) {
        if (!ti) ti = waiting.remove().pop()
        tp.lastStarted = ti
        handleTask(ti).then(() => this.finalize(ti))
        running.add(ti)
        tp._updateReactive()
      }
      return this
    },

    /**
     * Removes the task instance from running and updates last instance data.
     */
    finalize(ti, didRun = true) {
      if (didRun) running.extract(item => item === ti)
      updateLastFinished(tp, ti)
      tp._updateReactive()
      if (autorun && waiting.isActive) this.advance()
      return this
    },

    /**
     * Cancels all scheduled task instances and clears queues.
     */
    clear() {
      let instances = [].concat(waiting.alias).concat(running.alias)
      cancelQueued(waiting, 'self')
      cancelQueued(running, 'self')
      waiting.clear()
      running.clear()
      tp._updateReactive()
      return instances
    },

    get isActive() {
      return waiting.isActive || running.isActive
    },

    get concurrency() {
      return running.size
    },

    waiting: {
      get isActive() {
        return waiting.isActive
      },

      get size() {
        return waiting.size
      },

      peek() {
        return waiting.peekAll()
      },

      alias() {
        return waiting.alias
      }
    },

    running: {
      get isActive() {
        return running.isActive
      },

      get size() {
        return running.size
      },

      peek() {
        return running.peekAll()
      },

      alias() {
        return running.alias
      }
    }
  }
}

function updateLastFinished(tp, ti) {
  if (ti.isCanceled) tp.lastCanceled = ti
  else if (ti.isRejected) tp.lastRejected = ti
  else if (ti.isResolved) tp.lastResolved = ti
}

function cancelQueued(queue, canceler = 'scheduler') {
  let cancelMethod
  canceler === 'self' ? cancelMethod = 'cancel' : cancelMethod = '_cancel'
  // if one item in queue, then we just cancel it directly; this made
  // the task-graph demo work better, so it's "noticably" faster. :)
  if (queue.size === 1) queue.pop()[cancelMethod]()
  else queue.forEach(item => item[cancelMethod]())
}
