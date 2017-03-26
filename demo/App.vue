<template>
  <div id="app" class="component">
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
