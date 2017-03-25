module.exports = {
  'random-question': function(browser) {
    browser
      .url('http://localhost:8080/random-question')
      .waitForElementVisible('#app', 500)
      .assert.containsText('.random-question p', 'What is the meaning of life?')
      // updates task state
      .assert.containsText('.random-question button', 'Ask')
      .click('.random-question button')
      .waitFor(500)
      .assert.containsText('.random-question button', 'Thinking...')
      .waitFor(500)
      .assert.containsText('.random-question button', 'Ask')
      .refresh()
      // drops repeat calls
      .click('.random-question button')
      .waitFor(500)
      .click('.random-question button')
      .waitFor(500)
      .getText(".random-question p", function(result1) {
          this.waitFor(1000)
          this.getText(".random-question p", function(result2) {
            this.assert.equal(result1.value, result2.value);
          })
      })
      .end()
  }
}
