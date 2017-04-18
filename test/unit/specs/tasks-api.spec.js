/* eslint-disable no-unused-expressions */
/* global describe, it, expect */

import Vue from 'vue'
import Vuency from 'index'
import { isObj } from 'src/util'

Vue.use(Vuency)

function * testFn () { return 'passed' }

describe('Tasks API', function () {
  it('only accepts a function', () => {
    Vue.config.errorHandler = function (err, vm, info) {
      throw new Error(err)
    }

    const tasksObj = () => new Vue({
      tasks (t) { return { test: t(testFn) } }
    })

    const tasksFn = () => new Vue({
      tasks: (t) => t(testFn)
    })

    const tasksList = () => new Vue({
      tasks: [testFn]
    })

    expect(tasksObj).to.not.throw(Error)
    expect(tasksFn).to.not.throw(Error)
    expect(tasksList).to.throw(Error)
  })

  it('exposes each registered function as a task object', () => {
    const vm = new Vue({
      tasks: (t) => ({
        test1: t(testFn),
        test2: t(testFn)
      })
    })
    expect(isObj(vm.test1)).to.be.true
    expect(isObj(vm.test2)).to.be.true
  })
})
