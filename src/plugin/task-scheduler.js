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
      { flow, maxRunning, delay, options } = policy

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
   * Attaches the per instance policy to the instance.
   */
  function assignInstanceOptions(ti) {
    let count = waiting.size + running.size + 1
    if (options[count]) ti.options = options[count]
    return ti
  }

  return {
    /**
     * Determines the way the task instance should be scheduled.
     */
    schedule(ti) {
      assignInstanceOptions(ti)
      tp.lastCalled = ti
      if (shouldDrop()) {
        ti._cancel().then(() => this.finalize(ti, false))
      } else if (shouldWait()) {
        if (shouldRestart()) cancelQueued(running)
        waiting.add(ti)
        if (autorun) this.advance()
      } else this.advance(ti)
      return this
    },

    /**
     *  Move task instance from waiting to running queue.
     *  (Can also be advanced directly if called with a task instance.)
     */
    advance(ti = null) {
      if (shouldRun()) {
        if (!ti) ti = waiting.remove().pop()
        tp.lastStarted = ti
        startInstance(ti, delay)
          .then(() => this.finalize(ti))
        running.add(ti)
        tp._updateReactive()
      }
      return this
    },

    /**
     * Updates last instance and reactive data, and removes the task instance
     * from running if it wasn't dropped or called with the keep running binding.
     */
    finalize(ti, didRun = true) {
      let { keepRunning } = ti.options
      if (didRun && !keepRunning) running.extract(item => item === ti)
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
      cancelQueued(waiting, 'all').then(waiting.clear())
      cancelQueued(running, 'all') // running instances clear themselves
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

function startInstance(ti, delay) {
  if (delay > 0) return pause(delay).then(() => ti._start())
  else return ti._start()
}

/**
 * If there's only one item in queue, then we just cancel it directly (this
 * made the task-graph demo smoother, so it's "noticably" faster). Otherwise,
 * it's a `Promise.race` or `Promise.all` on all canceled instances.
 */
function cancelQueued(queue, type = 'race') {
  if (queue.size === 1) {
    let ti = queue.pop()
    if (ti.options.keepRunning) return ti.destroy()
    else return ti._cancel()
  } else {
    let canceledOperations = queue.map(ti => {
      if (ti.options.keepRunning) return ti.destroy()
      else return ti._cancel()
    })
    return Promise[type](canceledOperations)
  }
}

// function destroyQueued() {
//
// }

function updateLastFinished(tp, ti) {
  if (ti.isCanceled) tp.lastCanceled = ti
  else if (ti.isRejected) tp.lastRejected = ti
  else if (ti.isResolved) tp.lastResolved = ti
}
