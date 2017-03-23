/**
*  The {TaskListener} is a wrapper for Vue event listeners and watchers,
*  responsbile reacting to events and data changes, respectively.
*
*  @this the {TaskProperty} where the listeners are destructured
*  @constructs TaskSubscriber
*/
export default function createTaskListeners(host) {
  return {
    events: {
      on(vmEvent, methodName, ...args) {
        host.$on(vmEvent, this[methodName].bind(this, ...args))
        return this
      },
      runOn(vmEvent, ...args) {
        host.$on(vmEvent, this.run.bind(this, ...args))
        return this
      },
      abortOn(vmEvent, callback) {
        host.$on(vmEvent, this.abort.bind(this))
        callback()
        return this
      }
    },
    watchers: {
      watch(vmData, methodName, ...args) {
        host.$watch(vmData, this[methodName].bind(this, ...args))
        return this
      },
      runWith(vmData, ...args) {
        host.$watch(vmData, this.run.bind(this, ...args))
        return this
      },
      abortWith(vmData, callback) {
        host.$watch(vmData, this.abort.bind(this))
        callback()
        return this
      }
    }
  }
}
