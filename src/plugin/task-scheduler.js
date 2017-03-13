import createQueue from '../util/queue'

/**
 * A {Scheduler} is responsible for scheduling and running task instances,
 * as well as updating all 'last' task states.
 *
 * @param {Object} policy - scheduler run policy
 * @param {Boolean} autorun - whether scheduler is updated automatically
 * @constructs Task Scheduler
 */

export default function createTaskScheduler(policy, autorun = true) {
  let waiting = createQueue(),
      running = createQueue(),
      { flow, concurrency } = policy

  function shouldRun() {
    return waiting.isActive && running.size < concurrency
  }

  function shouldDrop() {
    return flow === 'drop' && (waiting.size + running.size >= concurrency)
  }

  function shouldRestart() {
    return flow === 'restart' && (running.isActive && waiting.isActive)
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
    schedule(ti) { //
      this.lastCalled = ti
      if (!shouldDrop()) {
        if (shouldRestart()) running.forEach(ti => ti.cancel())
        waiting.add(ti)
        if (autorun) this.advance()
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
          this.lastStarted = ti
          ti._runningInstance = Promise.resolve(
            ti.start()
          ).then(finishedInstance => {
            running.extract(item => item === ti) // remove itself
            updateLastFinished(this, ti)
            this.advance() 
            return finishedInstance
          })
          running.add(ti)
        }
      }
      return this
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

/**
 * Updates the scheduler's state based on the finished task instance's state.
 */
function updateLastFinished(scheduler, ti) {
  if (ti.isCanceled) scheduler.lastCanceled = ti
  else if (ti.isRejected) scheduler.lastRejected = ti
  else if (ti.isResolved) scheduler.lastResolved = ti
}
