<template>
  <div class="container">
    <h1> Vuency </h1>
    <!-- <nuxt-link to="/guide/introduction">
      Guide
    </nuxt-link> -->
    <Test />
  </div>
</template>

<script>
import Test from '~examples/Test.vue'

export default {
  name: 'guide',

  components: {
    Test
  }
}
</script>
