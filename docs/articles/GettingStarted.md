# Getting Started

## Installation

First, install the plugin via your preferred package manager:

`npm install vuency --save`

Then, install Vuency globally so that its `task` mixin becomes available in all component instances:

```
import Vue from 'vue'
import Vuency from 'vuency'

Vue.use(Vuency)
```



## Working with Tasks

At the center of every Vuency application is a `Task`, an asynchronous, transparent, and controllable operation.


### When should I use tasks?

Think of a `task` as a more powerful alternative to Vue's built in `method`. Sometimes all you need is for a function to handle simple logic; in that case, use a method. But what if you need to check the state of the function as you wait for a promise to resolve? Or what if you need to cancel an operation, or control the flow of repeat requests? In those cases and others, use a `task` and let Vuency do the heavy lifting for you.


...

First, let's go over the one caveat to getting the full power of tasks: `generator functions`.

// TODO does it have to be generator functions?

...

There are two main steps to working with tasks: converting each method into a task and registering the task so that Vuency can inject it into the component instance.

We'll go over each one individually and then put them together.

### Creating a task

To create a task, Vuency exposes the `task` factory function. You can use it on an your desired operation to turn it into a task object.

```js
import { task } from 'vuency/...?'

let myTask = task(function * () {
  // some logic
})
```

This returns a task object that you can use to check the run, cancel, and check the state of the operation.

```js
myTask.run()
myTask.isRunning // true
```

For a complete list of task states and actions, check out the `task property` API.

### Registering a task

To allow you to register tasks, Vuency mixes the `tasks` property into each component instance.

Similar to Vue's `data` property, the tasks property must be declared as function, so that Vuency can inject a fresh copy of the  registered tasks into each component instance.

For you're convenience, Vuency passes the the task factory function as the first argument to `tasks`. Since you'll likely be using this function a lot, the convention is to abbreviate this function to `t`.

<p class="danger">
  All registered tasks must be named, either as named functions or named objects.
</p>


```js
// if registering only one task, then you can return the named function
export default {
  Tasks(t) {
    return t(function * myTask() {...})
  }
}

// if your registering one or more tasks, then return the named objects
export default {
  Tasks(t) {
    return {
      myTask: t(function * () {...}),
      myOtherTask: t(function * () {...})
    }
  }
}
```

If you like brevity, you can also use ES6 arrow syntax:

<p class="danger">
  Keep in mind that if you use ES6 arrow syntax for `tasks` property function,
  then it will not have the components `this` context available.
</p>

```js
// registering only one task, then return the named function
export default {
  Tasks: t => t(function * myTask() {})
}

// registering one or more tasks, then return the named objects
export default {
  Tasks: (t) => ({
    myTask: t(function * () {...}),
    myOtherTask: t(function * () {...})
  })
}
```

When the component is created, Vuency will iterate through the list of returned task objects and inject each one (by the function or objects name) into the component instance.
