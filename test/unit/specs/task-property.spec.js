/* eslint-disable no-unused-expressions */
/* global describe, it, expect, beforeEach */

import Vue from 'vue'
import createTaskProperty from 'src/plugin/task-property'
import createTaskModifier from 'src/plugin/task-modifiers'

function * exTask() {
  return 'passed'
}

describe('Task Property', function() {
  let tp,
      host = new Vue(),
      policy = createTaskModifier('enqueue', 2).policy

  beforeEach(() => {
    tp = createTaskProperty(host, exTask, policy)
  })

  it('has correct states', () => {
    expect(tp.isActive).to.be.false
    expect(tp.isIdle).to.be.true
  })

  it('has correct actions', () => {
    expect(tp.run).to.not.be.undefined
    expect(tp.abort).to.not.be.undefined
  })

  it('returns task instance when operation is run', async () => {
    let runningTi = await tp.run()
    expect(runningTi.state).to.not.be.undefined
  })
})
