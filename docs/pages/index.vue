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
              | Vuency has task scheduling and cancelation baked in, so
              | controlling if and how repeat calls to the same operation
              | are run is effortless.
        li.benefit-section
          span.icon-load
          div
            h4 Handle common UI operations
            p
              | Vuency has a task's state is baked in, so common UI operations
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
</template>

<style lang="sass">
@import "../assets/sass/global.sass"

.landing-container
  max-width: 50rem
  margin: 0 auto
  margin-top: 2.5rem
.intro-container
  width: 90%
  margin-bottom: 1.5rem
  margin: 0 auto
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

</style>
