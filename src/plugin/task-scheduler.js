import createQueue from '../util/queue'

/**
 * A {Scheduler} is responsible for scheduling and running `Task Instances`,
 * as well as updating all `last` task states.
 *
 * @param {Object} policy - scheduler flow and concurrency policy
 * @param {Boolean} autorun - whether running queue is updated automatically
 * @constructs Task Scheduler
 */
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

    schedule(ti) { // add to waiting
      this.lastCalled = ti
      if (!shouldDrop()) {
        waiting.add(ti)
        if (autorun) this.update()
      }
      return this
    },

    // the Scheduler's queues are updated when a `ti` is first scheduled and
    // by the `Stepper` when the `ti` has finished running
    update() {
      this._advance()._finalize()
    },

    peekWaiting() {
      return waiting.peekAll()
    },

    peekRunning() {
      return running.peekAll()
    },
    //
    //  get waitingIsActive() {
    //    return waiting.isActive
    //  },
    //
    //  get runningIsActive() {
    //    return running.isActive
    //  },

    get isActive() {
      return waiting.isActive || running.isActive
    },

    // move from waiting to running
    _advance() {
      let lastStarted = saturateRunning(waiting, running, concurrency)
      if (lastStarted) this.lastStarted = lastStarted
      return this
    },

    // remove all finished `ti`s from running
    _finalize() {
      let finishedTis = running.extract((ti) => {
        if (shouldRestart() && !ti.isOver) ti.cancel()
        return ti.isOver === true
      })
      if (finishedTis.length > 0) updateLast(this, finishedTis.pop())
      return this
    },

    // we expose an alias to the waiting and running queues for internal use
    // so that task property can watch for changes and more eagerly compute data

    get waitingQueue() {
      return waiting.alias
    },

    get runningQueue() {
      return running.alias
    }
  }
}

 // @summary move `ti`s from waiting to running queue
 // @returns {Promise} the running task of the last called `ti`
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

// @summary updates scheduler state based on the finished tasks' state
function updateLast(scheduler, ti) {
  if (ti.isCanceled) scheduler.lastCanceled = ti
  else if (ti.isRejected) scheduler.lastRejected = ti
  else scheduler.lastResolved = ti
}
