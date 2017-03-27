/* eslint-disable no-unused-expressions */
/* global describe, it, expect, beforeEach */

import createTaskSubscriber from 'src/plugin/modifiers/task-subscriber'

describe('Task Subscribions', function() {
  let subs
  beforeEach(() => {
    let subscriber = createTaskSubscriber()
    subs = subscriber.subscriptions
  })

  it('has correct `before` subscriptions', async () => {
    expect(subs.beforeStart).to.not.be.undefined
    expect(subs.beforeYield).to.not.be.undefined
  })

  it('has correct `on` subscriptions', async () => {
    expect(subs.onCancel).to.not.be.undefined
    expect(subs.onDrop).to.not.be.undefined
    expect(subs.onRestart).to.not.be.undefined
    expect(subs.onError).to.not.be.undefined
    expect(subs.onSuccess).to.not.be.undefined
  })

  it('has correct `after` subscriptions', async () => {
    expect(subs.afterEnd).to.not.be.undefined
  })
})
