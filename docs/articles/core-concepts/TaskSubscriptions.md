# Subscribing to Task Callbacks

Writing complex operations can get messy and it can be useful to semantically separate what's going on. Because of this, Vuency allows you to subscribe to callbacks that are called based on different  stages or results of an operation.

There are three main types of subscriptions:

* The `beforeStart` subscription. Called before an operation is started. Useful place for corner case logic.

* The `onSuccess`, `onError`, and `onCancel` subscription. Called depending on the result of an  operation. For example, if the operation was successful you might want to redirect them to a new route or if the operation failed you might want to send the user an error message.

* The `onFinish` subscription. Called when operation is finished, regardless of result. Useful place for cleanup logic.

<p class="tip">
Task subscriptions are passed their respective task instance as their first parameter. You can take advantage of this to handle per instance logic inside each subscription.
</p>

For example:

```js
task.beforeStart((instance) => {
  if (!cornerCase) instance.cancel()
})

task.onFinish(({ selfCanceled }) => {
  if (!selfCanceled) doSomething()
})
```

<p class="warning">
If you need to use an instance's methods you must do it via the object, e.g. <code> instance.cancel() </code> and not its destructured properties, otherwise the `this` context will be undefined.
</p>

To see an example of subscriptions at work, look at the [Question Genie](/guide/question-genie) example
