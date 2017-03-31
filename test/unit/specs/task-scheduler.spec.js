/* eslint-disable no-unused-expressions */
/* global describe, it, expect, beforeEach */

import Vue from 'vue'
import createTaskScheduler from 'src/plugin/task-scheduler'
import createTaskProperty from 'src/plugin/task-property'
import createTaskPolicy from 'src/plugin/modifiers/task-policy'
import { pause } from 'src/util/async'

function * exTask(error = false) {
  yield pause(90)
  if (error) {
    throw new Error()
  }
  return 'passed'
}

describe('Task Scheduler', function() {
  let policy = createTaskPolicy('enqueue', 2).policy,
      tp,
      ti1,
      ti2,
      ti3,
      ti4,
      scheduler,
      autoScheduler

  beforeEach(() => {
    tp = createTaskProperty(new Vue(), exTask, false)
    ti1 = tp.run()
    ti2 = tp.run()
    ti3 = tp.run()
    ti4 = tp.run(true)
    scheduler = createTaskScheduler(tp, policy, false)
    autoScheduler = createTaskScheduler(tp, policy, true)
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
    expect(tp.lastStarted).to.be.null
    scheduler.advance()
    expect(scheduler.waiting.size).to.equal(2)
    expect(scheduler.running.size).to.equal(1)
    expect(tp.lastStarted).to.equal(ti1)
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

  it('finalizes canceled instances', async () => {
    scheduler.schedule(ti1).advance()
    ti1._cancel()
    await ti1._runningOperation
    expect(tp.lastCanceled).to.equal(ti1)
    expect(scheduler.running.size).to.equal(0)
    expect(scheduler.running.isActive).to.be.false
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

  it('returns cleared instances', () => {
    scheduler.schedule(ti1).schedule(ti2).advance(ti3)
    let canceled = scheduler.clear()
    expect(canceled.length).to.equal(3)
  })

  it('manually updates last', async () => {
    scheduler.schedule(ti1).advance()
    await ti1._runningOperation
    expect(tp.lastResolved).to.equal(ti1)
  })

  it('manually updates multiple last', async () => {
    scheduler.schedule(ti1).schedule(ti2)
      .advance().advance()
    await ti1._runningOperation
    await ti2._runningOperation
    expect(tp.lastResolved).to.equal(ti2)
  })

  it('manually updates last rejected', async () => {
    scheduler.schedule(ti4).advance()
    await ti4._runningOperation
    expect(tp.lastRejected).to.equal(ti4)
    expect(tp.lastResolved).to.be.null
    expect(tp.lastCanceled).to.be.null
  })

  it('manually updates last canceled', async () => {
    scheduler.schedule(ti1)
    ti1._cancel()
    scheduler.advance()
    await ti1._runningOperation
    expect(tp.lastCanceled).to.equal(ti1)
    expect(tp.lastResolved).to.be.null
    expect(tp.lastRejected).to.be.null
  })

  it('manually runs differently finished functions', async () => {
    scheduler.schedule(ti1).schedule(ti2).advance().advance()
    ti2._cancel()
    await ti1._runningOperation
    expect(scheduler.waiting.size).to.equal(0)
    expect(scheduler.running.size).to.equal(0)
    expect(tp.lastCanceled).to.be.equal(ti2)
    expect(tp.lastResolved).to.be.equal(ti1)
  })

  it('manually empties out queues and cancels instances', async () => {
    scheduler.schedule(ti1).schedule(ti2).schedule(ti3).advance().clear()
    expect(scheduler.waiting.size).to.equal(0)
    expect(scheduler.running.size).to.equal(0)
    expect(ti1.isCanceled).to.be.true
    expect(ti2.isCanceled).to.be.true
    expect(ti3.isCanceled).to.be.true
  })

  it('automatically runs one function', async () => {
    autoScheduler.schedule(ti1)
    await ti1._runningOperation
    expect(autoScheduler.waiting.size).to.equal(0)
    expect(autoScheduler.running.size).to.equal(0)
    expect(tp.lastResolved).to.equal(ti1)
  })

  it('automatically runs differently finished functions', async () => {
    autoScheduler.schedule(ti1).schedule(ti2)
    ti2._cancel()
    await ti1._runningOperation
    expect(autoScheduler.waiting.size).to.equal(0)
    expect(autoScheduler.running.size).to.equal(0)
    expect(tp.lastCanceled).to.be.equal(ti2)
    expect(tp.lastResolved).to.be.equal(ti1)
  })

  it('(concurrency) does not pass running limit', () => {
    autoScheduler.schedule(ti1).schedule(ti2).schedule(ti3)
    expect(autoScheduler.waiting.size).to.equal(1)
    expect(autoScheduler.running.size).to.equal(2)
  })

  it('(default) runs all instances and updates scheduler last', async () => {
    let defaultPolicy = createTaskPolicy('default', 1).policy,
        defaultScheduler = createTaskScheduler(tp, defaultPolicy, true)
    defaultScheduler.schedule(ti1).schedule(ti2)
    expect(tp.lastStarted).to.equal(ti2)
    await ti2._runningOperation
    expect(ti1.hasStarted).to.be.true
    expect(ti2.hasStarted).to.be.true
    expect(tp.lastResolved).to.equal(ti2)
  })

  it('(drop) drops repeat calls and updates last', async () => {
    let dropPolicy = createTaskPolicy('drop', 1).policy,
        dropScheduler = createTaskScheduler(tp, dropPolicy, true)
    dropScheduler.schedule(ti1).schedule(ti2)
    await ti1._runningOperation
    await ti2._runningOperation
    expect(tp.lastResolved).to.equal(ti1)
    expect(tp.lastCanceled).to.equal(ti2)
    expect(ti2.isDropped).to.be.true
    expect(dropScheduler.isActive).to.be.false
  })

  it('(restart) restarts previous calls and updates last', async () => {
    let restartPolicy = createTaskPolicy('restart', 1).policy,
        restartScheduler = createTaskScheduler(tp, restartPolicy, true)
    restartScheduler.schedule(ti1).schedule(ti2)
    await ti1._runningOperation
    await ti2._runningOperation
    expect(tp.lastStarted).to.equal(ti2)
    expect(tp.lastCanceled).to.equal(ti1)
    expect(ti2.isResolved).to.be.true
    expect(ti1.isCanceled).to.be.true
  })
})
