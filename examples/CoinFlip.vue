<template>
  <div class="coin-flip">
    <h4> Coin Flip </h4>
    <p> Heads or Tails? {{ this.answer }} </p>
    <button @click="flipCoin.run()">
      {{ isRunning ? 'May the odds be with you...' : 'Flip coin'}}
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({
    answer: ''
  }),
  tasks(t, { pause }) {
    return t(function* flipCoin() {
      this.answer = yield pause(1000).then(() => Math.random() < 0.5 ? 'Heads' : 'Tails')
    })
    .flow('drop')
    .beforeStart(() => {
      this.answer = ''
    })
  },
  computed: {
    isRunning() {
      return this.flipCoin.lastCalled
        ? this.flipCoin.lastCalled.isRunning : false
    }
  }
}
</script>
