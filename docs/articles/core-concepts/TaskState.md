<script>
import StateInteractions from '~components/tasks/StateInteractions.vue'

export default {
  components: {
    StateInteractions
  }
}
</script>

# Handling UI Interactions

You'll often need to know the state of an ongoing operation so that you can update UI accordingly. For example, you might need to display a loading spinner when an operation is running, or to disable a button when its operation is already active. Vuency exposes as much derived state as possible so that it's easy to handle everyday, front-end logic.

## Checking a task's state

There are two ways to check the state of a task:

1. You can check whether any operations are running via `task.isActive` (or `task.isIdle`).
2. You can check whether a single instance is running via `taskInstance.isRunning` (or `taskInstance.isFinished`).

### Should you check the state of a task or a task instance?

The approach the you choose depends on complexity of operation and the efficiency that is needed. Most of the time it'll be sufficient to check if the task is running. However, when you find you need more granular control, then it might be necessary to check the state of each task instance individually.

### How can I pause the execution of a task?

You can use the `timeout` helper injected into the `tasks` property.

The benefit of using this helper is that the timeout is cancelable, which ensures minimal latency in UI interactions

With generator functions, if the task finishes early, the timeout is automatically canceled for you. So the code below is all you need:

```js
tasks(t, { timeout }) {
  return t(function * genTask() {
    yield timeout(1000)
  })
}
```

<p class="warning">
  If you choose to use async functions and wish to end a timeout early, you have to cancel it yourself with <code> timeout.cancel() </code>.
</p>

## UI Interactions Demo

Here's a simple example of how you can use these states to handle UI interactions. Notice how each button changes based on the task's derived state.

<div>
  <StateInteractions />
</div>

### Template

```html
<div class="ui-interactions">
  <button @click="loader.run()">
    {{ loader.isActive ? 'Loading...' : 'Run' }}
  </button>

  <button :class="{'isDisabled': loader.isIdle }"
    @click="loader.abort()">
    Cancel
  </button>
</div>
```

### Javascript

```js
export default {
  tasks: (t, { timeout }) => ({
    loader: t(function* () {
      yield timeout(1500)
    })
    // don't allow repeat calls to interrupt ongoing loading
    .flow('drop')
  })
}
```

### Styles

```css
.isDisabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: default;
}
```
