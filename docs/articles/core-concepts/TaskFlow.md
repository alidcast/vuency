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

With `.flow('enqueue')`, repeat calls are enqueued and only run when the previous call finishes.

Think of this as the "love all children equally" scheduling policy. It's useful when all instances are equally important and you want all of them to run but not during the same span of time so as not to overpower the main thread.

In the demo below, notice how repeat calls do not overlap anymore, but all of them are indeed eventually run to completion.

<div class="showcase">
  <ConcurrencyTimeline flow="enqueue" />
</div>

#### Drop

With `.flow('drop')`, repeat calls are dropped and ignored.

Think of this as the "favor the first born" scheduling policy. It's useful when all instances are equally important but you only need one instance to run to completion during the same span of time.

In the demo below, notice how once the first instance starts running, any other calls during the same time period are dropped never waited on or fired.

<div class="showcase">
  <ConcurrencyTimeline flow="drop" />
</div>


#### Restart

With `flow('restart')`, repeat calls cause any ongoing operations to be canceled and in favor of the newest instance of the operation.

Think of this as the "favor the youngest child" scheduling policy. It's useful when the most recent call is the most important, for example if it holds newer data that renders the previous call useless, so you don't need the older ones to keep running.

In the example below, notice how if a new instance is created during the same span of time, the older, ongoing instance is immediately canceled.

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

An additional benefit of Vuency's flow policies is that their usage is more straightforward and semantic.
