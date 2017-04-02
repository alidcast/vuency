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
  tasks(t, { timeout }) { // TODO working weirdly
    return t(function* flipCoin() {
      this.answer = yield timeout(2000)
      this.answer = Math.random() < 0.5 ? 'Heads' : 'Tails'
    })
    .flow('drop')
    .beforeStart(() => {
      this.answer = ''
    })
  },
  computed: {
    isRunning() {
      let { flipCoin } = this
      return flipCoin.lastStarted ? flipCoin.lastStarted.isRunning : false
    }
  }
}
</script>
