# Introduction

## What's is Vuency?

Vuency brings structured concurrency to your Vuejs applications, by giving you complete control and transparency over the execution of asynchronous and concurrent operations.

By controllable operations, we mean that the operations are cancellable. Currently, promises and async functions are not cancellable; and as of March 2017, there is no active TC39 specification for adding it. Sure, you can clutter your code with `hasStarted` flags to prevent repeat calls from starting, but you still can't in any way cancel an operation that's already in progress. In contrast, with Vuency, you can easily enqueue, drop, or restart repeat calls to the same operation with only one extra line of code.

By transparent operations, we mean that the operations expose information about its state. With Vuency, you don't need to set any flags to check if a function is running. Vuency maximizes implicit state so that everyday UI tasks such as displaying loading spinners and styling active buttons are effortless.

Put simply, with Vuency, it's dead simple to manage the flow of repeat requests and to handle UI tasks that depend on the state on an operation.

## Vuency in action

Let's compare code before and after Vuency, and you can decide the benefits for yourself. (Don't worry about the new syntax just yet, we will be going over it in the [getting started](/guide/getting-started) section.)


As you look at the examples, ask yourself: which code is better structured and easier to reason about?


In the example using Vuency, notice how, despite appearing more verbose at first, it is easier to grasp the core of what the function is doing, as well as the surrounding logic.
