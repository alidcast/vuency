module.exports = {
  'question-genie': function(browser) {
    browser
      .url('http://localhost:8080/question-genie')
      .waitForElementVisible('#app', 500)
      .assert.containsText('.question-genie #answer', 'Questions must contain words!')
      // watcher runs task as input changes
      .setValue('.question-genie #question', 'What is ')
      // calls `onCancel` subscription
      .assert.containsText('.question-genie #answer', 'Waiting for you to stop typing...')
      // calls `beforeYield`subscription
      .waitFor(800)
      .assert.containsText('.question-genie #answer', 'Questions usually contain a question mark. ;-)')
      // resolves task
      .setValue('.question-genie #question', 'life?')
      .waitFor(800)
      .getText(".question-genie #answer", function(result) {
        let resolved
        if (result.value === 'Yes' || result.value === 'No') resolved = true
        this.assert.equal(resolved, true)
      })
      .end()
  }
}
