<template lang="pug">
  div.hero
    h2.hero-slogan Concurrency management <span> for Vuejs. </span>
    a.hero-action(href="guide/introduction") Get Started
</template>

<script>
export default {
  name: 'guide'
}
</script>

<style lang="sass" scoped>
@import "../assets/sass/global.sass"

.header
  +flex-contain(row)
  +flex-place('children', start, start)
  padding: 0 100px
  .header-title
    +flex-span(50%, fluid)
  .header-nav
    +flex-span(50%, fluid)
    +flex-contain(row)
    .header-nav-item
      +flex-place('self', end, null)
      margin-top: 1.25rem
.hero
  +flex-contain(column)
  +flex-place('children', start, center)
  .hero-slogan
    font-size: 2.75rem
</style>
