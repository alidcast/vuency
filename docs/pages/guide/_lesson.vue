<template>
  <div>
    <ul>
      <li v-for="lesson in menu">
        <nuxt-link :to="`/guide/${lesson.slug}`">
            {{ lesson.heading }}
        </nuxt-link>
      </li>
    </ul>

    <comonent :is="currentLesson" />
  </div>
</template>

<script>
import docs from '~documentation/index'
import { compsToMenu, toHeading } from '~utilities/menu'

export default {
  name: 'lesson',

  data({ params }) {
    return {
      menu: compsToMenu(docs),
      currentLesson: params.lesson || 'introduction'
    }
  },

  head() {
    return {
      title: toHeading(this.currentLesson) + ' - Vuency'
    }
  },

  components: docs
}
</script>
