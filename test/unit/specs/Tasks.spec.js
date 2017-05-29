/* eslint-disable no-unused-expressions */
/* global describe, it, expect, beforeEach, sinon */

import Vue from 'vue'
import Vuency from 'src/index'
import { isObj } from 'src/util'

Vue.use(Vuency)

describe('Tasks API', function () {
  function * exTask () { return yield 'success' }

  it('only accepts a function', () => {
    Vue.config.errorHandler = function (err, vm, info) {
      throw new Error(err)
    }

    const tasksObj = () => new Vue({
      tasks (t) { return { test: t(exTask) } }
    })

    const tasksFn = () => new Vue({
      tasks: (t) => t(exTask)
    })

    const tasksList = () => new Vue({
      tasks: [exTask]
    })

    expect(tasksObj).to.not.throw(Error)
    expect(tasksFn).to.not.throw(Error)
    expect(tasksList).to.throw(Error)
  })

  it('exposes each registered function as a task object', () => {
    const vm = new Vue({
      tasks: (t) => ({
        test1: t(exTask),
        test2: t(exTask)
      })
    })
    expect(isObj(vm.test1)).to.be.true
    expect(isObj(vm.test2)).to.be.true
  })
})

describe('Tasks Property', function () {
  var vm,
      callback

  function * exTask () {
    yield callback()
    return 'success'
  }

  beforeEach(() => {
    vm = new Vue({
      data: () => ({ changed: false }),
      tasks: (t) => t(exTask).flow('enqueue')
    })
    callback = sinon.spy()
  })

  it('has correct data', () => {
    // states
    expect(vm.exTask.isActive).to.be.false
    expect(vm.exTask.isIdle).to.be.true
    // last
    expect(vm.exTask.lastCalled).to.not.be.undefined
    expect(vm.exTask.lastStarted).to.not.be.undefined
    expect(vm.exTask.lastResolved).to.not.be.undefined
    expect(vm.exTask.lastRejected).to.not.be.undefined
    expect(vm.exTask.lastCanceled).to.not.be.undefined
    // actions
    expect(vm.exTask.run).to.not.be.undefined
    expect(vm.exTask.abort).to.not.be.undefined
  })

  it('runs and aborts task', () => {
    const ti = vm.exTask.run()
    vm.exTask.abort()
    expect(vm.exTask.lastCalled).to.equal(ti)
    expect(ti.isDropped).to.be.true
  })

  it('runs and cancels instances', async() => {
    const ti1 = vm.exTask.run()
    const ti2 = vm.exTask.run()
    ti2.cancel()
    await ti1._runningOperation
    expect(ti1.isResolved).to.be.true
    expect(ti2.isCanceled).to.be.true
    expect(vm.exTask.lastResolved).to.equal(ti1)
  })

  /**
   * Listener Tests.
   */

  it('listens to events and updates data', (done) => {
    vm.exTask.runOn('runTask')
    vm.$emit('runTask')
    expect(vm.exTask.isActive).to.be.true
    Vue.nextTick(() => {
      expect(callback.called).to.be.true
      expect(vm.exTask.isActive).to.be.false
      done()
    })
  })

  it('listens to changes and updates data', (done) => {
    vm.exTask.runWith('changed')
    vm.changed = true
    // watcher takes longer to run for some reason so we wait for
    // two ticks to finish before checking assertions
    Vue.nextTick(() => {
      expect(vm.exTask.isActive).to.be.true
      Vue.nextTick(() => {
        expect(callback.called).to.be.true
        expect(vm.exTask.isActive).to.be.false
        done()
      })
    })
  })
})
