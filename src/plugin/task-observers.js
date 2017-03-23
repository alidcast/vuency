/**
*  Configures component instance observers for main task actions.
*  @this for each function is the task property
*  @constructs Task Events
*/
export default function createTaskObservers(host) {
  return {
    /**
     * Event listeners.
     * (All events are triggered by `host.$emit`.)
     */
    runOn(vmEvent, ...args) {
      host.$on(vmEvent, this.run.bind(this, ...args))
      return this
    },
    abortOn(vmEvent) {
      host.$on(vmEvent, this.abort.bind(this))
      return this
    },
    /**
     * Watchers.
     */
    runWhen(vmData, ...args) {
      host.$watch(vmData, this.run.bind(this, ...args))
      return this
    },
    abortWhen(vmData) {
      host.$watch(vmData, this.abort.bind(this))
      return this
    }
  }
}
