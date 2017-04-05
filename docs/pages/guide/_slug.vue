<template lang="pug">
  div
    comonent.content(:is="currentArticle")
</template>

<script>
import docs from '~articles/index'
import { toHeading } from '~utilities/to-transforms'

export default {
  asyncData: ({ params }) => ({
    currentArticle: params.slug || 'introduction'
  }),

  head() {
    return {
      title: toHeading(this.currentArticle) + ' - Vuency'
    }
  },

  components: docs
}
</script>

<style lang="sass">
.content
  max-width: 40rem
  // content styles
  h1
    margin-bottom: 1rem
  h2
    // underline
    border-bottom: 1px solid #ddd
    padding-bottom: .5rem
    // space out
    margin-top: 2rem
    margin-bottom: 1rem

.showcase
  background-color: #f9f9f9
  margin: 2rem 0 2rem 0
  padding: 1rem
</style>
