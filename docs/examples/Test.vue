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

  tasks: function (t) {
    return {
      askQuestion: t(function () {
        this.answer = 'hello'
      })
    }
  }
}
</script>
