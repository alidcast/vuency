<script>
import CoinFlip from '~components/tasks/examples/CoinFlip.vue'

export default {
  components: {
    CoinFlip
  }
}
</script>

## Coin Flip

<div class="showcase">
    <CoinFlip />
</div>

#### Javascript

```js
export default {
  data: () => ({
    answer: ''
  }),
  tasks: (t, { timeout }) => ({
    flipCoin: t(function* () {
      // Take some time before giving answer so that button UI
      // can update smoothly.
      this.answer = yield timeout(1000)
        .then(() => Math.random() < 0.5 ? 'Heads' : 'Tails')
    })
    // Don't allow repeat calls to fire (one flip at a time!).
    .flow('drop')
    // Cleanup after each flip.
    .beforeStart(function () {
      this.answer = ''
    })
  })
}
```

#### Template

```html
<div class="coin-flip">
  <p> Heads or Tails? {{ this.answer }} </p>
  <button @click="flipCoin.run()">
    {{ flipCoin.isActive ? 'May the odds be with you...' : 'Flip coin'}}
  </button>
</div>
```
