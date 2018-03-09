const test = require('tape')

const patientFactory = require('./patient')
 
test('Heartbeat event emission count is correct', (assert) => {

    let heartbeatCount = 0
    const expectedHeartbeatCount = 2

    const patient = patientFactory(function (event) {
        if (event.eventType == 'Heartbeat')
            heartbeatCount += 1
    }, 'The ID', 2)

    setTimeout(() => {
        patient.stop()
        assert.equal(heartbeatCount, expectedHeartbeatCount)
    }, 5000)

    assert.plan(1)
    patient.start()
})


test('Heartbeat event emission has correct event type and source', (assert) => {

    const expectedSource = 'The ID'
    const expectedEventType = 'Heartbeat'

    assert.plan(2)
    const patient = patientFactory(function (event) {
        assert.equal(event.eventType, expectedEventType, `Event type is ${event.eventType}, expected ${expectedEventType}`)
        assert.equal(event.source, expectedSource, `Event source ${event.source}, expected ${expectedEventType}`)
        patient.stop()
    }, expectedSource, 1)

    patient.start()
})