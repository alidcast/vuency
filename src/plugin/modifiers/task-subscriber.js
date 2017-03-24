/**
*  The {TaskSubscriber} is responsbile for delegating each
*  callback, or subscriptions, so that it can be called in the
*  appropriate context.
*
*  @this the {TaskProperty} where the subscriber is destructured
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
    subscriptions: {
      beforeStart(fn) {
        startFn = fn.bind(this)
        return this
      },
      beforeNext(fn) {
        nextFn = fn.bind(this)
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
