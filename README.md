# Vuency  

> Gain complete control and transparency over the execution of concurrent and asynchronous operations, with almost no code.

A concurrency management framework written using [Ency.js](https://github.com/encyjs/ency).


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

## Extended Usage

*For basic usage, see the [Ency.js documentation site](https://encyjs.alidcastano.com).*


### Registering a task

Vuency mixes the `tasks` property into each component instance.

Similar to Vue's `data` property, the tasks property must be declared as function, so that Vuency can inject a fresh copy of the  registered tasks into each component instance.

Also, for you're convenience, Ency passes the the task factory function as the first argument to `tasks` so that you don't have to manually import it every time. Since you'll likely be using this function a lot, the convention is to abbreviate this function to `t`.


*Note: All registered tasks must be named, either as named functions or named objects.*

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

Then, when the component is created, Vuency will iterate through the list of returned task objects and inject each one (by the function or objects name) into the component instance.

### Event Modifiers

Vue `watchers` and `listeners` are wrapped as additional modifiers, so that all logic for the operation can be nicely encapsulated together.

Listener modifiers:

* `runOn`, calls tasks' `run` method in response to custom event on the Vue instance.
* `abortOn`, calls tasks' `abort` method in response to custom event on the Vue instance.

Watcher modifiers:

* `runWith`, watches an expression or a computed function on the Vue instance and call the tasks' `run` method every time it changes.
* `abortWith`, watches an expression or a computed function on the Vue instance and calls the tasks' `abort` method every time it changes.

```js
export default {
  data() {
    input: '',
  }
  tasks() {
    return task(TASK_FN).runWith('input')
  }
}
```
