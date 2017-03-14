<template>
  <ul>
    <li v-for="log in logs"
        :style="{ color: log.color }">
      {{ log.message }}
    </li>
  </ul>
</template>

<script>
export default {
  created() {
    let vm = this
    function loopingAjaxTask(id, color) {
      return (async function () {
        while (true) {
          vm.log(color, `Task ${id}: making AJAX request`)
          await vm.ajaxTask.run()
          vm.log(color, `Task ${id}: Done, sleeping.`)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      })()
    }
    loopingAjaxTask(0, '#0000FF')
    loopingAjaxTask(1, '#8A2BE2')
    loopingAjaxTask(2, '#A52A2A')
    loopingAjaxTask(3, '#DC143C')
    loopingAjaxTask(4, '#20B2AA')
    loopingAjaxTask(5, '#FF1493')
    loopingAjaxTask(6, '#228B22')
    loopingAjaxTask(7, '#DAA520')
  },
  data: () => ({
    logs: []
  }),
  methods: {
    log(color, message) {
      let logs = this.logs || []
      logs.push({ color, message })
      this.logs = logs.slice(-7)
    }
  },
  tasks: (t, { pause }) => ({
    ajaxTask: t(function * () {
      yield pause(2000 + 2000 * Math.random()) // simulate slow AJAX
    }).flow('enqueue').concurrency(3)
  })
}
</script>
