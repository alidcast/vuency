
### Using a task instance

Each time you call `.run` method on a task, a task instance is created and returned.

Each task instance has the following properties:

* `value`, the value returned by a successfully completed task.

* `error`, the value returned by an unsuccessfully completed task.

* `state`, a string the describes the general state of the task. There are four possible values: `dropped`, `running`, `canceled`, and `finished`.

* `isDropped`, a boolean that represents whether the task instance was canceled before it could start.

* `isCanceled`, a boolean that represents whether the task instance's operation was canceled.

* `isResolved`, a boolean that represents whether the task instance's operation succesfully ran to completion.

* `isRejected`, a boolean that represents whether the task instance's operation was rejected before it could run to completion.

* `isRunning`, a boolean that represents whether the task instance's operation is still running.

* `isOver`, a boolean that represents whether the task instance's operation is over regardless of whether it was started or not.

* `cancel`, a function that cancels the task instance's operation if it is still running.

Example usage:

```js

export default {
  created() {
    let taskInstance = this.myTask.run()
    taskInstance.cancel()
  }
  ...
}
```
