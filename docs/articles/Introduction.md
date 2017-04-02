# What's is Vuency?

Vuency brings structured concurrency to your Vuejs applications, by giving you complete control and transparency over the execution of asynchronous and concurrent operations.

By controllable operations, we mean that the operations are cancellable. Currently, promises and async functions are not cancellable; and as of March 2017, there is no active TC39 specification for adding it. Sure, you can clutter your code by setting `isRunning` flags before and after an operation has started to control repeat requests, but you still can't in any way cancel an operation that's already in progress. In contrast, with Vuency, you can easily `enqueue`, `drop`, or `restart` repeat calls to the same operation with only one extra line of code.

As an added benefit, each task's state, such as `isRunning`, is built in and updated automatically.
That's in fact what we mean by transparent operations; Vuency exposes as much derived state as possible that you don't have to clutter your code with boilerplate logic. Because of this, handling everyday UI tasks such as displaying loading spinners and styling active buttons are effortless.

Put simply, with Vuency, it's dead simple to manage the flow of repeat requests and to handle UI tasks that depend on the state on an operation.

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

As you look at the examples, ask yourself: what would it take to do this without Vuency? And, if you were to compare the result with and without Vuency: which code would be better structured and easier to reason about?

Beginner examples:

* [Coin Flip](/guide/coin-flip)
* [Countdown Timer](guide/countdown-timer)

Advanced examples:

* [Infinite Ajax](/guide/infinite-ajax)
* [Question Genie](/guide/question-genie)
