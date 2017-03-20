/**
*  Configures component instance event listeners for main task actions.
*  (All events are triggered by `host.$emit`.)
*  @constructs Task Events
*/
export default function createTaskListeners(host, task) {
  return {
    runOn(vmEvent) {
      host.$on(vmEvent, task.run.bind(task))
      return this
    },

    abortOn(vmEvent) {
      host.$on(vmEvent, task.abort.bind(task))
      return this
    }
  }
}
