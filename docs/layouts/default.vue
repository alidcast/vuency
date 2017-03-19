<template lang="pug">
  <div v-cloak>
    ThreeSlotSidebar.sidebar-content
      div.sidebar-header(slot="top")
        a.site-title(href="/") Vuency
        p.site-slogan Concurrency management <span> for Vuejs. </span>
      ul.sidebar-menu(slot="middle")
        template(v-for="(group, index) in menu")
          li.heading.group {{ menu[index][0] | titlelize }}
            li.heading.section(v-for="section in menu[index][1]")
              a(:href="`/guide/${section}`") {{ section | titlelize }}
      div.sidebar-links(slot="bottom")
        a.github-link(href="https://github.com/alidcastano/vuency")
          img#github-icon(src="~assets/img/Github-32px.png")
          span View on Github
    nuxt.main(:class="{'app--hidden': isHidden }")
  </div>
</template>

<script>
import config from '../docs.config'
import { toHeading } from '~utilities/to-transforms'
import ThreeSlotSidebar from '~components/ThreeSlotSidebar'

export default {
  data: () => ({
    menu: config.menu,
    isHidden: false
  }),
  watch: {
    $route: 'setStore'
  },
  methods: {
    setStore() {
      if (this.isHidden) this.isHidden = !this.isHidden
    }
  },
  filters: {
    titlelize: toHeading
    // TODO capitalize
  },
  components: {
    ThreeSlotSidebar
  }
}
</script>


<style>
[v-cloak] {
  display: none;
  background-color: blue;
}
</style>

<style lang="sass">
@import "../assets/sass/global.sass"

.app
  &--hidden
    display: none

.main
  margin-left: 18rem
.sidebar-content
  padding-left: 1rem
  .sidebar-header
    text-align: center
    .site-title
      font-size: 2.75rem
      font-weight: 600
    .site-slogan
      font-size: .9rem
      font-weight: 400
      text-align: left
      position: relative
      span
        display: block
        position: absolute
        right: 0
  .sidebar-menu
    padding: 1rem
    .heading
      margin-bottom: .75rem
      &.group
        color: #006400
  .sidebar-links
    .github-link
      width: 100%
      height: 100%
      margin-top: -1rem
      padding: 1rem
      +flex-place('children', center, center)
      span
        margin: .25rem 0 0 .5rem
</style>
