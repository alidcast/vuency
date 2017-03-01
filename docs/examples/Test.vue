<template>
  <div>
    <p>
      {{ this.answer }}
    </p>
    <button @click="askQuestion.run()">
      Get Answer
    </button>
  </div>
</template>

<script>
export default {
  name: 'QuestionGenie',

  data: () => ({
    answer: ''
  }),

  tasks: [
    function* askQuestion() {
      this.answer = 'hello'
    }
  ]
}
</script>
