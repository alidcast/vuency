<template>
  <div>
    <p>
      What is the meaning of Life? <br>
      {{ this.answer }}
    </p>
    <button @click="askQuestion.run()">
      {{ this.askQuestion.isIdle ? 'Ask' : 'Thinking...' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'QuestionGenie',

  data: () => ({
    answer: ''
  }),

  tasks: (t, { pause }) => ({
    askQuestion: t(function* () {
      yield pause(2000)
      this.answer = Math.random()
    }).flow('drop').concurrency(1)
  })
}
</script>
