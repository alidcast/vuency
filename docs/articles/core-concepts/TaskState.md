# Handling UI Interactions

You'll often need to know the state of an ongoing operation so that you can update UI state accordingly. For example, you might need to display a loading spinner when an operation is running, or to disable a button when its operation is already active. Vuency exposes as much derived state as possible so that you don't have to set your own `isRunning` flags at the beginning and end of an operation in an attempt to handle everyday, front-end logic.

There are two ways to check the state of a task:

1. You can check whether any operations are running via `task.isActive` (or `task.isIdle`).
2. You can check whether a single instance is running via `taskInstance.isRunning` (or `taskInstance.isFinished`).

Here's a basic example that shows the difference between the two approaches:

```js
let instance1 = task.run(),
    instance2 = task.run()

instance1.isRunning // true
instance2.isRunning // true
task.isActive       // true

instance1.cancel()  
instance1.isRunning // false, it was manually canceled
instance2.isRunning // true, it's a slow operation that hasn't been canceled
task.isActive       // true, there's still one instance running

instance2.cancel()
instance2.isRunning // false, it was manually canceled
task.isActive       // false, there are no running instances
```

## Should you check the state of a task or a task instance?

The approach the you choose depends on complexity of operation and the efficiency that is needed. For example, if you're using a custom `flow` policy (such as 'drop') with `maxRunning` defaulted at 1, then it'll likely be sufficient to check if the task is running. However, if you increase the concurrency allotment or if you need more granular control, then it might be necessary to check the state of each task instance individually.

// TODO finish documentation

## UI Interactions Demo

Here's an example of how you can use these states to handle UI interactions:

```html
<div>
  <button @click="myTask.run()">
    {{ task.isActive ? 'Loading : 'Run' }}
  </button>  
</div>

<div>
  <button
    v-if="task.lastStarted && task.lastStarted.isRunning"
    @click="myTask.run()">
    Cancel Instance  
  </button>
  <button @click="myTask.run()" v-else>
    Run instance
  </button>
</div>
```

// TODO improve example and add demo
