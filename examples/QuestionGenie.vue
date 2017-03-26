<template>
  <div class="question-genie">
    <h4> Question Genie </h4>
    <p>
      Ask a yes/no question: <input id="question" v-model="question">
    </p>
    <p id="answer">{{ answer }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: '',
      answer: 'Questions must contain words!'
    }
  },
  tasks(t) {
    return t(function * getAnswer() {
      this.answer = yield Math.random() < 0.5 ? 'Yes' : 'No'
    })
    .flow('restart', 400).runWith('question')
    .beforeYield(({ cancel }) => {
      if (this.question.length === 0) {
        this.answer = 'Questions must contain words!'
        cancel()
      }
      else if (this.question.indexOf('?') === -1) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        cancel()
      }
      else this.answer = 'Thinking...'
    })
    .onCancel(({ selfCanceled }) => {
      if (!selfCanceled) this.answer = 'Waiting for you to stop typing...'
    })
  }
}
</script>
