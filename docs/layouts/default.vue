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
          span.icon-github
          h5.plugin-version ({{ version }})
    nuxt.main
</template>

<script>
import config from '../docs.config'
import ThreeSlotSidebar from '~components/ThreeSlotSidebar'
import VerticalMenu from '~components/VerticalMenu'
import pkg from '../../package.json'

export default {
  data: () => ({
    menu: config.menu,
    version: pkg.version
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
    text-decoration: none

  // removed bullet point styles
  ul
    list-style: none
    padding-left: 0
  .sidebar-header
    text-align: center
    .site-title
      font-size: 2.75rem
      font-weight: 600
      &:hover
      text-decoration: none
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
    padding: 1rem 1rem 1rem 1.5rem
  .sidebar-links
    .github-link
      // button theme
      background-color: #408c7a
      padding: .5rem 4rem
      +flex-contain(row)
      +flex-place('children', center, center)
      .icon-github
        font-size: 2.25rem
        color: #fff
        margin: .25rem
      .plugin-version
        color: #fff
        font-size: 1.25rem
        margin: .25rem
</style>
