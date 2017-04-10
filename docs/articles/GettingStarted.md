# Getting Started

At the center of every Vuency application is the `Task` primitive, which represents an asynchronous, transparent, and controllable operation.

Think of a `task` as a more powerful alternative to Vue's built in `method`. Sometimes all you need is for a function to handle simple logic; in that case, use a method. But what if you need to check the state of the function as you wait for a promise to resolve? Or what if you need to cancel an operation, or control the flow of repeat requests? In those cases and others, use a `task` and let Vuency do the heavy lifting for you.

## Working with Tasks

There are two main steps to working with tasks:

1. Converting an operation into a task object and using its properties.
2. Creating and using task instances.
3. Registering the task so that Vuency can inject it into the component instance.

We'll go over each one individually and then put them together.

### Creating and using a task

To create a task, pass your desired operation as the first parameter to the  `task factory` function.

The operation can be either a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) or [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). The main difference between the two options is that generator functions give control over each step of their execution and so can be canceled at any point; whereas async functions are not cancelable and (as of March 2017) there is no active TC39 specification for adding it. For this reason, we recommend you use generator functions, as we do in our examples, so that you can take advantage of the full power of Vuency.

```js
import { task } from 'vuency/task-factory'

let myTask = task(function * taskOperation() {...})
```

This returns a task object that you can use to run the operation or check its state, along with other useful task properties.

For example:

```js
myTask.run()
myTask.isActive // true
```

For a complete list of task states and actions, check out the [task property](/guide/task-property) API.

### Creating and using task instances

Every execution of `task.run()` creates a single task instance, which represents one instance of the task's core operation.

<p class="tip">
  The main difference between the task property and a task instance properties is that while the task property has control over all operation instances, the task instance only has control over its own ongoing operation.
</p>

Here's a basic example that shows the difference between a task's properties and a task instance's properties:

```
let firstInstance  = myTask.run(),
    secondInstance = myTask.run(),
    thirdInstance  = myTask.run()

task.isActive            // true

secondInstance.cancel()  // instance method - cancels a single instance of the operation
firstInstance.isRunning  // true
secondInstance.isRunning // false
task.isActive            // true

task.abort()             // task method - cancels all ongoing instances of the operation
secondInstance.isRunning // false
thirdInstance.isRunning  // false
task.isActive            // false
```

To learn more about the different use cases of the task property versus a task instance, read the [task-state](/guide/task-state) and [task-bindings](/guide/task-bindings) sections.

For a complete list of a task instance properties, check out the [task instance](/guide/task-instance) API.

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
