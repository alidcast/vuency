<script>
import QuestionGenie from '~components/tasks/examples/QuestionGenie.vue'

export default {
  components: {
    QuestionGenie
  }
}
</script>

## Question Genie

(The component below is a modified version of an example shown in the [Vuejs documentation about watchers](https://vuejs.org/v2/guide/computed.html#Watchers)).

<div class="showcase">
    <QuestionGenie />
</div>

#### Javascript

```js
export default {
  data: () => ({
    question: '',
    answer: ''
  }),
  tasks(t, { timeout }) {
    return t(function * getAnswer() {
      this.answer = 'Thinking...'
      yield timeout(600)
      this.answer = Math.random() < 0.5 ? 'Yes' : 'No'
    })
    // Simulate `Debounce`: If within 400ms the user starts typing
    // again, then the current operation will be canceled
    // and started again.
    .flow('restart', { delay: 400 })
    // Simulate Vue `Watcher`: The task fires upon creation and
    // every time the `question` input changes.
    .runWith('question', { immediate: true })
    // Handle corner cases and cancel the task if necessary.
    .beforeStart(instance => {
      if (this.question.length === 0) {
        this.answer = 'Questions must contain words!'
        instance.cancel()
      } else if (this.question.indexOf('?') === -1) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        instance.cancel()
      }
    })
    // Handle debounce.
    .onCancel(({ selfCanceled }) => {
      if (!selfCanceled) this.answer = 'Waiting for you to stop typing...'
    })
  }
}
```

#### Template

```html
<div class="question-genie">
  <h4> Question Genie </h4>
  <p>
    Ask a yes/no question: <input id="question" v-model="question">
  </p>
  <p id="answer">{{ answer }}</p>
</div>
```
