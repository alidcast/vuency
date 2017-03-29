/* eslint-disable no-unused-expressions */
/* global describe, it, expect, beforeEach */

import Vue from 'vue'
import createTaskProperty from 'src/plugin/task-property'
import createTaskInjections from 'src/plugin/modifiers/task-injections'

function * exTask() {
  return 'passed'
}

describe('Task Property', function() {
  let tp,
      { provider } = createTaskInjections()

  beforeEach(() => {
    tp = createTaskProperty(new Vue(), exTask, provider)
    tp.flow('enqueue')
  })

  it('has correct states', () => {
    expect(tp.isActive).to.be.false
    expect(tp.isIdle).to.be.true
  })

  it('has correct last data', () => {
    expect(tp.lastCalled).to.not.be.undefined
    expect(tp.lastStarted).to.not.be.undefined
    expect(tp.lastResolved).to.not.be.undefined
    expect(tp.lastRejected).to.not.be.undefined
    expect(tp.lastCanceled).to.not.be.undefined
    expect(tp.default).to.not.be.undefined
  })

  it('has correct actions', () => {
    expect(tp.run).to.not.be.undefined
    expect(tp.abort).to.not.be.undefined
  })

  it('returns task instance when operation is run', () => {
    let scheduledTi = tp.run()
    expect(scheduledTi.state).to.not.be.undefined
  })

  it('aborts all instances and clears queue', async () => {
    let scheduledTi1 = tp.run(),
        scheduledTi2 = tp.run()
    await tp.abort()
    expect(scheduledTi1.isCanceled).to.be.true
    expect(scheduledTi2.isCanceled).to.be.true
    expect(tp.isActive).to.be.false
  })

  it('cancels instance and clears queue', async () => {
    let ti1 = tp.run()
    ti1._cancel()
    await ti1._runningOperation
    expect(ti1.isCanceled).to.be.true
    expect(tp.lastCanceled).to.equal(ti1)
    expect(tp.isActive).to.be.false
  })
})
