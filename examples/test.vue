<template>
  <div id="app" class="component">
    <button @click="$emit('hasChanged')"> Get Answer </button>
    <button @click="askQuestion.abort()"> Abort </button>
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
  tasks(t, { pause }) {
    return {
      askQuestion: t(function* () {
        this.num++
        this.answer = this.num
      })
      .flow('drop')
      .runOn('hasChanged')
      .beforeStart(async () => {
        this.answer = 'waiting...'
        await pause(400)
      })
      .beforeNext(async () => {
        this.answer = 'almost there...'
        await pause(400)
      })
      .onCancel(() => {
        this.answer = 'canceled'
      })
    }
  }
}
</script>
