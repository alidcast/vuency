<template>
  <div id="app" class="component">
    <button @click="askQuestion.run()">
      Get Answer
    </button>
    <p>
      answer: {{ answer }} <br>
      result: {{ askQuestion.value }} <br>
      state: {{ askQuestion.isActive }}
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
    return {
      askQuestion: t(function* () {
        yield pause(1000)
        this.answer = this.num
        this.num++
        return 'me too!'
      }).concurrency(3)
    }
  }
}
</script>
