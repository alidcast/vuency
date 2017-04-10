<script>
import CancelationTracker from '~components/tasks/CancelationTracker'
export default {
  components: {
    CancelationTracker
  }
}
</script>

# Canceling a Task Yourself

There are two main ways that tasks are canceled: implicitly (based on how the task is configured, or because the task's host object was destroyed) or explicitly (by calling one of the cancel methods on the task property or task instance).

In most cases, you'll want to configure your tasks (via the task's [flow modifier](/guide/task-flow)) such that are automatically and implicitly canceled at the right time. But there are still cases where you'll need to manually cancel the task yourself.

## Self Cancelation

There are three ways to self cancel a task:

1. Call `task.abort()` to cancel all task instances.
2. Call `task[lastCalled/lastStarted].cancel()` to cancel the most recent instance.
3. Get each individual instance and call `taskInstance.cancel()` on it.

Sometimes you'll also need to differentiate between instances that you canceled versus those that were canceled due to flow control policies. For this, you can check the `selfCanceled` property of each instance, which will only be true if the instance was canceled manually.

For example:

```js
task.flow('drop', { maxRunning: 1 })

let instance1 = task.run(),
    instance2 = task.run()

instance2.isCanceled   // true
instance2.selfCanceled // false, canceled because of 'drop' policy

instance1.cancel()    
instance1.isCanceled   // true
instance1.selfCanceled // true, manually canceled
```

## Task Cancelation Demo

Here's a demo that shows that differences between all these approaches and how they all work together:

<div class="showcase">
  <CancelationTracker />
</div>

### Template

```html
<div>
  <div class="task-controls">
    <button @click="taskTracker.run(runCount)">
      Run Task
    </button>
    <!-- Option 1: Cancel All Task Instances -->
    <button
      :class="[taskTracker.isActive ? 'isActive' : 'isDisabled' ]"
      @click="taskTracker.abort()">
      Cancel All
    </button>
    <!-- Option 2: Cancel Last Instance -->
    <button
      :class="[taskTracker.lastStarted && taskTracker.lastStarted.isRunning ? 'isActive' : 'isDisabled' ]"
      @click="taskTracker.lastStarted.cancel()">
      Cancel Last
    </button>
    <!-- Option 3: Cancel Individual Task Instance -->
    <button
      v-if="taskTracker.isActive" v-for="(instance, index) in instances"
      @click="instance.cancel()">
        Task {{ index + 1 }}
    </button>
  </div>

  <div class="task-data">
    <h3>Running: {{ runCount }}</h3>
    <h3>Canceled: {{ cancelCount }}</h3>
    <h3>Self Canceled: {{ selfCancelCount }}</h3>
  </div>
</div>
```

### Javascript

```js
export default {
  data: () => ({
    runCount: 0,
    cancelCount: 0,
    selfCancelCount: 0,
    instances: []
  }),
  tasks: (t, { timeout }) => ({
    taskTracker: t(function * (count) {
      try {
        this.runCount++
        yield timeout(400)
      } finally {
        this.runCount--
      }
    })
    // Only two instances are allowed to run simultaneously, all others are dropped.
    .flow('drop', { maxRunning: 2 })
    // Add each task instance to array so we can keep track of them.
    .beforeStart(function (instance) {
      let index = instance.params[0]
      this.instances[index] = instance
    })
    // Cleanup after instance and emit cancel event if necessary.
    .onFinish(function (instance) {
      let index = instance.params[0]
      this.instances.splice(index, 1)
      // Emit cancel event with `selfCanceled` param so we can keep track
      // of self versus scheduler cancelation.
      if (instance.isCanceled) this.$emit('wasCanceled', instance.selfCanceled)
    }),

    cancelTracker: t(function * (selfCanceled) {
      this.cancelCount++
      if (selfCanceled) this.selfCancelCount++
    })
    // When a task instance is canceled, update cancel count.
    .runOn('taskWasCanceled')
  })
}
```
