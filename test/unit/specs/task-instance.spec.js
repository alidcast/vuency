/* eslint-disable no-unused-expressions */
/* global describe, it, expect, beforeEach */

import createTaskInstance from 'src/plugin/task-instance'
import createTaskSubscriber from 'src/plugin/modifiers/task-subscriber'

function * exTask() {
  return 'passed'
}

describe('Task Instance', function() {
  let ti,
      { ...subscriber } = createTaskSubscriber()

  beforeEach(() => {
    ti = createTaskInstance(exTask, subscriber)
  })

  it('has correct props', () => {
    // results
    expect(ti.value).to.be.null
    expect(ti.error).to.be.null
    // states
    expect(ti.hasStarted).to.be.false
    expect(ti.isCanceled).to.be.false
    expect(ti.isRejected).to.be.false
    expect(ti.isResolved).to.be.false
    // computed states
    expect(ti.isDropped).to.not.be.undefined
    expect(ti.isRestarted).to.not.be.undefined
    expect(ti.isRunning).to.not.be.undefined
    expect(ti.isOver).to.not.be.undefined
    expect(ti.state).to.not.be.undefined
  })

  it('has correct stepper methods for scheduler to use', () => {
    expect(ti._start).to.not.be.undefined
    expect(ti.cancel).to.not.be.undefined
  })

  it('updates computed isRunning correctly', () => {
    ti.hasStarted = true
    ti._setComputedProps()
    expect(ti.isRunning).to.be.true
    ti.isResolved = true
    ti._setComputedProps()
    expect(ti.isRunning).to.be.false
  })

  it('updates computed isDropped correctly', () => {
    ti.isCanceled = true
    ti._setComputedProps()
    expect(ti.isDropped).to.be.true
    ti.hasStarted = true
    ti._setComputedProps()
    expect(ti.isDropped).to.be.false
  })

  it('updates computed isRestarted correctly', () => {
    ti.isCanceled = true
    ti._setComputedProps()
    expect(ti.isRestarted).to.be.false
    ti.hasStarted = true
    ti._setComputedProps()
    expect(ti.isRestarted).to.be.true
  })

  it('updates computed isOver correctly', () => {
    ti.isResolved = true
    ti._setComputedProps()
    expect(ti.isOver).to.be.true
    ti.isResolved = false
    ti.isCanceled = true
    ti._setComputedProps()
    expect(ti.isOver).to.be.true
    ti.isCanceled = false
    ti.isRejected = true
    ti._setComputedProps()
    expect(ti.isOver).to.be.true
  })

  it('differentiates between self cancelation', () => {
    ti._cancel()
    expect(ti.selfCanceled).to.be.false
    ti.cancel()
    expect(ti.selfCanceled).to.be.true
  })
})
