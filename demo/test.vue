<template>
  <div id="app" class="component">
    <button @click="askQuestion.run()">
      Get Answer
    </button>
    <p>
      answer: {{ answer }} <br>
      result: {{ askQuestion.value }} <br>
      state: {{ askQuestion.state }}
    </p>
  </div>
</template>


<script>
export default {
  data: () => ({
    answer: ''
  }),

  tasks: function(t, { pause }) {
    return {
      askQuestion: t(function* () {
        yield pause(2000)
        this.answer = 'here'
        return 'me too!'
      })
    }
  }
}
</script>
