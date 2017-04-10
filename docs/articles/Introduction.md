# What's is Vuency?

Put simply, Vuency helps you manage complex, event-driven operations with minimal code.

Under thei hood, Vuency adds an extra layer between an operation and the execution of that operation. This allows Vuency to equip the operation with common, boilerplate logic that you would otherwise have to handle yourself.

The two main benefits are:

* **Implicit state**: The operation's state is baked in, so that you don't have to manually set `isRunning` flags yourself, to handle common UI interactions.

* **Flow control**: Scheduling and cancellation for every instance of the operation is baked in, so you can easily manage the flow of repeat requests without the need for hacky `setTimeout` solutions, as well as manually cancel an operation at any moment.

The additional benefits:

* **Callback subscriptions**: Subscribe to callbacks that are called based on the stage or result of the operation, e.g. `beforeStart` or `onCancel`. This semantically separates the handling of corner cases from the core logic, which makes your code easier to reason about.

* **Bind data**: Bind specific parameters or options to the `nth` call of the instance, e.g. using `nth(1, { keepRunning: true })`, so that you can simulate an infinite loop without overpowering the main thread.

* **Async helpers**: Common async utilities, such as `timeout` helpers, that are automatically cleanup when the operation is over, which ensures that UI interactions flow with minimal latency.

* **Vue helpers**: Vue `watchers` and `events` are wrapped as additional modifiers, e.g. `runWith` for watchers, so that all logic for the operation can be nicely encapsulated together.

If that isn't enough, Vuency's API strikes a nice balance between declarative and imperative styles of programming, which makes complex code simple and fun to write.

## Moving forward with Vuency

Essential:

* [Install Vuency](/guide/installation)
* [Learn basic usage](/guide/getting-started)

Advanced:

* [Learn how to manage repeat requests](/guide/task-flow)
* [Learn how to cancel ongoing operations](guide/task-cancelation)
* [Learn how to handle common UI interactions](/guide/task-state)

## Not convinced? - See Vuency in action

If you're still not convinced, check out the demos and code from the examples linked below and see the benefits yourself.

Beginner examples:

* [Coin Flip](/guide/coin-flip)
* [Countdown Timer](guide/countdown-timer)

Advanced examples:

* [Infinite Ajax](/guide/infinite-ajax)
* [Question Genie](/guide/question-genie)
