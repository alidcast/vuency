<template>
  <div class="container">
    <h1> Vuency </h1>
    <nav class="home-nav">
      <nuxt-link to="/guide/introduction"> Guide </nuxt-link>
      <nuxt-link to="/examples/controlling-state"> Examples </nuxt-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'guide'
}
</script>

<style lang="sass">
@import "../plugins/sass-chunks.sass"

.home-nav
  +grid-contain('row', 'nowrap')
</style>
