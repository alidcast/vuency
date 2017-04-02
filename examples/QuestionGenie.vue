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
      this.answer = 'Thinking...'
      yield timeout(200)
      this.answer = Math.random() < 0.5 ? 'Yes' : 'No'
    })
    .flow('restart', { delay: 400 }).runWith('question')
    .beforeStart(instance => {
      if (this.question.length === 0) {
        this.answer = 'Questions must contain words!'
        instance.cancel()
      }
      else if (this.question.indexOf('?') === -1) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        instance.cancel()
      }
      else this.answer = 'Thinking...'
    })
    .onCancel(({ selfCanceled }) => {
      if (!selfCanceled) this.answer = 'Waiting for you to stop typing...'
    })
  }
}
</script>
