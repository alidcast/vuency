# Vuency

> Gain complete control and transparency over the execution of concurrent and asynchronous operations, with almost no code.

At first, all there was, was Vuency. But shortly after creating the library, I realized that 95% of it was just Javascript. So I extracted those parts out and created a [Ency](https://github.com/encyjs/ency), a framework-independent concurrency library for Javascript. Now Vuency serves as a wrapper around Ency that fills in the remaining 5%, for Vue specific tasks.

## Why Vuency?

Vuency helps you manage complex, event-driven operations with minimal code.

The two main benefits are:

* **Implicit state**: Operations have their state baked in, so that you don't have to manually set and update flags (i.e. `isRunning`) yourself, to handle common UI interactions.

* **Flow control**: The scheduling and cancellation of operation instances is baked in, so you can easily manage the flow of repeat requests, as well as manually cancel an operation at any moment.

The additional benefits:

* **Callback subscriptions**: Subscribe to callbacks that are fired based on the stage or result of the operation, e.g. `beforeStart` or `onCancel`. This semantically separates the handling of corner cases from the core logic, which makes your code easier to reason about.

* **Bind data**: Bind specific parameters or options to the `nth` call of the instance, e.g. using `nth(1, { keepRunning: true })`, so that you can simulate an infinite loop without overpowering the main thread.

* **Async helpers**: Common async utilities, such as `timeout` helpers, that are automatically cleanup when the operation is over, which ensures that UI interactions flow with minimal latency.

If that isn't enough, Ency's API strikes a nice balance between declarative and imperative styles of programming, which makes complex code simple and fun to write.


## Installation

First, install the npm package:

`npm install vuency --save`

Then, install Vuency globally so that it becomes available to all component instances:

```js
import Vue from 'vue'
import Vuency from 'vuency'

Vue.use(Vuency)
```

## Documentation

The [Vuency documentation](ency.now.sh/vuency) is a [nuxt.js](https://github.com/nuxt/nuxt.js) and [nuxtent](https://github.com/nuxt-community/nuxtent) generated static site with interactive examples.

## License

MIT