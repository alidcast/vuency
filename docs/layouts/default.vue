<template lang="pug">
  div
    ThreeSlotSidebar.sidebar-content
      div.sidebar-header(slot="top")
        a.site-title(href="/") Vuency
        p.site-slogan Concurrency management <span> for Vuejs. </span>

      div.sidebar-menu(slot="middle")
        VerticalMenu(:menu="menu")

      div.sidebar-links(slot="bottom")
        a.github-link(href="https://github.com/alidcastano/vuency")
          img#github-icon(src="~assets/img/Github-32px.png")
          span View on Github
    nuxt.main
</template>

<script>
import config from '../docs.config'
import ThreeSlotSidebar from '~components/ThreeSlotSidebar'
import VerticalMenu from '~components/VerticalMenu'

export default {
  data: () => ({
    menu: config.menu
  }),

  components: {
    ThreeSlotSidebar,
    VerticalMenu
  }
}
</script>

<style lang="sass">
@import "../assets/sass/global.sass"

.main
  margin-left: 18rem

.sidebar-content
  padding-left: 1rem
  // removed hyperlink styles
  a
    color: inherit
    text-decoration: inherit
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
    margin-top: .5rem
    padding: 1rem
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
