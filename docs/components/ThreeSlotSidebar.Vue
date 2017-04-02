<template lang="pug">
  div.sidebar
    div.top
      slot(name="top")
    div.middle
      slot(name="middle")
    div.bottom
      slot(name="bottom")
</template>


<style lang="sass" scoped>
@import "../assets/sass/global.sass"

.sidebar
  +flex-contain(column)
  +position('fixed', 0, null, 0, 0)
  +color('primary 100')
.top
  +flex-span(12%, fixed)
  margin: .75rem 1rem 1.5rem 1rem
.middle
  +flex-span(68%, fixed)
  +color('primary 50')
  overflow-y: scroll
  // create border helper
  border-top: #3b8070 2px solid
  border-left: #3b8070 2px solid
  // margin-bottom: 1rem
.bottom
  +flex-span(10%, fixed)
</style>
