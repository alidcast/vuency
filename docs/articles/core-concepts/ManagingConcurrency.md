<script>
import ConcurrencyTimeline from '~components/tasks/ConcurrencyTimeline.vue'

export default {
  components: {
    ConcurrencyTimeline
  }
}
</script>

## Managing Task Concurrency

Concurrency means multiple tasks which run in overlapping time periods

Often you want to control the flow and frequency of concurrent tasks. For example, if a function is making an ajax request, you might want to ignore repeat calls if an instances is already running. With task modifiers, Vuency allows you to easily manage concurrency.


### Task Modifiers

introduce them with examples

#### Default Behavior: Tasks Run Concurrently

// TODO
// infinite tasks run concurrently
// but w/ any modifier, default is 1

#### enqueue

Once the max number of tasks are running, the `enqueue` modifier enqueues any other repeat calls and only runs them when the allowed amount of concurrency frees up. Thus, there is not task overlap and all tasks are eventually performed, as each task waits for previous calls to finish before being dequeued itself and run to completion.


<div>
  <ConcurrencyTimeline flow="enqueue"> </ConcurrencyTimeline>
</div>

#### drop

Once the max number of tasks are running, the `drop` modifier drops any other repeat calls. Thus, like the `enqueue` modifier, there is also no task overlap, but instead of enqueing the task to run later, any extra calls are ignored and the functions are never actually called.


<div>
  <ConcurrencyTimeline flow="drop"> </ConcurrencyTimeline>
</div>

#### restart

Upon repeat requests, if the max number of tasks are running, the `restart` modifier cancels any currently running tasks and runs the new task instance immediately. Thus, rather than enqueing or dropping repeat calls, the `restart` modifier cancels currently running tasks if a new one tasks before a prior one completes.

<div>
  <ConcurrencyTimeline flow="restart"> </ConcurrencyTimeline>
</div>
