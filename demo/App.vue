<template>
  <div id="app" class="component">
    <h1>{{pluginName}}</h1>

    <!-- <p>
      {{ this.answer }}
    </p>
    <button @click="askQuestion.run()">
      Get Answer
    </button> -->
  </div>
</template>


<script>
export default {
  data: () => ({
    pluginName: "Vuency",
    answer: ''
  })
  // ,
  //
  // tasks: [
  //   function* askQuestion() {
  //     this.answer = 'hello'
  //   }
  // ]
}
</script>
