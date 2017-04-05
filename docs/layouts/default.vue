<template lang="pug">
  div
    ThreeSlotToolbar
    nuxt.main
</template>

<script>
import ThreeSlotToolbar from '~components/ThreeSlotToolbar'

export default {
  components: {
    ThreeSlotToolbar
  }
}
</script>

<style lang="sass">
@import "../assets/sass/global.sass"

.main
  padding: .75rem
  +media('>tablet')
    margin-left: 18rem
</style>
