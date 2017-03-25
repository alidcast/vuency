module.exports = {
  'countdown-timer': function(browser) {
    browser
      .url('http://localhost:8080/countdown-timer')
      .waitForElementVisible('#app', 500)
      .assert.containsText('.countdown-timer p', 'Count: 10')
      // resets time
      .click('.countdown-timer button')
      .waitFor(300)
      .assert.containsText('.countdown-timer p', 'Count: 9')
      .click('.countdown-timer button')
      .assert.containsText('.countdown-timer p', 'Count: 10')
      // runs to completion
      .refresh()
      .click('.countdown-timer button')
      .waitFor(3500)
      .assert.containsText('.countdown-timer p', 'Count: DONE')
      .end()
  }
}
