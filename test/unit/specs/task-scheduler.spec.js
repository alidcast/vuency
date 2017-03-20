/* eslint-disable no-unused-expressions */
/* global describe, it, expect, beforeEach, sinon */

import createTaskScheduler from 'src/plugin/task-scheduler'
import createTaskInstance from 'src/plugin/task-instance'
import createTaskPolicy from 'src/plugin/task-policy'
import { pause } from 'src/util/async'

function * exTask() {
  return 'passed'
}

function * rejectedTask() {
  return yield sinon.stub().returns.throws()
}

describe('Task Scheduler', function() {
  let scheduler,
      autoScheduler,
      ti1,
      ti2,
      ti3,
      ti4,
      policy = createTaskPolicy('enqueue', 2).policy

  beforeEach(() => {
    scheduler = createTaskScheduler(policy, false)
    autoScheduler = createTaskScheduler(policy, true)
    ti1 = createTaskInstance(exTask)
    ti2 = createTaskInstance(exTask)
    ti3 = createTaskInstance(exTask)
    ti4 = createTaskInstance(rejectedTask)
  })

  it('schedules the task', () => {
    scheduler.schedule(ti1)
    expect(scheduler.waiting.size).to.equal(1)
    expect(scheduler.running.size).to.equal(0)
  })

  it('schedules multiple tasks', () => {
    scheduler.schedule(ti1).schedule(ti2).schedule(ti3)
    expect(scheduler.waiting.size).to.equal(3)
    expect(scheduler.running.size).to.equal(0)
  })

  it('moves one task from waiting to running', () => {
    scheduler.schedule(ti1).schedule(ti2).schedule(ti3)
    expect(scheduler.lastStarted).to.be.null
    scheduler.advance()
    expect(scheduler.waiting.size).to.equal(2)
    expect(scheduler.running.size).to.equal(1)
    expect(scheduler.lastStarted).to.equal(ti1)
  })

  it('moves multiple tasks from waiting to running', () => {
    scheduler.schedule(ti1).schedule(ti2)
      .advance().advance()
    expect(scheduler.waiting.size).to.equal(0)
    expect(scheduler.running.size).to.equal(2)
  })

  it('removes one finished task from running', async () => {
    scheduler.schedule(ti1).advance()
    await ti1._runningInstance
    expect(scheduler.running.size).to.equal(0)
  })

  it('removes multiple finished tasks from running', async () => {
    scheduler.schedule(ti1).schedule(ti2)
      .advance().advance()
    await ti1._runningInstance
    await ti2._runningInstance
    expect(scheduler.running.size).to.equal(0)
  })

  it('gets concurrency', () => {
    scheduler.schedule(ti1).schedule(ti2)
      .advance().advance()
    expect(scheduler.concurrency).to.equal(2)
  })

  it('gets is active', async () => {
    scheduler.schedule(ti1)
    expect(scheduler.isActive).to.be.true
    scheduler.advance()
    expect(scheduler.isActive).to.be.true
    await ti1._runningInstance
    expect(scheduler.isActive).to.be.false
  })

  it('manually updates last', async () => {
    scheduler.schedule(ti1).advance()
    await ti1._runningInstance
    expect(scheduler.lastResolved).to.equal(ti1)
  })

  it('manually updates multiple last', async () => {
    scheduler.schedule(ti1).schedule(ti2)
      .advance().advance()
    await ti1._runningInstance
    await ti2._runningInstance
    expect(scheduler.lastResolved).to.equal(ti2)
  })

  it('manually updates last rejected', async () => {
    scheduler.schedule(ti4).advance()
    await ti4._runningInstance
    expect(scheduler.lastRejected).to.equal(ti4)
    expect(scheduler.lastResolved).to.be.null
    expect(scheduler.lastCanceled).to.be.null
  })

  it('manually updates last canceled', async () => {
    scheduler.schedule(ti1)
    ti1.cancel()
    scheduler.advance()
    await ti1._runningInstance
    expect(scheduler.lastCanceled).to.equal(ti1)
    expect(scheduler.lastResolved).to.be.null
    expect(scheduler.lastRejected).to.be.null
  })

  it('manually runs differently finished functions', async () => {
    scheduler.schedule(ti4).schedule(ti1)
      .advance().advance()
    await ti4._runningInstance
    await ti1._runningInstance
    expect(scheduler.waiting.size).to.equal(0)
    expect(scheduler.running.size).to.equal(0)
    expect(scheduler.lastRejected).to.be.equal(ti4)
    expect(scheduler.lastResolved).to.be.equal(ti1)
  })

  it('manually empties out queues and cancels instances', async () => {
    scheduler.schedule(ti1).schedule(ti2).schedule(ti3).advance().emptyOut()
    expect(scheduler.waiting.size).to.equal(0)
    expect(scheduler.running.size).to.equal(0)
    expect(ti1.isCanceled).to.be.true
    expect(ti2.isCanceled).to.be.true
    expect(ti3.isCanceled).to.be.true
  })

  it('automatically runs one function', async () => {
    autoScheduler.schedule(ti1)
    await ti1._runningInstance
    expect(autoScheduler.waiting.size).to.equal(0)
    expect(autoScheduler.running.size).to.equal(0)
    expect(autoScheduler.lastResolved).to.equal(ti1)
  })

  it('automatically runs differently finished functions', async () => {
    autoScheduler.schedule(ti1).schedule(ti4)
    await ti4._runningInstance
    await ti1._runningInstance
    expect(autoScheduler.waiting.size).to.equal(0)
    expect(autoScheduler.running.size).to.equal(0)
    expect(autoScheduler.lastRejected).to.be.equal(ti4)
    expect(autoScheduler.lastResolved).to.be.equal(ti1)
  })

  it('(concurrency) does not pass running limit', () => {
    autoScheduler.schedule(ti1).schedule(ti2).schedule(ti3)
    expect(autoScheduler.waiting.size).to.equal(1)
    expect(autoScheduler.running.size).to.equal(2)
  })

  it('(drop) drops second call if first one is still running', async () => {
    let dropPolicy = createTaskPolicy('drop', 1).policy,
        dropScheduler = createTaskScheduler(dropPolicy, true)
    dropScheduler.schedule(ti1).schedule(ti2)
    expect(dropScheduler.waiting.size).to.equal(0)
    expect(dropScheduler.running.size).to.equal(1)
    expect(ti2.isDropped).to.be.true
    await ti1._runningInstance
    expect(dropScheduler.lastResolved).to.equal(ti1)
  })

  it('(restart) cancels first call if called again while running', async () => {
    let restartPolicy = createTaskPolicy('restart', 1).policy,
        restartScheduler = createTaskScheduler(restartPolicy, true),
        slowTi = createTaskInstance(function * () {
          return yield pause(1000)
        })
    restartScheduler.schedule(slowTi).schedule(ti1)
    expect(restartScheduler.waiting.size).to.equal(1)
    expect(restartScheduler.running.size).to.equal(1)
    await slowTi._runningInstance
    await ti1._runningInstance
    expect(restartScheduler.waiting.size).to.equal(0)
    expect(restartScheduler.running.size).to.equal(0)
    expect(ti1.isResolved).to.be.true
    expect(slowTi.isCanceled).to.be.true
  })
})
