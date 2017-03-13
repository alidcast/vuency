/* eslint-disable no-unused-expressions */
/* global describe, it, expect, beforeEach */

import createTaskInstance from 'src/plugin/task-instance'

function * exTask() {
  return 'passed'
}

describe('Task Instance', function() {
  let ti

  beforeEach(() => {
    ti = createTaskInstance(exTask)
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
    expect(ti.isRunning).to.not.be.undefined
    expect(ti.isFinished).to.not.be.undefined
    expect(ti.state).to.not.be.undefined
  })

  it('has correct stepper methods for scheduler to use', () => {
    expect(ti.start).to.not.be.undefined
    expect(ti.cancel).to.not.be.undefined
  })

  it('updates computed isRunning correctly', async () => {
    ti.hasStarted = true
    expect(ti.isRunning).to.be.true
    ti.isResolved = true
    expect(ti.isRunning).to.be.false
  })

  it('updates computed isDropped correctly', async () => {
    ti.isCanceled = true
    expect(ti.isDropped).to.be.true
    ti.hasStarted = true
    expect(ti.isDropped).to.be.false
  })

  it('updates computed isFinished correctly', async () => {
    ti.isResolved = true
    expect(ti.isFinished).to.be.true
    ti.isResolved = false
    ti.isCanceled = true
    expect(ti.isFinished).to.be.true
    ti.isCanceled = false
    ti.isRejected = true
    expect(ti.isFinished).to.be.true
  })
})
