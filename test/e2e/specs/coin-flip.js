module.exports = {
  'coin-flip': function(browser) {
    browser
      .url('http://localhost:8080/coin-flip')
      .waitForElementVisible('#app', 500)
      // updates task state
      .assert.containsText('.coin-flip button', 'Flip coin')
      .click('.coin-flip button')
      .waitFor(500)
      .assert.containsText('.coin-flip button', 'May the odds be with you...')
      .waitFor(500)
      .assert.containsText('.coin-flip button', 'Flip coin')
      .refresh()
      // drops repeat calls
      .click('.coin-flip button')
      .waitFor(500)
      .click('.coin-flip button')
      .waitFor(500)
      .assert.containsText('.coin-flip p', '') // calls `beforeStart` hook
      .getText(".coin-flip p", function(result1) {
          this.waitFor(1000)
          this.getText(".coin-flip p", function(result2) {
            this.assert.equal(result1.value, result2.value);
          })
      })
      .end()
  }
}
