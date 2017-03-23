/**
*  Configures component instance observers for main task actions.
*
*  @constructs Task Events
*/
export default function createTaskObservers(host, task) {
  return {
    /**
     * Event listeners.
     * (All events are triggered by `host.$emit`.)
     */
    runOn(vmEvent) {
      host.$on(vmEvent, task.run.bind(task))
      return this
    },
    abortOn(vmEvent) {
      host.$on(vmEvent, task.abort.bind(task))
      return this
    },
    /**
     * Watchers.
     */
    runIf(vmData, opts = {}) {
      host.$watch(vmData, task.run.bind(task), opts)
      return this
    },
    abortIf(vmData, opts = {}) {
      host.$watch(vmData, task.abort.bind(task), opts)
      return this
    }
  }
}
