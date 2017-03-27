import createQueue from '../util/queue'

/**
 * A {Scheduler} is responsible for scheduling and running task instances,
 * as well as updating all 'last' task states.
 *
 * @param {Object} policy - scheduler run policy
 * @param {Boolean} autorun - whether schedule is updated automatically (primarily for testing)
 * @constructs Task Scheduler
 */
export default function createTaskScheduler(policy, autorun = true) {
  let waiting = createQueue(),
      running = createQueue(),
      { flow, delay, maxRunning } = policy

  function shouldDrop() {
    return flow === 'drop' && (waiting.size + running.size === maxRunning)
  }

  function shouldRestart() {
    return flow === 'restart' && running.size === maxRunning
  }

  function shouldWait() {
    return flow === 'enqueue' || flow === 'restart' || flow === 'drop'
  }

  function shouldRun() {
    return waiting.isActive && running.size < maxRunning
  }

  return {
    lastCalled: null,
    lastStarted: null,
    lastResolved: null,
    lastRejected: null,
    lastCanceled: null,

    /**
     * Add task instance to waiting queue.
     */
    schedule(ti) {
      this.lastCalled = ti
      if (shouldDrop()) {
        ti._cancel()
        updateLastFinished(this, ti)
      }
      else if (shouldWait()) {
        if (shouldRestart()) cancelQueued(running)
        waiting.add(ti)
        if (autorun) this.advance()
      }
      else {
        runTask(this, ti)
          .then(() => updateLastFinished(this, ti))
      }
      return this
    },

    /**
     * Move task instance from waiting to running queue.
     */
    advance() {
      if (shouldRun()) {
        let ti = waiting.remove().pop()
        if (ti) {
          runTask(this, ti, delay)
            .then(() => this.finalize(ti))
          running.add(ti)
        }
      }
      return this
    },

    /**
     * Removes the task instance from running and updates last instance data.
     */
    finalize(ti) {
      running.extract(item => item === ti)
      updateLastFinished(this, ti)
      if (autorun) this.advance()
      return this
    },

    /**
     * Cancels all scheduled task instances and clears queues.
     */
    emptyOut() {
      cancelQueued(waiting, 'self')
      cancelQueued(running, 'self')
      // only need to clear waiting queue since running instances
      // extract themselves upon termination
      waiting.clear()
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

function runTask(schedule, ti, delay) {
  schedule.lastStarted = ti
  ti._delayStart = delay
  ti._runningOperation = ti._start()
  return ti._runningOperation
}

function updateLastFinished(scheduler, ti) {
  if (ti.isCanceled) scheduler.lastCanceled = ti
  else if (ti.isRejected) scheduler.lastRejected = ti
  else if (ti.isResolved) scheduler.lastResolved = ti
}

function cancelQueued(queue, canceler = 'scheduler') {
  let cancelMethod
  canceler === 'self' ? cancelMethod = 'cancel' : cancelMethod = '_cancel'
  // if one item in queue, then we just cancel it directly; this made
  // the task-graph demo work better, so it's "noticably" faster. :)
  if (queue.size === 1) queue.pop()[cancelMethod]()
  else queue.forEach(item => item[cancelMethod]())
}
