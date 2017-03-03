// import createTaskInstance from './task-instance'
// import createTaskScheduler from './task-scheduler'
// import createTaskStepper from './task-stepper'

export default function createTaskProperty(host, operation) {
  // let scheduler = createTaskScheduler()

  return {
    // states: {
    //   get concurrency() {
    //     return scheduler.concurrency
    //   },
    //
    //   get isActive() {
    //     return scheduler.isActive
    //   },
    //
    //   get isIdle() {
    //     return !this.isActive
    //   },
    //
    //   get state() {
    //     if (this.isActive) return 'active'
    //     else return 'idle'
    //   }
    // },

    actions: {
      /**
       * Creates a new task instance and schedules it to run.
       */
      async run(...args) {
        // operation = operation.bind(host, ...args) // bind comp `this` context
        // let taskInstance = createTaskInstance(),
        //     updateSchedule = scheduler.update.bind(scheduler),
        //     stepper = createTaskStepper(taskInstance, updateSchedule)
        //
        // // add the necessary stepper methods to task instance so that
        // // the scheduler can control the running of the task
        // taskInstance._start = stepper.stepThrough.bind(stepper, operation)
        // taskInstance._cancel = stepper.handleCancel.bind(stepper)
        // scheduler.schedule(taskInstance)

        // return taskInstance
      },

      /**
       * Cancels all active task instances.
       */
      abort() {

      }
    }
  }
}

//   /**
//    * A {TaskProperty}
//    * @param {Vue} host - the vue component instance
//    * @param {Function} fn - the registered task function
//    * @class TaskProperty
//    */
// export function TaskProperty(host, fn, policy) {
//   let scheduler = createScheduler(policy)
//
//   const TP = Vue.extend({
//     data: () => ({
//       waitingQueue: scheduler._waitingQueue,
//       runningQueue: scheduler._runningQueue,
//       waitingIsActive: false,
//       runningIsActive: false
//     }),
//
//     watch: {
//       waitingQueue() {
//         this.waitingIsActive = scheduler.waitingIsActive
//       },
//
//       runningQueue() {
//         this.runningIsActive = scheduler.runningIsActive
//       }
//     },
//
//     computed: {
//       // last() {
//         // let last = scheduler.lastStarted
//         // last.successful = this.scheduler.lastResolved
//         // last.errored = this.scheduler.lastRejected
//         // last.canceled = this.scheduler.lastCanceled
//         // return last
//       // },
//       //
//
//       concurrency() {
//         return scheduler.concurrency
//       },
//
//       isActive() {
//         return  this.waitingIsActive || this.runningIsActive
//       },
//
//       isIdle() {
//         return !this.isActive
//       },
//
//       state() {
//         if (this.isActive) return 'active'
//         else return 'idle'
//       }
//     },
//
//
//     methods: {
//       async run(...args) {
//         let taskFn = fn.bind(host, ...args)
//         let updateSchedule = scheduler.update.bind(scheduler)
//         let ti = createTaskInstance(taskFn, updateSchedule)
//         scheduler.schedule(ti)
//
//         // TODO
//         // find cleaner approach
//         // and deal with restarted tasks (ti._running won't be set)
//         //
//         // When `Scheduler` starts the `ti`, the running task is set
//         // as a property, which is then resolved when stepper is finished
//         // iterating through the task
//         await new Promise(function (resolve, reject) {
//           (function waitForRunningTask(){
//               if (ti._runningTask) return resolve(ti._runningTask)
//               setTimeout(waitForRunningTask, 30)
//           })()
//         })
//
//         return ti
//       }
//
//       // TODO
//       // cancelALL or dispose()
//       // add events
//       // make sure tasks are destroyed when object destroyed
//     }
//   })
//
//   return new TP
// }
