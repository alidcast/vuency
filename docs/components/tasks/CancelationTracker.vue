<template>
  <div>
    <div class="task-controls">
      <button @click="taskTracker.run(runCount)">
        Run Task
      </button>
      <button
        :class="[taskTracker.isActive ? 'isActive' : 'isDisabled' ]"
        @click="taskTracker.abort()">
        Cancel All
      </button>
      <button
        :class="[taskTracker.lastStarted && taskTracker.lastStarted.isRunning
                  ? 'isActive' : 'isDisabled' ]"
        @click="taskTracker.lastStarted.cancel()">
        Cancel Last
      </button>

      <button
        v-if="taskTracker.isActive"
        v-for="(instance, index) in instances"
        @click="instance.cancel()">
          Task {{ index + 1 }}
      </button>
    </div>

    <div class="task-data">
      <h3>Running: {{ runCount }}</h3>
      <h3>Canceled: {{ cancelCount }}</h3>
      <h3>Self Canceled: {{ selfCancelCount }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    runCount: 0,
    cancelCount: 0,
    selfCancelCount: 0,
    instances: []
  }),
  tasks: (t, { timeout }) => ({
    taskTracker: t(function * (count) {
      try {
        this.runCount++
        yield timeout(1000)
      } finally {
        this.runCount--
      }
    })
    .flow('drop', { maxRunning: 2 })
    .beforeStart(function (instance) {
      let index = instance.params[0]
      this.instances[index] = instance
    })
    .onFinish(function (instance) {
      let index = instance.params[0]
      this.instances.splice(index, 1)
      if (instance.isCanceled) this.$emit('wasCanceled', instance.selfCanceled)
    }),

    cancelTracker: t(function * (selfCanceled) {
      this.cancelCount++
      if (selfCanceled) this.selfCancelCount++
    }).runOn('wasCanceled')
  })
}
</script>

<style lang="sass">
.task-controls,
.task-data
  display: inline-block
  vertical-align: top
  margin: 1rem
.task-controls
  min-width: 20%
  button
    display: block
    margin: .25rem
    padding: .25rem
.task-data
  h3
    vertical-align: top
    display: inline-block
    margin: 2rem

.isActive
  opacity: 1
.isDisabled
  opacity: 0.5
  pointer-events: none
  cursor: default
</style>
