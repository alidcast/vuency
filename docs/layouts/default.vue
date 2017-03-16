<template lang="pug">
  div
    nuxt.main
    div.sidebar
      div.top
        a.site-title(href="/") Vuency
      ul.center.menu
        template(v-for="(group, index) in menu")
          li.heading.group {{ menu[index][0] | titlelize }}
            li.heading.section(v-for="section in menu[index][1]")
              a(:href="`/guide/${section}`") {{ section | titlelize }}
      div.bottom
        a.github-link(href="https://github.com/alidcastano/vuency")
          img#github-icon(src="~assets/img/Github-32px.png")
          span View on Github
</template>

<script>
import config from '../docs.config'
import { toHeading } from '~utilities/to-transforms'

export default {
  data: () => ({
    menu: config.menu
  }),
  filters: {
    titlelize: toHeading
    // TODO capitalize
  }
}
</script>

<style lang="sass">
@import "../assets/sass/global.sass"

.main
  // margin-left: 15rem
  max-width: 40rem
  margin: 0 auto
.sidebar
  +flex-contain(column)
  +position('fixed', 0, null, 0, 0)
  +color('primary 100')
  .top
    +flex-span(12%, fixed)
    +flex-place('children', center, center)
  .center
    +flex-span(fluid)
    +color('primary 50')
    margin-left: 1rem
    padding: 1rem
  .bottom
    +flex-span(10%, fixed)

.site-title
  font-size: 2.5rem
.heading
  margin-bottom: .75rem
  &.group
    color: #006400

.github-link
  width: 100%
  height: 100%
  margin-top: -1rem
  padding: 1rem
  +flex-place('children', center, center)
  span
    margin: .25rem 0 0 .5rem


</style>
