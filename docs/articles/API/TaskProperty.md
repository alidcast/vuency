
## Using a task property

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

```html
<div>
  <button @click="myTask.run()"></button>  
  <p>{{ this.myTask.isActive 'I'm active' : 'I'm idle' }}</p>
</div>

```
