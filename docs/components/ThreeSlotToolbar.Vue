<template lang="pug">
  div.toolbar.responsive-toolbar
    div.toolbar-start
      a.site-title(href="/") Vuency
      p.site-slogan Concurrency management <span> for Vuejs. </span>

    div.toolbar-center.menu-container
      button.mobile-menu-button(@click="showMenu = !showMenu") Guide
      <VerticalMenu class="main-menu" :style="menuClass" :menu="menu" />

    div.toolbar-end
      a.github-link(href="https://github.com/alidcastano/vuency")
        span.icon-github
        h5.plugin-version ({{ version }})
</template>

<script>
import config from '../docs.config'
import VerticalMenu from '~components/VerticalMenu'
import pkg from '../../package.json'

export default {
  data: () => ({
    menu: config.menu,
    showMenu: false,
    version: pkg.version
  }),
  computed: {
    menuClass() {
      return {
        display: this.showMenu ? 'block' : 'none'
      }
    }
  },
  components: {
    VerticalMenu
  }
}
</script>

<style lang="sass" scoped>
@import "../assets/sass/global.sass"

// general toolbar styles
.toolbar
  +color('primary 100')
  padding-left: 1rem
  a
    color: inherit
    text-decoration: none

// mobile menubar turns into a fixed sidebar
.responsive-toolbar
  +flex-contain(row)
  +flex-place('children', end, center)
  width: 100vw
  height: 4rem
  +media('<=tablet')
    padding: 0 2rem
  +media('>tablet')
    +flex-contain(column)
    +flex-place('children', start, center)
    +position('fixed', 0, null, 0, 0)
    max-width: 100%
    width: 15rem
    height: 100vh
.toolbar-start
  text-align: center
  +media('<=tablet')
    +flex-place('self', start, center)
  +media('>tablet')
    margin-bottom: 2rem
.toolbar-center, .toolbar-end
  +media('>tablet')
    width: 100%

// title is always shown, but slogan is only shown in sidebar display
.site-title
  font-size: 2rem
  font-weight: 600
  +media('>tablet')
    font-size: 3.25rem
.site-slogan
  display: none
  +media('>tablet')
    margin-top: -.35rem !important
    display: block
    +position(relative)
    margin: 0 auto
    font-size: 90%
    font-weight: 400
    text-align: left
    span
      display: block
      +position(absolute, null, 0, null, null)

// mobile menu displayed on click, sidebar menu is always shown
.menu-containter
  position: relative
.mobile-menu-button
  display: block
  margin: 1rem 2rem
  padding: .5rem .75rem
  background-color: #3b8070
  border: #3b8070 1px solid
  color: #fff
  border-radius: .4rem
  +media('>tablet')
    display: none
.main-menu
  +color('primary 50')
  +position(absolute, 4rem, 0, 0, 0)
  padding: 1rem .5rem 1rem 1.5rem
  overflow: scroll
  +media('>tablet')
    // override mobile data
    display: block !important
    +position(relative, 0, 0, 0, 0)
    // theme
    border-top: #3b8070 2px solid
    border-left: #3b8070 2px solid

.github-link
  .icon-github
    font-size: 2rem
    color: #408c7a
    margin: .25rem
  .plugin-version
    display: none
  +media('>tablet')
    background-color: #408c7a
    padding: .5rem 3rem
    +flex-place('children', center, center)
    .icon-github
      +flex-span(25%)
      font-size: 2.25rem
      color: #fff
    .plugin-version
      display: block
      +flex-span(25%)
      margin: .25rem
      color: #fff
      font-size: 1.125rem
</style>
