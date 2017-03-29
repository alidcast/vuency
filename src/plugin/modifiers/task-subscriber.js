/**
*  The {TaskSubscriber} is responsbile for delegating each
*  "subscriptions", or callbacks, so that they can be called in the
*  appropriate context.
*
*  @this the {TaskProperty} where the subscriptions are destructured
*  @note
*  - We pass the taskInstance as the first parameter to all subscription
*    callbacks. It can be used directly, `(instance) => ..` or
*    destructured `{ selfCanceled }`.
*  - The caveat is that if using a task instance's methods that relies on its
*    own `this` context, such as the `cancel` method, then it cannot be
*    destructured and must be called as `instance.cancel()`, because `this`
*    is always the object that the method is called on. (Another option would
*    be to call it via the task property e.g. `this.task.lastCalled.cancel()`.)
*
*
*  @constructs TaskSubscriber
*/
export default function createTaskSubscriber(host) {
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
      if (startFn) await Reflect.apply(startFn, host, taskInstance)
    },
    async asyncBeforeYield(taskInstance) {
      if (yieldFn) await Reflect.apply(yieldFn, host, taskInstance)
    },
    /**
     * `On` actions.
     */
    onCancel(taskInstance) {
      if (cancelFn) Reflect.apply(cancelFn, host, taskInstance)
    },
    onDrop(taskInstance) {
      if (dropFn) Reflect.apply(dropFn, host, taskInstance)
    },
    onRestart(taskInstance) {
      if (restartFn) Reflect.apply(restartFn, host, taskInstance)
    },
    onError(taskInstance) {
      if (errorFn) Reflect.apply(errorFn, host, taskInstance)
    },
    onSuccess(taskInstance) {
      if (successFn) Reflect.apply(successFn, host, taskInstance)
    },
    /**
     * `After` actions.
     */
    afterEnd(taskInstance) {
      if (endFn) Reflect.apply(endFn, taskInstance, taskInstance)
    },

    subscriptions: {
      beforeStart(fn) {
        startFn = fn
        return this
      },
      beforeYield(fn) {
        yieldFn = fn
        return this
      },
      onCancel(fn) {
        cancelFn = fn
        return this
      },
      onDrop(fn) {
        dropFn = fn
        return this
      },
      onRestart(fn) {
        restartFn = fn
        return this
      },
      onError(fn) {
        errorFn = fn
        return this
      },
      onSuccess(fn) {
        successFn = fn
        return this
      },
      afterEnd(fn) {
        endFn = fn
        return this
      }
    }
  }
}
