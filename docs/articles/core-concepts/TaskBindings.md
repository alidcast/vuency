 # Per Instance Bindings

Sometimes you might need to bind certain data to a specific task instance.

For this, Vuency exposes the `nth` task modifier. As the first parameter you pass it the running task instance number you want the binding it to apply to and as the second parameter you pass it an object of bound options.

As of now, the only option is `keepRunning`, which keeps the task instance in the running queue and thus, allows you to simulate an infinitely active task without overpowering the main thread with a `while (true)` loop.

Example usage:

```js
task.nth(1, { keepRunning: true })
```
