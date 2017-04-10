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
