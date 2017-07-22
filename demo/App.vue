<template>
  <div id="app" class="component">
    <a href="/countdown-timer"> countdown </a>
    <a href="/coin-flip"> coin flip </a>
    <a href="/question-genie"> question genie </a>
    <a href="/infinite-ajax"> infinite ajax </a>
    <component :is="currentView" />
  </div>
</template>


<script>
import CountdownTimer from 'examples/CountdownTimer'
import CoinFlip from 'examples/CoinFlip'
import QuestionGenie from 'examples/QuestionGenie'
import InfiniteAjax from 'examples/InfiniteAjax'

const routes = {
  '/': { template: `<h1>Vuency</h1>` },
  '/countdown-timer': CountdownTimer,
  '/coin-flip': CoinFlip,
  '/question-genie': QuestionGenie,
  '/infinite-ajax': InfiniteAjax
}

export default {
  data: () => ({
    currentRoute: window.location.pathname
  }),
  computed: {
    currentView() {
      return routes[this.currentRoute] || NotFound
    }
  }
}
</script>

<style>
.component a {
  padding-right: 1rem
}
</style>
