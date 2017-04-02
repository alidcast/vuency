/* eslint-disable no-unused-expressions */
/* global describe, it, expect, sinon */

import createTaskStepper from 'src/plugin/task-stepper'
import createTaskInstance from 'src/plugin/task-instance'
import createTaskSubscriptions from 'src/plugin/modifiers/task-subscriptions'
import createTaskInjections from 'src/plugin/task-injections'
import { pause } from 'src/util/async'

let { ...subscriber } = createTaskSubscriptions(),
    { provider } = createTaskInjections()

function * exTask() {
  return 'success'
}

describe('Task Stepper', function() {
  it('solves empty function', async () => {
    let operation = function * () {},
        ti = createTaskInstance({ operation }),
        stepper = createTaskStepper(ti, subscriber, provider)
    await stepper.stepThrough()
    expect(ti.value).to.be.undefined
    expect(ti.error).to.be.null
  })

  it('resolves yields from primitives', async () => {
    let ti = createTaskInstance({ operation: exTask }),
        stepper = createTaskStepper(ti, subscriber, provider)
    await stepper.stepThrough()
    expect(ti.value).to.equal('success')
  })

  it('resolves yields from function', async () => {
    let operation = function * () {
          return yield sinon.stub().returns('success')()
        },
        ti = createTaskInstance({ operation }),
        stepper = createTaskStepper(ti, subscriber, provider)
    await stepper.stepThrough()
    expect(ti.value).to.equal('success')
  })

  it('resolves yields from async function ', async () => {
    async function asyncFn() {
      return await sinon.stub().returns('success')()
    }
    let operation = function * () {
          return yield asyncFn()
        },
        ti = createTaskInstance({ operation }),
        stepper = createTaskStepper(ti, subscriber, provider)
    await stepper.stepThrough()
    expect(ti.isResolved).to.true
    expect(ti.value).to.equal('success')
  })

  it('resolves the task instance', async () => {
    let operation = function * () {
          return 'success'
        },
        ti = createTaskInstance({ operation }),
        stepper = createTaskStepper(ti, subscriber, provider)
    await stepper.stepThrough()
    expect(ti.hasStarted).to.be.true
    expect(ti.isResolved).to.be.true
    expect(ti.isRejected).to.be.false
    expect(ti.isCanceled).to.be.false
    expect(ti.value).to.equal('success')
  })

  it('rejects the task instance', async () => {
    let operation = function * () {
          return yield sinon.stub().returns('failed').throws()()
        },
        ti = createTaskInstance({ operation }),
        stepper = createTaskStepper(ti, subscriber, provider)
    await stepper.stepThrough()
    expect(ti.isRejected).to.be.true
    expect(ti.isResolved).to.be.false
    expect(ti.isCanceled).to.be.false
    // TODO should rejected task still attempt to return value?
    expect(ti.value).to.be.null
    expect(ti.error).to.not.be.null
  })

  it('drops the task', () => {
    let ti = createTaskInstance({ operation: exTask }),
        stepper = createTaskStepper(ti, subscriber, provider)
    stepper.triggerCancel()
    stepper.stepThrough()
    expect(ti.hasStarted).to.be.false
    expect(ti.isCanceled).to.be.true
    expect(ti.isDropped).to.be.true
    expect(ti.value).to.be.null
    expect(ti.error).to.be.null
  })

  it('cancels the task', async () => {
    let operation = function * () {
          return yield pause(500)
        },
        ti = createTaskInstance({ operation }),
        stepper = createTaskStepper(ti, subscriber, provider),
        ongoing = stepper.stepThrough()
    stepper.triggerCancel()
    await ongoing
    expect(ti.isCanceled).to.be.true
    expect(ti.isResolved).to.be.false
    expect(ti.isRejected).to.be.false
    expect(ti.value).to.be.null
    expect(ti.error).to.be.null
  })

  it('runs finally block upon completion', async () => {
    let result,
        operation = function * () {
          try {
            result = 'try'
            yield pause(500)
          } finally {
            result = 'finally'
          }
        },
        ti = createTaskInstance({ operation }),
        stepper = createTaskStepper(ti, subscriber, provider),
        ongoing = stepper.stepThrough()
    await ongoing
    expect(result).to.equal('finally')
  })

  it('runs finally block upon cancelation', async () => {
    let result,
        operation = function * () {
          try {
            result = 'try'
            yield pause(500)
          } finally {
            result = 'finally'
          }
        },
        ti = createTaskInstance({ operation }),
        stepper = createTaskStepper(ti, subscriber, provider),
        ongoing = stepper.stepThrough()
    stepper.triggerCancel()
    await ongoing
    expect(ti.isCanceled).to.be.true
    expect(result).to.equal('finally')
  })

  it('resolves yields server request', async () => {
    function * taskReq() {
      let server = sinon.fakeServer.create()
      server.respondWith('GET',
        '/fake/req',
        [200,
          { 'Content-Type': 'application/json' },
          'Success'
        ])

      function getReq() {
        let req
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            req = xhr.responseText
          }
        }
        xhr.open('GET', '/fake/req')
        xhr.send()
        server.respond()
        return req
      }
      return yield getReq()
    }

    let ti = createTaskInstance({ operation: taskReq }),
        stepper = createTaskStepper(ti, subscriber, provider)
    await stepper.stepThrough()
    expect(ti.isResolved).to.be.true
    expect(ti.isRejected).to.be.false
    expect(ti.value).to.equal('Success')
  })
})
