/**
*  The {TaskListener} is a wrapper for Vue event listeners and watchers,
*  responsbile reacting to events and data changes, respectively.
*
*  @this the {TaskProperty} where the subscriptions are destructured
*  @notes
*  - Since we don't have access to the task's name at this point,
*    these modifiers are called only with the task property's context
*    and do not have acess to the component context (The workaround is to use
*    the `tasks` properties component context.)
*  - Since we chose to pass configuration options as the second parameter to
*    the run listeners, the tradeoff is that the run functions cannot be
*    called with any arguments when using these modifiers. (In the cases
*    where people need to pass arguments to the operation, they should
*    just use the `watch` property directly.)
*
*  @constructs TaskSubscriber
*/
export default function createTaskListeners(host) {
  return {
    events: {
      runOn(vmEvent, opts) {
        host.$on(vmEvent, this.run.bind(this), opts)
        return this
      },
      abortOn(vmEvent, callback) {
        host.$on(vmEvent, this.abort.bind(this))
        callback()
        return this
      }
    },
    watchers: {
      runWith(vmData, opts) {
        host.$watch(vmData, this.run.bind(this), opts)
        return this
      },
      abortWith(vmData, callback) {
        host.$watch(vmData, this.run.bind(this))
        callback()
        return this
      }
    }
  }
}
