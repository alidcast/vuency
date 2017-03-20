<template>
  <div id="app" class="component">
    <button @click="askQuestion.run()">
      Get Answer
    </button>
    <p>
      answer: {{ answer }} <br>
      result: {{ askQuestion.value }} <br>
      state: {{ askQuestion.isActive }} <br>
      last: {{
        askQuestion.last.called
        ? askQuestion.last.called.state : askQuestion.default.state
      }}
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    answer: '',
    num: 0
  }),

  tasks: function(t, { pause }) {
    return t(function* askQuestion() {
      yield pause(3000)
      this.answer = this.num
      this.num++
      return 'me too!'
    }).flow('drop').concurrency(3)
  }
}
</script>
