<script>
import CountdownTimer from '~components/tasks/examples/CountdownTimer.vue'

export default {
  components: {
    CountdownTimer
  }
}
</script>

## Countdown Timer

<div class="showcase">
    <CountdownTimer />
</div>

#### Javascript

```js
const COUNT_START = 10
export default {
  data: () => ({
    count: COUNT_START
  }),
  tasks: (t, { timeout }) => ({
    counter: t(function* () {
      this.count = COUNT_START
      while (this.count > 0) {
        // Pause for a little before counting down.
        yield timeout(300)
        --this.count
      }
      this.count = 'DONE'
    })
    // If called again, restart counter.
    .flow('restart')
  })
}
```

#### Template

```html
<div>
  <div class="countdown-timer ">
    <p> Count: {{ this.count }}</p>
    <button @click="counter.run()"> Start Over </button>
  </div>
</div>
```
