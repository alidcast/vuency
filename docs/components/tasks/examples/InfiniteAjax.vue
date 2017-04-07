<template>
  <div class="infinite-ajax">
    <ul class="ajax-calls">
      <li v-for="log in logs"
          :style="{ color: log.color }">
        {{ log.message }}
      </li>
    </ul>

    <div class="ajax-controls" v-if="logs">
      <button v-if="infiniteAjax.isActive" @click="infiniteAjax.abort()">
        Nuke All
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

    return t(function * infiniteAjax() {
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
    .onDestroy(() => {
      loopingAjax.abort()
      this.instances = []
    })
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

<style>
.infinite-ajax {
  min-height: 12rem;
}
.ajax-calls,
.ajax-controls {
  display: inline-block;
  vertical-align: top;
  margin: 1rem;
}

.ajax-calls {
  width: 60%
}

.ajax-controls {
  min-width: 20%;
}
.ajax-controls ul {
  list-style: none;
  padding-left: 0;
}
</style>
