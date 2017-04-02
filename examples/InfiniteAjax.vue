<template>
  <div>
    <h4> Ajax Throttling </h4>
    <ul>
      <li v-for="log in logs"
          :style="{ color: log.color }">
        {{ log.message }}
      </li>
    </ul>

    <button v-if="infiniteAjax.isActive" @click="infiniteAjax.abort()">
      Cancel All
    </button>
    <button v-else @click="infiniteAjax.run()">
      Start Again
    </button>

    <ul v-if="instances">
      <li v-for="(instance, index) in instances" v-if="instance.isRunning">
        <button @click="instance.cancel()">
            Cancel Task: {{ index }}
          </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    logs: [],
    instances: []
  }),
  tasks(t, { timeout }) {
    let loopingAjax = t(function * (id, color) {
      this.log(color, `Task ${id}: making AJAX request`)
      yield timeout(1000 + 2000 * Math.random()) // simulate slow AJAX
    })
    .flow('enqueue', { maxRunning: 3 })
    .onFinish(({ params, isCanceled }) => {
      let id = params[0], color = params[1]
      if (!isCanceled) {
        this.log(color, `Task ${id}: Done, sleeping.`)
      } else {
        this.log(color, `Task ${id}: Sorry, I've been sent to the abyss!`)
      }

      if (!loopingAjax.isAborted) {
        this.instances[id] = loopingAjax.run(id, color)
      }
    })

    return {
      infiniteAjax: t(function * () {
        let { instances } = this
        instances.push(loopingAjax.run(1, '#0000FF'))
        instances.push(loopingAjax.run(2, '#8A2BE2'))
        instances.push(loopingAjax.run(3, '#DC143C'))
        instances.push(loopingAjax.run(4, '#20B2AA'))
        instances.push(loopingAjax.run(5, '#FF1493'))
        instances.push(loopingAjax.run(6, '#DAA520'))
        instances.push(loopingAjax.run(7, '#4FC40A'))
      })
      .flow('drop')
      .nthCall(1, { keepRunning: true })
      .onKill(() => {
        loopingAjax.abort()
        this.instances = []
      })
    }
  },

  created() {
    this.infiniteAjax.run()
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
