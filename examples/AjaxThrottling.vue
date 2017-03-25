<template>
  <div>
    <h4> Ajax Throttling </h4>
    <ul>
      <li v-for="log in logs"
          :style="{ color: log.color }">
        {{ log.message }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    logs: []
  }),
  tasks: (t, { pause }) => ({
    loopingAjaxTask: t(function * (id, color) {
      this.log(color, `Task ${id}: making AJAX request`)
      yield pause(1000 + 2000 * Math.random()) // simulate slow AJAX
      this.log(color, `Task ${id}: Done, sleeping.`)
      this.loopingAjaxTask.run(id, color)
    }).flow('enqueue').maxRunning(3)
  }),
  mounted() {
    this.loopingAjaxTask.run(0, '#0000FF')
    this.loopingAjaxTask.run(1, '#8A2BE2')
    this.loopingAjaxTask.run(2, '#A52A2A')
    this.loopingAjaxTask.run(3, '#DC143C')
    this.loopingAjaxTask.run(4, '#20B2AA')
    this.loopingAjaxTask.run(5, '#FF1493')
    this.loopingAjaxTask.run(6, '#228B22')
    this.loopingAjaxTask.run(7, '#DAA520')
  },
  methods: {
    log(color, message) {
      let logs = this.logs || []
      logs.push({ color, message })
      this.logs = logs.slice(-7)
    }
  }
}
</script>
