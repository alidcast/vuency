<template>
  <div>
    <ArticleMenu :articles="articles"/>
    <comonent :is="currentArticle" />
  </div>
</template>

<script>
import ArticleMenu from '~components/ArticleMenu.vue'
import { examples } from '~articles/index'
import { toHeading } from '~utilities/to-transforms'

export default {
  data: ({ params }) => ({
    articles: Object.keys(examples),
    currentArticle: params.slug || 'introduction'
  }),

  head() {
    return {
      title: toHeading(this.currentArticle) + ' - Vuency'
    }
  },

  components: {
    ...examples,
    ArticleMenu
  }
}
</script>
