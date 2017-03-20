<template>
  <div id="app" class="component">
    <h1>{{pluginName}}</h1>

    Test:
    <Test />

    Enqueue:
    <TaskTrackerGraph flow="enqueue" />

    Restart:
    <TaskTrackerGraph flow="restart" />

    Drop:
    <TaskTrackerGraph flow="drop" />
  </div>
</template>


<script>
import Test from './Test'
import TaskTrackerGraph from './TaskTrackerGraph'

export default {
  data: () => ({
    pluginName: "Vuency"
  }),

  components: {
    Test,
    TaskTrackerGraph
  }
}
</script>
