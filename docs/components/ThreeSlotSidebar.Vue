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
  +flex-span(20%, fixed)
  +flex-place('children', center, center)
.middle
  +flex-span(fluid)
  +color('primary 50')
.bottom
  +flex-span(10%, fixed)
  +flex-place('children', center, center)
</style>
