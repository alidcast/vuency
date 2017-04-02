
# Using the task property

All registered tasks are automatically injected into the component instance and referenced by their name.

For example:

```js
export default {
  tasks(t) {
    return t(function* myTask() {})
  },
  created() {
    // use can use `this.myTask` here
  }
}
```
For more on task registration, see the [getting started](/getting-started) section.

## Task Data / States

### isActive

* Type: `{Boolean}`

* Details:

  Represents whether any tasks are currently running.

### isIdle

* Type: `{Boolean}`

* Details:

  Represents the opposite of `isRunning`.

### isAborted

* Type: `{Boolean}`

* Details:

  Represents whether the all task instances were canceled at once.

### state

* Type: `{String} ['active', 'idle']`

* Details:

  Describes the general state of the task.

## Task Data / Last

### lastCalled

* Type: `{Object} Task Instance`

* Details:

  The last task instance to be called.

### lastStarted

* Type: `{Object} Task Instance`

* Details:

  The last started task instance.

### lastResolved

* Type: `{Object} Task Instance`

* Details:

  The last task instance to be fully resolved.

### lastRejected

* Type: `{Object} Task Instance`

* Details:

  The last task instance to be rejected.

### lastCanceled

* Type: `{Object} Task Instance`

* Details:

  The last task instance to be canceled.

## Task Actions

### run

* Type: `function`

* Returns: `{TaskInstance}`.

* Syntax: `task.run()`

* Details:

  Creates a task instance and schedules it to run.  


### abort

* Type: `function`

* Returns: `{Array} canceled task instances`.

* Syntax: `task.abort()`

* Details:

  Cancels and destroys all scheduled and currently running task instances.

## Task Modifiers / Policies

### flow

* Type: `function`

* Arguments:
  - `{String} flow Type ['enqueue', 'restart', 'drop', 'default']`
  - `{Object} options`
    - `{Number} delay`
    - `{Number} maxRunning`

* Syntax: `task.flow('restart', { delay: 400 })`

* Details:  

  Specifies the scheduling policy.

### nthCall

* Type: `function`

* Arguments:
  - `{Number} call number`
  - `{Object} options`
    - `{Boolean} keepRunning`

* Syntax: `task.nthCall(1, { keepRunning: true })`

* Details:

  Specifies per instance bindings.

## Task Modifiers / Subscriptions

### beforeStart

* Type: `function`

* Injection: the currently running `{TaskInstance}`

* Syntax: `task.beforeStart(taskInstance => {})`

* Details:

  Callback called before a task instance's operation is started.

### beforeYield

* Type: `function`

* Syntax: `task.beforeYield(taskInstance => {})`

* Injection: the currently running `{TaskInstance}`

* Details:

  Callback called for every yield in a a task instance's  operation.

### onSuccess

* Type: `function`

* Injection: the currently running `{TaskInstance}`

* Syntax: `task.onSuccess(taskInstance => {})`

* Details:

  Callback called when a a task instance's operation is run completion.

### onError

* Type: `function`

* Injection: the currently running `{TaskInstance}`

* Syntax: `task.onError(taskInstance => {})`

* Details:

  Callback called when a a task instance's operation is rejected.

### onCancel

* Type: `function`

* Injection: the currently running `{TaskInstance}`

* Syntax: `task.onCancel(taskInstance => {})`

* Details:

  Callback called when a a task instance's operation is canceled.

### onFinish

* Type: `function`

* Injection: the currently running `{TaskInstance}`

* Syntax: `task.onFinish(taskInstance => {})`

* Details:

  Callback called when a a task instance's operation is finished, regardless of whether it was resolved, rejected, or canceled.


### onDestroy

* Type: `function`

* Injection: the currently running `{TaskInstance}`

* Syntax: `task.onDestroy(taskInstance => {})`

  Callback called when a task instance with the `keepRunning` binding is destroyed.

## Task Modifiers / Listeners

### runOn

* Type: `function`

* Arguments:
  - `{string | Array<string>} event`

* Syntax: `task.runOn('event')`

* Details

  Emit `run` action in response to custom event on the current component instance.  Events can be triggered by `vm.$emit`.

### abortOn

* Type: `function`

* Arguments:
  - `{string | Array<string>} event`

* Syntax: `task.abortOn('event')`

* Details

  Emit `abort` action in response to custom event on the current component instance.  Events can be triggered by `vm.$emit`.

### runWith

* Type: `function`

* Arguments:
  - `{string | Function} expOrFn`
  - `{Object} options`
    - `{boolean} deep`
    - `{boolean} immediate`

* Syntax: `task.runWith('exp', { immediate: true })`

* Details

  Watch an expression or a computed function on the Vue instance and call the `run` action every time it changes.

### abortWith

* Type: `function`

* Arguments:
  - `{string | Function} expOrFn`
  - `{Object} options`
    - `{boolean} deep`
    - `{boolean} immediate`

* Syntax: `task.abortWith('exp', { deep: true })`

* Details

  Watch an expression or a computed function on the Vue instance and call the `abort` action every time it changes.
