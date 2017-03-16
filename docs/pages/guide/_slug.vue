<template lang="pug">
  div
    comonent(:is="currentArticle")
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
