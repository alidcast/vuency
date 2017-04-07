<template lang="pug">
  div.menu-container
    ul(v-for="(group, index) in menu")
      //- Figure out whether current group is a top level section (a string)
      //- or a heading with subsections (another list).
      template(v-if="isNested(group)")
        li(v-for="section in group")
          a.section-heading(:href="`/guide/${section}`")
            | {{ section | titlelize }}
      template(v-else)
        h5.group-heading {{ group[0] | titlelize | capitalize }}
        li(v-for="subsection in group[1]")
          a.section-heading(:href="`/guide/${subsection}`") {{ subsection | titlelize }}
</template>


<script>
import { toHeading } from '~utilities/to-transforms'

export default {
  props: {
    menu: {
      type: Array, required: true
    }
  },

  filters: {
    titlelize: toHeading,

    capitalize(str) {
      return str.toUpperCase()
    }
  },

  methods: {
    isNested(list) {
      return typeof list[1] === 'string'
    }
  }
}
</script>

<style lang="sass">
.menu-container
  ul
    list-style: none
    padding-left: 0
  a
    color: inherit
    &:hover
      text-decoration: none

.group-heading
  margin-bottom: .75rem
  font-size: .9rem
  font-weight: 500
  color: #006400
.section-heading
  display: block
  margin-bottom: .5rem
</style>
