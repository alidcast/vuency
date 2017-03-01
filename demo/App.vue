<template>
  <div id="app" class="component">
    <h1>{{pluginName}}</h1>

    <button @click="askQuestion.run()">
      Get Answer
    </button>
    <p>
      {{ answer }}
    </p>
  </div>
</template>


<script>
export default {
  data: () => ({
    pluginName: "Vuency",
    answer: ''
  }),

  tasks: function(t) {
    return {
      askQuestion: t(function () {
        this.answer = 'hello'
      })
    }
  }
}
</script>
