<template>
  <div>
    <p> Count: {{ this.count }}</p>
    <button @click="counter.run()"> Start Over </button>
  </div>
</template>

<script>
const COUNT_START = 10

export default {
  data: () => ({
    count: COUNT_START
  }),

  tasks: (t, { pause }) => ({
    counter: t(function* () {
      this.count = COUNT_START
      while (this.count > 0) {
        yield pause(300)
        --this.count
      }
      this.count = 'DONE'
    }).flow('restart')
  })
}
</script>
