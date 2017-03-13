/* eslint-disable no-unused-expressions */
/* global describe, it, expect, beforeEach, sinon */

import createTaskScheduler from 'src/plugin/task-scheduler'
import createTaskInstance from 'src/plugin/task-instance'
import createTaskModifier from 'src/plugin/task-modifiers'

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
      policy = createTaskModifier('enqueue', 2).policy

  beforeEach(() => {
    scheduler = createTaskScheduler(policy, false)
    autoScheduler = createTaskScheduler(policy, true)
    ti1 = createTaskInstance(exTask, function() {})
    ti2 = createTaskInstance(exTask, function() {})
    ti3 = createTaskInstance(exTask, function() {})
    ti4 = createTaskInstance(rejectedTask, function() {})
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
    await ti1._runningOperation
    expect(scheduler.running.size).to.equal(0)
  })

  it('removes multiple finished tasks from running', async () => {
    scheduler.schedule(ti1).schedule(ti2)
      .advance().advance()
    await ti1._runningOperation
    await ti2._runningOperation
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
    await ti1._runningOperation
    expect(scheduler.isActive).to.be.false
  })

  it('manually updates last', async () => {
    scheduler.schedule(ti1).advance()
    await ti1._runningOperation
    expect(scheduler.lastResolved).to.equal(ti1)
  })

  it('manually updates multiple last', async () => {
    scheduler.schedule(ti1).schedule(ti2)
      .advance().advance()
    await ti1._runningOperation
    await ti2._runningOperation
    expect(scheduler.lastResolved).to.equal(ti2)
  })

  it('manually updates last rejected', async () => {
    scheduler.schedule(ti4).advance()
    await ti4._runningOperation
    expect(scheduler.lastRejected).to.equal(ti4)
    expect(scheduler.lastResolved).to.be.null
    expect(scheduler.lastCanceled).to.be.null
  })

  it('manually updates last canceled', async () => {
    scheduler.schedule(ti1)
    ti1.cancel()
    scheduler.advance()
    await ti1._runningOperation
    expect(scheduler.lastCanceled).to.equal(ti1)
    expect(scheduler.lastResolved).to.be.null
    expect(scheduler.lastRejected).to.be.null
  })

  it('manually runs differently finished functions', async () => {
    scheduler.schedule(ti4).schedule(ti1)
      .advance().advance()
    await ti4._runningOperation
    await ti1._runningOperation
    expect(autoScheduler.waiting.size).to.equal(0)
    expect(autoScheduler.running.size).to.equal(0)
    expect(scheduler.lastRejected).to.be.equal(ti4)
    expect(scheduler.lastResolved).to.be.equal(ti1)
  })

  it('automatically runs one function', async () => {
    autoScheduler.schedule(ti1)
    await ti1._runningOperation
    expect(autoScheduler.waiting.size).to.equal(0)
    expect(autoScheduler.running.size).to.equal(0)
    expect(autoScheduler.lastResolved).to.equal(ti1)
  })

  it('automatically runs differently finished functions', async () => {
    autoScheduler.schedule(ti1).schedule(ti4)
    await ti4._runningOperation
    await ti1._runningOperation
    expect(autoScheduler.waiting.size).to.equal(0)
    expect(autoScheduler.running.size).to.equal(0)
    expect(autoScheduler.lastRejected).to.be.equal(ti4)
    expect(autoScheduler.lastResolved).to.be.equal(ti1)
  })

  it('concurrency - does not pass limit', () => {
    scheduler.schedule(ti1).schedule(ti2).schedule(ti3)
      .advance().advance().advance()
    expect(scheduler.waiting.size).to.equal(1)
    expect(scheduler.running.size).to.equal(2)
  })

  // TODO
  // add modifier tests - drop, restart
})
