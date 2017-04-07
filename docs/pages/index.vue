<template lang="pug">
  div.landing-container
    div.intro-container
      h1.intro-title Vue + Concurrency = Vuency
      h3.intro-description
        | Gain complete control and transparency over the execution of concurrent
        |  and asyncronous operations, with almost no code.
    div.benefits-container
      ul
        li.benefit-section
          span.icon-control
          div
            h4 Manage the flow of repeat requests
            p
              | Vuency has task scheduling and cancellation baked in, so
              | controlling if and how repeat calls to the same operation
              | are run is effortless.
        li.benefit-section
          span.icon-load
          div
            h4 Handle common UI operations
            p
              | Vuency has a task's state baked in, so common UI operations
              | such as displaying loading spinners or styling inactive buttons
              | take minimal code.
        li.benefit-section
          span.icon-work
          div
            h4 Minimize boilerplate
            p
              | Save time and effort handling corner cases and cleaning up after
              | complex operations.
        li.benefit-section
          span.icon-code
          div
            h4 Write declarative code
            p
              | Deliver code that is easier to reason about and
              | maintain, and feels "at home" for Vue developers.
    div.actions-container
      a.action-link(href="/guide/introduction")
        p Learn More
      a.action-link(href="/guide/getting-started")
        p Get Started
</template>

<style lang="sass">
@import "../assets/sass/global.sass"

.landing-container
  max-width: 55rem
  margin: 0 auto

.intro-container
  width: 88%
  margin: 0 auto
  .intro-title
    font-size: 1.5rem
    +media('>tablet')
      font-size: 2.5rem
  .intro-description
    font-size: 1.125rem
    font-weight: 400
    margin-top: 0
    +media('>tablet')
      font-size: 1.5rem

.benefits-container
  margin: 3rem auto 0 auto
  ul
    padding-left: 0
    +flex-contain(row, wrap)
    +flex-place('children', start, top)
  .benefit-section
    +flex-contain(row, wrap)
    +flex-place('children', center, start)
    padding: .25rem
    +flex-span(100%)
    +media('>tablet')
      +flex-span(50%)
    span
      font-size: 1.5rem
      padding: 0 .5rem 0 0
      +media('>tablet')
        font-size: 2rem
    h4
      margin-top: 0
    div
      +flex-span(84%)

.actions-container
  +flex-contain(row, wrap)
  +flex-place('children', center, center)
  text-align: center
  .action-link
    +flex-span(40%)
    +flex-place('children', center, center)
    margin: .5rem
    // button theme
    background-color: #3b8070
    border-color: #3b8070
    color: #fff
    border-radius: .4rem
    padding: .5rem 0 .025rem 0
    text-decoration: none
    +media('>tablet')
      +flex-span(30%)
      margin: 2rem
      padding: .5rem .5rem .125rem .5rem
    p
      font-size: 1.125rem
      +flex-place('self', center, center)
      +media('>tablet')
        font-size: 1.75rem
</style>
