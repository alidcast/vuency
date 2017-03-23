/**
*  The {TaskSubscriber} is responsbile for delegating each
*  callback, or subscriptions, so that it can be called in the
*  appropriate context.
*
*  @this the {TaskProperty} where the subscriber is destructured
*  @constructs TaskSubscriber
*/
export default function createTaskSubscriber(host) {
  let cancelFn,
      dropFn,
      restartFn,
      errorFn,
      successFn,
      finalizeFn

  return {
    emitCancel() {
      if (cancelFn) cancelFn()
    },
    emitDrop() {
      if (dropFn) dropFn()
    },
    emitRestart() {
      if (restartFn) restartFn()
    },
    emitError() {
      if (errorFn) errorFn()
    },
    emitSuccess() {
      if (successFn) successFn()
    },
    emitFinalize() {
      if (finalizeFn) finalizeFn()
    },

    subscriptions: {
      onCancel(fn) {
        cancelFn = fn.bind(host)
        return this
      },
      onDrop(fn) {
        dropFn = fn.bind(host)
        return this
      },
      onRestart(fn) {
        restartFn = fn.bind(host)
        return this
      },
      onError(fn) {
        errorFn = fn.bind(host)
        return this
      },
      onSuccess(fn) {
        successFn = fn.bind(host)
        return this
      },
      onFinalize(fn) {
        finalizeFn = fn.bind(host)
        return this
      }
    }
  }
}
