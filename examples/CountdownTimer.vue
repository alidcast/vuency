<template>
  <div>
    <div class="countdown-timer ">
      <p> Count: {{ this.count }}</p>
      <button @click="counter.run()"> Start Over </button>
    </div>
  </div>
</template>

<script>
const COUNT_START = 10

export default {
  data: () => ({
    count: COUNT_START
  }),
  tasks: (t, { timeout }) => ({
    counter: t(function* () {
      this.count = COUNT_START
      while (this.count > 0) {
        yield timeout(300)
        --this.count
      }
      this.count = 'DONE'
    }).flow('restart')
  })
}
</script>
