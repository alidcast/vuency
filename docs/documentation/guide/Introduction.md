## Introduction

Vuency is a concurrency management library for Vuejs. It gives you complete control and transparency over the execution of tasks.

### What's a task?

A `Task` is a asynchronous, transparent, and controllable operation.

Think of a `task` as a more powerful alternative to a method. Sometimes all you need is for a function to handle simple logic; in that case, use a method. But what if you need to check the state of the function as you wait for a promise to resolve? Or what if you need to cancel an operation, or control the flow of repeat requests? In those cases and others, use a `task` and let Vuency do the heavy lifting for you.


### Registering a task

In any Vue component instance, you can register your task(s) under the `Tasks` property, which is an array that accepts a list of [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*).

```javascript
export default {
  Tasks: [
    function* myTask() {
      // some logic
    }
  ]
}
```

Vuency iterates through the list of functions and converts each one into a `Task` object that's injected into the component instance.

<p class="warning">
  All registered functions must be named, as the name of each function servers as the identifier for each task object.
</p>

### Using a task property

Since any registered task is automatically injected into the component instance, you can just reference it by its name, e.g. `this.myTask`, to use it's properties.

Each task has the following properties:  

* `state`, a string the describes the general state of the task. There are two possible values: `active` or `idle`.

* `isActive`, a boolean that represents whether any tasks are running or scheduled to run.

* `isIdle`, a boolean that represents the opposite of `isRunning`.

* `run`, a function that either start the task or schedules it to run when the concurrency frees up.  

* `cancelAll`, a function that cancels all scheduled and currently active task instances.

<p class="warning">
  You can't call a task like a regular function, e.g. <code>myTask()</code>, because a task is exposed as an object. To use a task you call its properties, such as <code>myTask.run()</code> or <code>myTask.cancelAll()</code>.
</p>

An example basic usage:

``` html

<div>
  <button @click="myTask.run()"></button>  
  <p>{{ this.myTask.isActive 'I'm active' : 'I'm idle' }}</p>
</div>

```

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

``` javascript

export default {
  created() {
    let taskInstance = this.myTask.run()
    taskInstance.cancel()
  }
  ...
}
```
