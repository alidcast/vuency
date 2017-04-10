<template>
  <div class="ui-interactions">
    <button @click="loader.run()">
      {{ loader.isActive ? 'Loading...' : 'Run' }}
    </button>

    <button :class="{'isDisabled': loader.isIdle }"
      @click="loader.abort()">
      Cancel
    </button>
  </div>
</template>


<script>
export default {
  tasks: (t, { timeout }) => ({
    loader: t(function* () {
      yield timeout(1500)
    }).flow('drop')
  })
}
</script>

<style lang="sass">
.ui-interactions
  button
    margin: .5rem

.isDisabled
  opacity: 0.5
  pointer-events: none
  cursor: default
</style>
