<template lang="pug">
  div
    comonent.content(:is="currentArticle")
</template>

<script>
import { guide } from '~articles/index'
import { toHeading } from '~utilities/to-transforms'

export default {
  data: ({ params }) => ({
    currentArticle: params.slug || 'introduction'
  }),

  head() {
    return {
      title: toHeading(this.currentArticle) + ' - Vuency'
    }
  },

  components: {
    ...guide
  }
}
</script>

<style lang="sass">
.content
  margin: 2.5rem 0 0 2rem
  max-width: 40rem
  // content styles
  h1
    margin-bottom: 1rem
  h2
    border-bottom: 1px solid #ddd
    padding-bottom: .5rem
    margin-bottom: 1rem
    margin-top: 2rem
</style>
