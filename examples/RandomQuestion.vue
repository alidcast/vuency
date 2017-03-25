<template>
  <div class="random-question">
    <h4> Random Question </h4>
    <p> What is the meaning of life? {{ this.answer }} </p>
    <button @click="askQuestion.run()">
      {{ this.askQuestion.isIdle ? 'Ask' : 'Thinking...' }}
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({
    answer: ''
  }),

  tasks: (t, { pause }) => ({
    askQuestion: t(function* () {
      this.answer = Math.random()
    }).flow('drop', 1000)
  })
}
</script>
