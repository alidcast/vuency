/**
*  The {TaskSubscriber} is responsbile for delegating each
*  "subscriptions", or callbacks, so that they can be called in the
*  appropriate context.
*
*  @constructs TaskSubscriber
*/
export default function createTaskSubscriber() {
  let startFn,
      nextFn,
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
    async asyncBeforeStart() {
      if (startFn) await startFn()
    },
    async asyncBeforeNext() {
      if (nextFn) await nextFn()
    },
    /**
     * `On` actions.
     */
    onCancel() {
      if (cancelFn) cancelFn()
    },
    onDrop() {
      if (dropFn) dropFn()
    },
    onRestart() {
      if (restartFn) restartFn()
    },
    onError() {
      if (errorFn) errorFn()
    },
    onSuccess() {
      if (successFn) successFn()
    },
    /**
     * `After` actions.
     */
    afterEnd() {
      if (endFn) endFn()
    },

    /**
     * @this the {TaskProperty} where the subscriptions are destructured
     */
    subscriptions: {
      beforeStart(fn) {
        startFn = fn.bind(this, this)
        return this
      },
      beforeNext(fn) {
        nextFn = fn.bind(this, this)
        return this
      },
      onCancel(fn) {
        cancelFn = fn.bind(this, this)
        return this
      },
      onDrop(fn) {
        dropFn = fn.bind(this, this)
        return this
      },
      onRestart(fn) {
        restartFn = fn.bind(this, this)
        return this
      },
      onError(fn) {
        errorFn = fn.bind(this, this)
        return this
      },
      onSuccess(fn) {
        successFn = fn.bind(this, this)
        return this
      },
      afterEnd(fn) {
        endFn = fn.bind(this, this)
        return this
      }
    }
  }
}
