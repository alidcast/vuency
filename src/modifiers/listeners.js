/**
*  Task {Listeners} are wrappers for Vue events and watchers.
*
*  @notes
*  - Methods called via listener modifiers cannot be run with any arguments,
*    since the second paramter for each listener is an options object.
*
*  @constructs Task Listeners
*/
export default function createListeners (host) {
  /**
   * @this the {Task} property where the listeners are destructured.
   */
  return {
    /**
     * Event Listeners.
     */
    runOn (vmEvent, opts) {
      host.$on(vmEvent, this.run.bind(this), opts)
      return this
    },
    abortOn (vmEvent, callback) {
      host.$on(vmEvent, this.abort.bind(this))
      callback()
      return this
    },
    /**
     * Change Listeners (Watchers).
     */
    runWith (vmData, opts) {
      host.$watch(vmData, this.run.bind(this), opts)
      return this
    },
    abortWith (vmData, callback) {
      host.$watch(vmData, this.run.bind(this))
      callback()
      return this
    }
  }
}
