/**
*  The {TaskSubscriber} is responsbile for delegating each
*  "subscriptions", or callbacks, so that they can be called in the
*  appropriate context.
*
*  @constructs TaskSubscriber
*/
export default function createTaskSubscriber() {
  let startFn,
      yieldFn,
      cancelFn,
      dropFn,
      restartFn,
      errorFn,
      successFn,
      endFn

  return {
    /**
     * `Before` actions.
     *
     * These operations are async so that they can be use to timeout logic
     *  (e.g. the `pause` helper) to better update UI state.
     */
    async asyncBeforeStart(taskInstance) {
      if (startFn) await startFn(taskInstance)
    },
    async asyncBeforeYield(taskInstance) {
      if (yieldFn) await yieldFn(taskInstance)
    },
    /**
     * `On` actions.
     */
    onCancel(taskInstance) {
      if (cancelFn) cancelFn(taskInstance)
    },
    onDrop(taskInstance) {
      if (dropFn) dropFn(taskInstance)
    },
    onRestart(taskInstance) {
      if (restartFn) restartFn(taskInstance)
    },
    onError(taskInstance) {
      if (errorFn) errorFn(taskInstance)
    },
    onSuccess(taskInstance) {
      if (successFn) successFn(taskInstance)
    },
    /**
     * `After` actions.
     */
    afterEnd(taskInstance) {
      if (endFn) endFn(taskInstance)
    },

    /**
     * @this the {TaskProperty} where the subscriptions are destructured
     */
    subscriptions: {
      beforeStart(fn) {
        startFn = fn.bind(this)
        return this
      },
      beforeYield(fn) {
        yieldFn = fn.bind(this)
        return this
      },
      onCancel(fn) {
        cancelFn = fn.bind(this)
        return this
      },
      onDrop(fn) {
        dropFn = fn.bind(this)
        return this
      },
      onRestart(fn) {
        restartFn = fn.bind(this)
        return this
      },
      onError(fn) {
        errorFn = fn.bind(this)
        return this
      },
      onSuccess(fn) {
        successFn = fn.bind(this)
        return this
      },
      afterEnd(fn) {
        endFn = fn.bind(this)
        return this
      }
    }
  }
}
