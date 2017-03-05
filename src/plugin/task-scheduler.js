import createQueue from '../util/queue'

/**
 * A {Scheduler} is responsible for scheduling and running task instances,
 * as well as updating all 'last' task states.
 *
 * @param {Object} policy - scheduler flow and concurrency policy
 * @param {Boolean} autorun - whether running queue is updated automatically
 * @constructs Task Scheduler
 */
// TODO
// 1. make running a pseudo queue? e.g. add and substract concurrency
//
// 2. Smarter update
// Not full? -> start running
// full? Don't do anything, wait for finihsed task to update.
//
export default function createTaskScheduler(policy, autorun = true) {
  let waiting = createQueue(),
      running = createQueue(),
      { flow, concurrency } = policy

  function shouldDrop() {
    return flow === 'drop' && (waiting.size + running.size === concurrency)
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
        waiting.add(ti)
        if (autorun) this.update()
      }
      return this
    },

    /**
     * Fill running queue with task intances from waiting queue.
     */
    _advance() {
      let lastStarted = saturateRunning(waiting, running, concurrency)
      if (lastStarted) this.lastStarted = lastStarted
      return this
    },

    /**
     * Remove all finished task instances from running queue.
     */
    _finalize() {
      let finishedTis = running.extract((ti) => {
        if (shouldRestart() && !ti.isOver) ti.cancel()
        return ti.isOver === true
      })
      if (finishedTis.length > 0) updateLast(this, finishedTis.pop())
      return this
    },

    /**
     * Fill running queue and removed finished task instances.
     */
    update() {
      this._advance()._finalize()
    },

    get isActive() {
      return waiting.isActive || running.isActive
    },

    waiting: {
      get isActive() {
        return waiting.isActive
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
 * Move task instances from waiting to running queue until concurrency is full.
 * @returns {TaskInstance} last started task instance
 */
function saturateRunning(waiting, running, max) {
  let last
  while (waiting.isActive && running.size !== max) {
    let ti = waiting.remove().pop()
    if (ti) {
      ti._runningOperation = ti._run()
      last = ti
      running.add(ti)
    }
  }
  return last
}

/**
 * Updates the scheduler's state based on the finished task instance's state.
 */
function updateLast(scheduler, ti) {
  if (ti.isCanceled) scheduler.lastCanceled = ti
  else if (ti.isRejected) scheduler.lastRejected = ti
  else scheduler.lastResolved = ti
}
