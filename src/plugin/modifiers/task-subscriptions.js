import assert, { isGen } from '../../util/assert'

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
      errorFn,
      successFn,
      finishFn,
      destroyFn

  return {
    /**
     * `Before` instance callbacks.
     *
     * These operations are async so that they can be use to timeout logic
     *  (e.g. the `pause` helper) to better update UI state.
     */
    async asyncBeforeStart(taskInstance) {
      if (startFn) await Reflect.apply(startFn, host, [taskInstance])
    },
    async asyncBeforeYield(taskInstance) {
      assert(isGen(taskInstance._operation), 'Only generator operations have the `beforeYield` callback')
      if (yieldFn) await Reflect.apply(yieldFn, host, [taskInstance])
    },
    /**
     * `On` instance callbacks.
     */
    onCancel(taskInstance) {
      if (cancelFn) Reflect.apply(cancelFn, host, [taskInstance])
    },
    onError(taskInstance) {
      if (errorFn) Reflect.apply(errorFn, host, [taskInstance])
    },
    onSuccess(taskInstance) {
      if (successFn) Reflect.apply(successFn, host, [taskInstance])
    },
    onFinish(taskInstance) {
      if (finishFn) Reflect.apply(finishFn, host, [taskInstance])
    },
    /**
     * `On` property callbacks.
     */
    onDestroy(taskInstance) {
      if (destroyFn) Reflect.apply(destroyFn, host, [taskInstance])
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
      onError(fn) {
        errorFn = fn
        return this
      },
      onSuccess(fn) {
        successFn = fn
        return this
      },
      onFinish(fn) {
        finishFn = fn
        return this
      },
      onDestroy(fn) {
        destroyFn = fn
        return this
      }
    }
  }
}
