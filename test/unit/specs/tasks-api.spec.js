/* eslint-disable no-unused-expressions */
/* global describe, it, expect, sinon */

import Vue from 'vue'
import Vuency from 'index'
import { isObj } from 'src/util/assert'

Vue.use(Vuency)

function * test() {
  return 'passed'
}

describe('Tasks API', function() {
  it('only accepts a function', () => {
    Vue.config.errorHandler = function(err, vm, info) {
      throw new Error(err)
    }

    let tasksObjSet = () => new Vue({
          tasks(t) {
            return {
              test: t(test)
            }
          }
        }),
        tasksSingleFn = () => new Vue({
          tasks: (t) => t(test)
        }),
        tasksArr = () => new Vue({
          tasks: [test]
        })
    expect(tasksObjSet).to.not.throw(Error)
    expect(tasksSingleFn).to.not.throw(Error)
    expect(tasksArr).to.throw(Error)
  })

  it('exposes each registered function as a task object', () => {
    let vm = new Vue({
      tasks: (t) => ({
        ex1: t(test),
        ex2: t(test)
      })
    })
    expect(isObj(vm.ex1)).to.be.true
    expect(isObj(vm.ex2)).to.be.true
  })


  it('even listener runs task and updates data', (done) => {
    let callback = sinon.spy(),
        vm = new Vue({
          tasks(t) {
            return t(function * myTask() {
              callback()
            }).runOn('runTask')
          }
        })

    vm.$emit('runTask')
    Vue.nextTick(() => {
      expect(callback.called).to.be.true
      expect(vm.myTask.last.called).to.not.be.undefined
      done()
    })
  })

  it('watcher runs instance and updates task data', (done) => {
    let callback = sinon.spy(),
        vm = new Vue({
          data: ({
            changed: false
          }),
          tasks(t) {
            return t(function * myTask() {
              callback()
            }).runWhen('changed')
          }
        })
    vm.changed = true
    Vue.nextTick(() => {
      expect(callback.called).to.be.true
      expect(vm.myTask.last).to.not.be.undefined
      done()
    })
  })
})
