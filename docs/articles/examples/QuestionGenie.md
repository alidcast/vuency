<script>
import QuestionGenie from '~components/tasks/QuestionGenie.vue'

export default {
  components: {
    QuestionGenie
  }
}
</script>

<div>
    <QuestionGenie> </QuestionGenie>
</div>

The example we'll be working on below is basically an input form that takes in question and, using the `yesno.wtf` API, returns an answer. This example was actually taken from the [Vuejs documentation about watchers](https://vuejs.org/v2/guide/computed.html#Watchers). In the second snippet below, you'll see the refactored version that uses Vuency.


```js
// template
<div>
  <p>
    Ask a yes/no question: <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>

// javascript
export default {
  data() {
    return {
      question: '',
      answer: 'I cannot give you an answer until you ask a question!'
    }
  },
  tasks(t, { pause }) {
    return t(function * getAnswer() {
      this.answer = 'Thinking...'
      yield pause(200)
      this.answer = Math.random() < 0.5 ? 'Yes' : 'No'
    })
    .flow('restart', 400).runWith('question')
    .beforeStart(({ cancel }) => {
      if (this.question.length === 0) {
        this.answer = 'Questions must contain words!'
        cancel()
      }
      else if (this.question.indexOf('?') === -1) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        cancel()
      }
    })
    .onCancel(({ selfCanceled }) => {
      if (!selfCanceled) this.answer = 'Waiting for you to stop typing...'
    })
  }
}
```
