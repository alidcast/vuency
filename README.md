# Vuency  

> Gain complete control and transparency over the execution of concurrent and asynchronous operations, with almost no code. (*Inspired by [ember-concurrency](https://github.com/machty/ember-concurrency)*)

# 🚧 Under active development.

## Installation

First, install the npm package:

`npm install vuency --save`

Then, install Vuency globally so that it becomes available to all component instances:

```js
import Vue from 'vue'
import Vuency from 'vuency'

Vue.use(Vuency)
```

## Why Vuency?

Vuency helps you manage complex, event-driven operations with minimal code.

The two main benefits are:

* **Implicit state**: The operation's state is baked in, so that you don't have to manually set `isRunning` flags yourself, to handle common UI interactions.

* **Flow control**: Scheduling and cancellation for every instance of the operation is baked in, so you can easily manage the flow of repeat requests without the need for hacky `setTimeout` solutions, as well as manually cancel an operation at any moment.

The additional benefits:

* **Callback subscriptions**: Subscribe to callbacks that are called based on the stage or result of the operation, e.g. `beforeStart` or `onCancel`. This semantically separates the handling of corner cases from the core logic, which makes your code easier to reason about.

* **Bind data**: Bind specific parameters or options to the `nth` call of the instance, e.g. using `nth(1, { keepRunning: true })`, so that you can simulate an infinite loop without overpowering the main thread.

* **Async helpers**: Common async utilities, such as `timeout` helpers, that are automatically cleanup when the operation is over, which ensures that UI interactions flow with minimal latency.

* **Vue helpers**: Vue `watchers` and `events` are wrapped as additional modifiers, e.g. `runWith` for watchers, so that all logic for the operation can be nicely encapsulated together.

If that isn't enough, Vuency's API strikes a nice balance between declarative and imperative styles of programming, which makes complex code simple and fun to write.

## Documentation

The [Vuency documentation](https://vuency.alidcastano.com) is a [nuxt.js](https://github.com/nuxt/nuxt.js) generated static site with interactive examples.


### ----

3. Registering the task so that Vuency can inject it into the component instance.

### Registering a task

To allow you to easily register tasks, Vuency mixes the `tasks` property into each component instance.

Similar to Vue's `data` property, the tasks property must be declared as function, so that Vuency can inject a fresh copy of the  registered tasks into each component instance.

Also, for you're convenience, Vuency passes the the task factory function as the first argument to `tasks` so that you don't have to manually import it every time. Since you'll likely be using this function a lot, the convention is to abbreviate this function to `t`.

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
  then the component's `this` context will only be available inside the task's function.
</p>

```js
// registering only one task, then return the named function
export default {
  Tasks: t => t(function * myTask() {...})
}

// registering one or more tasks, then return the named objects
export default {
  Tasks: (t) => ({
    myTask: t(function * () {...}),
    myOtherTask: t(function * () {...})
  })
}
```

Then, when the component is created, Vuency will iterate through the list of returned task objects and inject each one (by the function or objects name) into the component instance.
