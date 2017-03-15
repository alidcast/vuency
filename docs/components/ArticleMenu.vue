<template>
  <div>
    <ul>
      <li v-for="article in menu">
        <nuxt-link :to="`/guide/${article.slug}`">
            {{ article.heading }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { toHeading, toSlug } from '~utilities/to-transforms'

export default {
  props: {
    articles: { type: Array }
  },

  data() {
    return {
      menu: compsToMenu(this.articles)
    }
  }
}

/**
 * Converts array of article names to array of menu option objects.
 */
function compsToMenu(comps) {
  let menu = []
  comps.forEach(key => {
    menu.push({
      heading: toHeading(key),
      slug: toSlug(key)
    })
  })
  return menu
}
</script>
