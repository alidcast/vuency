<script>
import ConcurrencyTimeline from '~components/tasks/ConcurrencyTimeline.vue'

export default {
  components: {
    ConcurrencyTimeline
  }
}
</script>

# Managing Task Concurrency

You'll often want to control the flow and frequency of concurrent operations. For example, you might not want to fire an ajax call until the user stops typing or you might only want to request the scroll position of a page after a certain period of time. Vuency was built for these sort of operations in mind. All tasks have a `flow` modifier that you can use to manage the flow of repeat requests.


## Task Flow

#### Default Behavior: Tasks Run Concurrently

By default, tasks run concurrently. In the demo below, notice how calling an operation multiple times during the same period of time causes the lifespan of each operation overlap.

<div class="showcase">
  <ConcurrencyTimeline flow="default" />
</div>


 Most of the time you won't want repeat calls to overlap, so you can use the `flow` modifier to specify policies and constraints for how subsequent calls should be handled.

There are three options: you can either `enqueue`, `restart`, or `drop` repeat requests.

The demos on this page, for example, run the following code:

```javascript
export default {
  tasks: (t) => ({
    defaultTask:    task(TASK_FN),
    enqueuingTask:  task(TASK_FN).flow('enqueue'),
    restartingTask: task(TASK_FN).flow('restart'),
    droppingTask:   task(TASK_FN).flow('drop')
  })
}
```
#### Enqueue

With `.flow('enqueue')`, repeat calls are enqueued and only run when the previous call finishes running.

Think of this as the "love all children equally" scheduling policy. All created instances are enqueued and thus eventually run, getting their equal share of time in existence before being removed, garbage collected, and forever forgotten.

In the demo below, notice how repeat calls do not overlap anymore, as each instance waits for any ongoing operations to resolve before starting themselves, but all of them are indeed eventually run to completion.

<div class="showcase">
  <ConcurrencyTimeline flow="enqueue" />
</div>

#### Drop

With `.flow('drop')`, repeat calls are dropped and ignored.

Think of this as the "favor the first born" scheduling policy. After the first instance, all other demands during the same period of time are dropped, garbage collected, and forever forgotten.


In the demo below, notice how once the first instance starts running, any repeat calls during the same time period are dropped and never waited on or fired.


<div class="showcase">
  <ConcurrencyTimeline flow="drop" />
</div>

#### Restart

With `flow('restart')`, repeat calls cause any ongoing operations to be canceled and a new instance is started in its favor.

Think of this as the "favor the youngest child" scheduling policy. If new instances are created during the span of time, any older ones still alive are canceled, removed, garbage collected, forever forgotten.

In the example below, notice how if you try to run another task instance, the previously running instance is canceled while the new instance is started.

// TODO fix bugs

<div>
  <ConcurrencyTimeline flow="restart" />
</div>

## What if I want to run more than one instance at once?

The `flow` modifier takes a second parameter that allows you to configure additional options.

By default, any custom flow policy only allows one instance to run at a time. But you can increase the concurrency with the `maxRunning` option, which limits the number of instances allowed to run simultaneously.

Here's an example with the `enqueue` policy:

```javascript
export default {
  tasks: (t) => ({
    enqueuingTask: task(TASK_FN).flow('enqueue', { maxRunning: 3 })
  })
}
```

Now, when you run the task, up to three instances are allowed to run at once while all others are scheduled to run when space frees up.


<div class="showcase">
  <ConcurrencyTimeline flow="enqueue" :maxRunning=3 />
</div>

### What if I want to delay the execution of the task?

To delay the execution of an operation, you can set the desired amount of time in `delay` option.

For example, if you wanted to simulate a debounce function, you could use the `restart` policy with a specified `delay`:

```javascript
export default {
  tasks: (t) => ({
    restartingTask: task(TASK_FN).flow('restart', { delay: 400 })
  })
}
```

Now, when you run the task, each instance waits 400ms before starting. If it's called again within that time, then it's dropped and not run at all, while another one is started in its favor.


<div class="showcase">
  <ConcurrencyTimeline flow="restart" :delay=1000 />
</div>

### How does this differ from throttle and debounce functions?

Vuency buffers the execution of tasks using queues, while throttle and debounce functions use timers. The benefit of using queues, is that it gives you more control over how repeat requests are run because you always have access to the ongoing operations.

Also, the differences and use cases between `debounce` and `throttle` are hard to grasp, while Vuency's flow policies are more straight forward and semantic. Nonetheless, if we were to compare them, `debounce` would be most similar to the `restart` policy with a `delay` configured, and `throttle` would be most similar to the (TODO) `keepLatest`; but neither approach can easily `drop` all repeat requests or even attempt to `restart` an ongoing operation, which are flow control options that are special to Vuency's built in framework for handling concurrency. (:
