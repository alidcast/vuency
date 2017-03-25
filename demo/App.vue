<template>
  <div id="app" class="component">
    <component :is="currentView" />
  </div>
</template>


<script>
import CountdownTimer from 'examples/CountdownTimer'

const routes = {
  '/': { template: `<h1>Vuency</h1>` },
  '/countdown-timer': CountdownTimer
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
