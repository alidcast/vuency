<template>
  <div id="app" class="component">
    <h1>{{pluginName}}</h1>

    <Test />
  </div>
</template>


<script>
import Test from './Test'

export default {
  data: () => ({
    pluginName: "Vuency"
  }),

  components: {
    Test
  }
}
</script>
