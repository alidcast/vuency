
# Using a task instance

Task instances can be accessed either by storing the return value of  task's `run` method or via the task's 'last' properties.

For example:

```js
let taskInstance = task.run()

taskInstance === task.lastCalled // true 
```

## Instance Data / Bindings

### params

* Type: `{Array | Object}`

* Details:

  The arguments that were passed into the task's `run` method upon the task instance's creation are destructured and bound to the `params` property. This per instance data can be useful to access inside task's subscriptions.

* Example:

  ```js
  task.onSuccess({ params }) => {
    console.log(params[0] + 'world') // 'hello world'
  }

  task.run('hello')
  ```

### options

* Type: `{Object}`

* Details:

  Represents the task instances options that were bound via the `nthCall` method. This can be useful to access when debugging per instance data.

* Example:

  ```js
  task.nthCall(1, { keepRunning: true })

  let taskInstance = task.run()
  console.log(taskInstance.options.keepRunning) // true
  ```


## Instance Data / States

### isResolved

* Type: `{Boolean}`

* Details:

  Represents whether a task instance's operation succesfully ran to completion.

### isRejected

* Type: `{Boolean}`

* Details:

  Represents whether a task instance's operation was rejected before it could run to completion.

### isCanceled

* Type: `{Boolean}`

* Details:

  Represents whether a task instance's operation was canceled.

### isRunning

* Type: `{Boolean}`

* Details:

  Represents whether a task instance's operation is still running.

### isFinished

* Type: `{Boolean}`

* Details:

  Represents whether a task instance's operation is over regardless of whether it was started or not.

### isDropped

* Type: `{Boolean}`

* Details:

  Represents whether a task instance was canceled before it could start.

### isRestarted

* Type: `{Boolean}`

* Details:

  Represents whether a task instance was canceled after it started.

### state

* Type: `{String} ['dropped', 'running', 'canceled', 'finished']`

* Details:

  Describes the general state of the task.

## Instance Data / Results

### value

* Type: `{String}`

* Details:

  The value returned by a successfully completed task instance.

### error

* Type: `{String}`

* Details:

  The value returned by an unsuccessfully completed task instance.

## Instance Actions

### cancel

* Type: `{Function}`

* Details:

  Cancels a task instance's operation if it is still running.

### destroy

* Type: `{Function}`

* Details:

  Cancels and kills a task instance. Intended to be used on a task instance with the `keepRunning` binding.
