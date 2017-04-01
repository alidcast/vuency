/* eslint-disable no-unused-expressions */
/* global describe, it, expect, beforeEach, sinon */

import Vue from 'vue'
import createTaskProperty from 'src/plugin/task-property'
import { pause } from 'src/util/async'

function * exTask() {
  yield pause(90)
  return 'passed'
}

describe('Task Property', function() {
  let vm,
      tp,
      callback

  beforeEach(() => {
    vm = new Vue()
    tp = createTaskProperty(vm, exTask).flow('enqueue')
    callback = sinon.spy()
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
    tp.abort()
    expect(scheduledTi1.isCanceled).to.be.true
    expect(scheduledTi2.isCanceled).to.be.true
    expect(tp.isActive).to.be.false
  })

  it('updates and resets isAborted', async () => {
    tp.run()
    tp.abort()
    expect(tp.isAborted).to.be.true
    tp.run()
    expect(tp.isAborted).to.be.false
  })

  it('cancels instance and clears queue', async () => {
    let ti = tp.run()
    ti._cancel()
    await ti._runningOperation
    expect(ti.isCanceled).to.be.true
    expect(tp.lastCanceled).to.equal(ti)
    expect(tp.isActive).to.be.false
  })

  it('accepts per instance keepAlive options', async () => {
    let infiniteTp = createTaskProperty(vm, exTask).forCall(1, { keepAlive: true }),
        ti1 = infiniteTp.run()
    await ti1._runningOperation
    expect(infiniteTp.isActive).to.be.true
  })

  it('fires onFinish subscription even if task is dropped', async () => {
    let tp = createTaskProperty(vm, exTask)
            .flow('drop')
            .onFinish(() => {
              callback()
            }),
        ti1 = tp.run(),
        ti2 = tp.run()
    ti2.cancel()
    await ti1._runningOperation
    expect(ti2.isDropped).to.be.true
    expect(ti1.hasStarted).to.be.true
    expect(callback.called).to.be.true
  })

  it('finalizes waiting tasks', async () => {
    let tp = createTaskProperty(vm, exTask)
              .flow('enqueue')
              .onFinish(() => {
                callback()
              }),
        ti1 = tp.run()
    tp.run()
    tp.run()
    tp.abort()
    await ti1._runningOperation
    expect(callback.calledThrice).to.be.true
  })

  it('event listener runs task and updates data', (done) => {
    createTaskProperty(vm, function * myTask() {
      callback()
    }).runOn('runTask')

    vm.$emit('runTask')
    Vue.nextTick(() => {
      expect(callback.called).to.be.true
      done()
    })
  })

  it('watcher runs instance and updates task data', (done) => {
    let watcherVm = new Vue({
      data: () => ({
        changed: false
      })
    })

    createTaskProperty(watcherVm, function * myTask() {
      callback()
    }).runWith('changed')

    watcherVm.changed = true
    // watcher takes longer to run for some reason so we wait for
    // two ticks to finish before checking assertions
    Vue.nextTick(() => {
      Vue.nextTick(() => {
        expect(callback.called).to.be.true
        done()
      })
    })
  })
})
