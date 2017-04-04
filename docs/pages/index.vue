<template lang="pug">
  div.landing-container
    div.intro-container
      h1.intro-title Vue + Concurrency = Vuency
      h3.intro-description
        | Gain complete control and transparency over the execution of concurrent
        |  and asyncronous operations, with almost no code.
    div
      ul.benefits-container
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
  margin-top: 2.5rem
.intro-container
  width: 88%
  margin: 0 auto
  padding-left: 2rem
  .intro-description
    font-weight: 400
    margin-top: 0
.benefits-container
  +flex-contain(row, wrap)
  +flex-place('children', space-between, top)
  margin-top: 3rem
  .benefit-section
    +flex-span(50%)
    +flex-contain(row, wrap)
    +flex-place('children', center, start)
    padding: .25rem
    span
      +flex-span(16%)
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
    +flex-span(25%)
    +flex-place('self', space-between, center)
    margin: 2rem
    // button theme
    background-color: #3b8070
    border-color: #3b8070
    color: #fff
    // button styling
    padding: .5rem .5rem .125rem .5rem
    border-radius: .4rem
    p
      font-size: 1.75rem
      +flex-place('self', center, center)
</style>
