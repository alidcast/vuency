<template>
  <div>
    <ArticleMenu :articles="articles"/>
    <comonent :is="currentArticle" />
  </div>
</template>

<script>
import ArticleMenu from '~components/ArticleMenu.vue'
import { guide } from '~articles/index'
import { toHeading } from '~utilities/to-transforms'

export default {
  data: ({ params }) => ({
    articles: Object.keys(guide),
    currentArticle: params.slug || 'introduction'
  }),

  head() {
    return {
      title: toHeading(this.currentArticle) + ' - Vuency'
    }
  },

  components: {
    ...guide,
    ArticleMenu
  }
}
</script>
