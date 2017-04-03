<script>
import InfiniteAjax from '~components/tasks/examples/InfiniteAjax.vue'

export default {
  components: {
    InfiniteAjax
  }
}
</script>

## Infinite Ajax

<div class="showcase">
    <InfiniteAjax />
</div>

#### Javascript

```js
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
    // Only allow 3 ajax calls to run at a time. Enqueue all others
    // to run when space frees up.
    .flow('enqueue', { maxRunning: 3 })
    // Report the result finished of the ajax call.
    .onFinish(({ params, isCanceled }) => {
      let id = params[0], color = params[1]
      if (!isCanceled) this.log(color, `Task ${id}: Done, sleeping.`)
      else this.log(color, `Task ${id}: Sorry, I've been sent to the abyss!`)
      // If all looping ajax calls weren't "nuked", keep running.
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
      // Only one infinite ajax can run at a time, drop all other calls.
      .flow('drop')
      // Simulate infinite loop: Keep the first call in running queue.
      .nthCall(1, { keepRunning: true })
      // If the instance is destroyed cancel all ajax calls and clean up.
      .onDestroy(() => {
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
```

#### Template

```html
<div class="infinite-ajax">
  <div class="ajax-controls">
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

  <ul class="ajax-calls">
    <li v-for="log in logs"
        :style="{ color: log.color }">
      {{ log.message }}
    </li>
  </ul>
</div>
```
