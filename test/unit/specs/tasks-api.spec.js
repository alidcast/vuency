import Vue from 'vue'
import Vuency from 'index'
// import { createTaskInstance, createTaskProperty } from 'task'
// import createScheduler from 'scheduler'

Vue.use(Vuency)

function* test() { return 'passed' }

function createTasks(tasks) {
  return {
    tasks(t) { return Object.keys(tasks).forEach(key => t(tasks[key])) }
  }
}

describe('Tasks API', function() {
  // it("only accepts a tasks array", () => {
  //   let wrongVm = () => new Vue(createTasks({ exTask }))
  //   let correctVm = () => new Vue(createTasks([ exTask ]))
  //   expect(wrongVm).to.throw(TypeError)
  //   expect(correctVm).to.not.throw(TypeError)
  // }
  //
  // it("does not allow repeat names", () => {
  //   let vm = () => new Vue(createTasks([exTask, exTask]))
  //   expect(vm).to.throw(Error)
  // })
  //
  // it("exposes the registered function as a task", () => {
  //   let vm = new Vue(createTasks([exTask]))
  //   expect(vm.exTask).to.not.be.undefined
  // })
})
