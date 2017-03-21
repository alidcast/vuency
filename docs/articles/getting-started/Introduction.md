# Introduction

> Vuency brings you structured concurrency by giving you complete control and transparency over the execution of tasks.

Structured concurrency

## What is Vuency?


## What's a "Task"?

At the center of every Vuency application is a `Task`. A `Task` is a asynchronous, transparent, and controllable operation.
(gives you the task primitive)

By transparent, we mean that the task has exposes information about its state.
By controllable, we mean that the task is cancellable.

Think of a `task` as a more powerful alternative to Vue's built in `method`. Sometimes all you need is for a function to handle simple logic; in that case, use a method. But what if you need to check the state of the function as you wait for a promise to resolve? Or what if you need to cancel an operation, or control the flow of repeat requests? In those cases and others, use a `task` and let Vuency do the heavy lifting for you.

Preventing concurrency
- no need to manually set flags to track beginning and end of an operation

Structured concurrency
- simple rules and constraints for asynchronous cycles
- subroutines should not outlive parent
- minimal boilerplate for everyday async tasks (need cancellation - otherwise how can you taper subroutine lifecycle it)

### Your First Task

## Registering a task

There are two main steps to using tasks: converting each operation into a task and registering the task so that Vuency knows to inject it into the component instance.

For this, Vuency mixes the `tasks` property into each component instance. The tasks property must be declared as function, so that Vuency can inject a fresh copy of the registered tasks into each component instance.

To create a task, Vuency exposes the task factory function, abbreviated as `t`. You can use it on each registered operation to turn it into a task object. For you're convenience, Vuency passes the the task factory function as the first argument to `tasks. Then, to "register" the task, you must return one or more of the created task objects.

<p class="danger">
  All registered tasks must be named, either as named functions or named objects.
</p>

```javascript
// TODO
// registering only one task
export default {
  Tasks(t) {
    return t(function * myTask() { // some logic })
  }
}

// registering one or more tasks
export default {
  Tasks(t) {
    return {
      myTask: t(function * () { // some logic }),
      myOtherTask: t(function * () { // some logic })
    }
  }
}
```

Vuency then iterates through the list of returned task objects and injects them into the component instance.
